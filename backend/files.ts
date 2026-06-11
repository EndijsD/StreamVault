import express from 'express'
import multer from 'multer'
import fsPromises from 'fs/promises'
import fs from 'fs'
import path from 'path'
import { authenticateSession } from './auth.ts'
import db from './db.ts'
import type { ResultSetHeader, RowDataPacket } from 'mysql2'
import { ZipArchive } from 'archiver'

const router = express.Router()

//Root directory of the audio file storage
const root = process.env.STORAGE_ROOT!

const getUserDir = (userId: string) => path.join(root, userId)

const getFilePath = (userId: string, fileId: string) => path.join(root, userId, fileId)

const ensureUserDir = async (userId: string) => {
  await fsPromises.mkdir(getUserDir(userId), { recursive: true })
}

//Temporary file storage directory where files are kept until placed into a valid directory
const upload = multer({ dest: 'tmp' })

router.post('', authenticateSession, upload.array('files'), async (req, res) => {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    return res.status(400).json({ message: 'Files were not provided' })
  }

  const userId = req.user.id
  const files = req.files as Express.Multer.File[]

  const records = files.map((file) => ({
    tempPath: file.path,
    originalName: file.originalname,
    mimeType: file.mimetype,
  }))

  let insertedIds: number[]

  //Grab a connection from the pool for the transaction
  const conn = await db.getConnection()

  try {
    await conn.beginTransaction()

    const results = await Promise.all(
      records.map((r) =>
        conn.query<ResultSetHeader>(
          `INSERT INTO songs (original_file_name, mime_type, image_base64, image_mime_type, upload_date, users_id)
           VALUES (?, ?, NULL, NULL, NOW(), ?)`,
          [r.originalName, r.mimeType, userId],
        ),
      ),
    )

    insertedIds = results.map(([result]) => result.insertId)

    await conn.commit()
  } catch (error) {
    await conn.rollback()
    await Promise.allSettled(records.map((r) => fsPromises.unlink(r.tempPath)))
    return res.status(500).json({ message: 'Failed to save file metadata' })
  } finally {
    conn.release()
  }

  //Move files to valid directory (storage_root/userId/songId)
  await ensureUserDir(userId.toString())

  const settled = await Promise.allSettled(
    records.map(async (r, i) => {
      const songId = insertedIds[i]
      const destination = getFilePath(userId.toString(), songId.toString())

      try {
        await fsPromises.rename(r.tempPath, destination)
      } catch {
        await fsPromises.copyFile(r.tempPath, destination)
        await fsPromises.unlink(r.tempPath)
      }

      return {
        songId,
        originalName: r.originalName,
        mimeType: r.mimeType,
        userId,
      }
    }),
  )

  const uploaded = settled
    .filter(
      (r): r is PromiseFulfilledResult<{ songId: number; originalName: string; mimeType: string; userId: number }> =>
        r.status === 'fulfilled',
    )
    .map((r) => r.value)

  const failed = settled.filter((r) => r.status === 'rejected').length

  res.status(201).json({
    uploaded,
    ...(failed > 0 && { warning: `${failed} file(s) failed to move after DB insert` }),
  })
})

router.get('/download', authenticateSession, async (req, res) => {
  const userId = req.user.id
  const raw = req.query.songIds

  if (!raw) return res.status(400).json({ message: 'songIds query param is required' })

  const songIds = (Array.isArray(raw) ? raw : (raw as string).split(','))
    .map((id) => parseInt(id as string, 10))
    .filter((id) => !isNaN(id))

  if (songIds.length === 0) return res.status(400).json({ message: 'No valid song IDs provided' })

  try {
    const placeholders = songIds.map(() => '?').join(', ')
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT id, original_file_name FROM songs WHERE id IN (${placeholders}) AND users_id = ?`,
      [...songIds, userId],
    )

    if (rows.length === 0) return res.sendStatus(404)

    res.setHeader('Content-Type', 'application/zip')
    res.setHeader('Content-Disposition', 'attachment; filename="songs.zip"')

    const archive = new ZipArchive({ zlib: { level: 6 } })

    archive.on('error', (err) => {
      res.destroy(err)
    })

    archive.pipe(res)

    for (const row of rows) {
      const filePath = getFilePath(userId.toString(), row.id.toString())
      archive.file(filePath, { name: row.original_file_name })
    }

    await archive.finalize()
  } catch {
    res.sendStatus(500)
  }
})

// Get a section of adio
router.get('/:songId', async (req, res) => {
  const songId = req.params.songId
  if (Array.isArray(songId))
    return res.status(400).json({
      message: 'Multiple ids for streaming are not allowed',
    })

  // const userId = req.user.id
  const userId = 2
  try {
    const [rows] = await db.query<RowDataPacket[]>(`SELECT mime_type FROM songs WHERE id = ? AND users_id = ?`, [
      songId,
      userId,
    ])

    if (rows.length === 0) return res.sendStatus(404)

    const { mime_type } = rows[0]
    const filePath = getFilePath(userId.toString(), songId)
    const stat = await fsPromises.stat(filePath)
    const range = req.headers.range
    console.log('range', range)

    if (!range) {
      res.writeHead(200, {
        'Content-Type': mime_type,
        'Content-Length': stat.size,
        'Accept-Ranges': 'bytes',
      })
      return fs.createReadStream(filePath).pipe(res)
    }

    const HEADER_SIZE = 128 * 1024 // 128kb covers most ID3/codec headers

    const parts = range.replace('bytes=', '').split('-')
    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1

    // If seeking past the header, prepend it
    if (start > HEADER_SIZE) {
      const headerStream = fs.createReadStream(filePath, { start: 0, end: HEADER_SIZE - 1 })
      const bodyStream = fs.createReadStream(filePath, { start, end })

      res.writeHead(206, {
        'Content-Type': mime_type,
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': end - start + 1 + HEADER_SIZE,
      })

      headerStream.pipe(res, { end: false })
      headerStream.on('end', () => bodyStream.pipe(res))
    } else {
      res.writeHead(206, {
        'Content-Type': mime_type,
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': end - start + 1,
      })
      fs.createReadStream(filePath, { start, end }).pipe(res)
    }
  } catch {
    res.sendStatus(404)
  }
})

router.delete('', authenticateSession, async (req, res) => {
  const userId = req.user.id
  const songIds = req.body?.songIds

  console.log('body', req.body)

  if (!songIds || !Array.isArray(songIds) || songIds.length === 0) {
    return res.status(400).json({ message: 'songIds must be a non-empty array' })
  }

  const conn = await db.getConnection()

  try {
    await conn.beginTransaction()

    // Delete rows that belong to this user and are requested to be deleted
    const placeholders = songIds.map(() => '?').join(', ')
    const [result] = await conn.query<ResultSetHeader>(
      `DELETE FROM songs WHERE id IN (${placeholders}) AND users_id = ?`,
      [...songIds, userId],
    )

    await conn.commit()

    // Remove files for confirmed deleted IDs
    const deleteResults = await Promise.allSettled(
      songIds.map((songId) => fsPromises.unlink(getFilePath(userId.toString(), songId.toString()))),
    )

    const failed = deleteResults.filter((r) => r.status === 'rejected').length

    res.status(200).json({
      deleted: result.affectedRows,
      ...(failed > 0 && { warning: `${failed} file(s) could not be removed from disk` }),
    })
  } catch {
    await conn.rollback()
    res.sendStatus(500)
  } finally {
    conn.release()
  }
})

export default router
