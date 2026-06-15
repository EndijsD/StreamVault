import express from 'express'
import multer from 'multer'
import fsPromises from 'fs/promises'
import fs from 'fs'
import path from 'path'
import { authenticateSession } from './auth.ts'
import db from './db.ts'
import type { ResultSetHeader, RowDataPacket } from 'mysql2'
import { ZipArchive } from 'archiver'
import { parseFile } from 'music-metadata'
import type { DBSong } from '../shared-types/types.ts'
import { getErrorMessage } from './functions.ts'

const router = express.Router()

//Root directory of the audio file storage
const root = process.env.STORAGE_ROOT!

const getUserDir = (userId: string) => path.join(root, userId)

const getFilePath = (userId: string, fileId: string) => path.join(root, userId, fileId)

const ensureUserDir = async (userId: string) => {
  await fsPromises.mkdir(getUserDir(userId), { recursive: true })
}

//Temporary file storage directory where files are kept until placed into a valid directory
const upload = multer({
  dest: 'tmp',
})

router.post('', authenticateSession, upload.array('files'), async (req, res) => {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    return res.status(400).json({ message: 'Files were not provided' })
  }

  const userId = req.user.id
  const files = req.files as Express.Multer.File[]

  const records = await Promise.all(
    files.map(async (file) => {
      const metadata = await parseFile(file.path)
      const { title, album, artist, picture } = metadata.common

      let image = null
      if (picture) {
        const cover = picture?.[0]
        const imageBase64 = cover ? Buffer.from(cover.data).toString('base64') : null
        image = `data:${picture[0].format};base64,${imageBase64}`
      }

      return {
        tempPath: file.path,
        image_base64: image,
        title,
        album,
        artist,
        originalName: file.originalname,
        mimeType: file.mimetype,
        duration_s: metadata.format.duration,
      }
    }),
  )

  let insertedIds: number[]

  const conn = await db.getConnection()

  try {
    await conn.beginTransaction()

    const results = await Promise.all(
      records.map((r) => {
        return conn.query<ResultSetHeader>(
          `INSERT INTO songs (original_file_name, title, album, artist, mime_type, image_base64, upload_date, users_id, duration_s)
          VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?)`,
          [
            r.originalName,
            r.title ?? r.originalName,
            r.album,
            r.artist,
            r.mimeType,
            r.image_base64,
            userId,
            r.duration_s,
          ],
        )
      }),
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

router.patch('/', authenticateSession, async (req, res) => {
  try {
    const allowedFields = ['title', 'artist', 'album', 'image_base64']

    const updates = req.body
    const userId = req.user.id

    const updateIDs = updates.ids
    const updateData = updates.data

    if (!Array.isArray(updateIDs) || updateIDs.length === 0)
      return res.status(400).json({ message: 'Invalid updates array' })

    const fields = Object.keys(updateData ?? {}).filter((key) => allowedFields.includes(key))

    if (fields.length === 0) return res.status(400).json({ message: 'No valid updates' })

    const columnSetters = fields.map((field) => `${field} = ?`).join(', ')
    const values = fields.map((field) => updateData[field])

    const queries = updateIDs.map((id) => ({
      sql: `UPDATE songs SET ${columnSetters} WHERE id = ? and users_id = ?`,
      values: [...values, id, userId],
    }))

    await Promise.all(queries.map((q) => db.query(q.sql, q.values)))

    res.json({
      message: 'Updated entries successfully',
    })
  } catch (err) {
    res.status(500).json({ message: getErrorMessage(err) })
  }
})

router.get('/download', authenticateSession, async (req, res) => {
  const userId = req.user.id
  const raw = req.query.songIds

  if (!raw) return res.status(400).json({ message: 'songIds query param is required' })

  const conn = await db.getConnection()

  const songIds = (Array.isArray(raw) ? raw : (raw as string).split(','))
    .map((id) => parseInt(id as string, 10))
    .filter((id) => !isNaN(id))

  if (songIds.length === 0) return res.status(400).json({ message: 'No valid song IDs provided' })

  try {
    const placeholders = songIds.map(() => '?').join(', ')
    const [rows] = await conn.query<RowDataPacket[]>(
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
  } finally {
    conn.release()
  }
})

type DBSongReturn = RowDataPacket & DBSong

router.get('', authenticateSession, async (req, res) => {
  const userId = req.user.id
  const conn = await db.getConnection()

  try {
    const [result] = await conn.query<DBSongReturn[]>(`SELECT * FROM songs WHERE users_id = ?`, [userId])
    const updated = result.map((el) => ({ ...el, image_base64: el.image_base64?.toString() ?? null }))

    res.send(updated)
  } catch {
    res.sendStatus(404)
  } finally {
    conn.release()
  }
})

// Get a section of audio
router.get('/:songId', authenticateSession, async (req, res) => {
  const songId = req.params.songId
  if (Array.isArray(songId)) {
    return res.status(400).json({ message: 'Multiple ids for streaming are not allowed' })
  }

  const conn = await db.getConnection()
  const userId = req.user.id

  try {
    const [rows] = await conn.query<RowDataPacket[]>(`SELECT mime_type FROM songs WHERE id = ? AND users_id = ?`, [
      songId,
      userId,
    ])

    if (rows.length === 0) return res.sendStatus(404)

    const { mime_type } = rows[0]
    const filePath = getFilePath(userId.toString(), songId)
    const stat = await fsPromises.stat(filePath)
    const fileSize = stat.size
    const range = req.headers.range

    if (!range) {
      res.writeHead(200, {
        'Content-Type': mime_type,
        'Content-Length': fileSize,
        'Accept-Ranges': 'bytes',
      })
      return fs.createReadStream(filePath).pipe(res)
    }

    const match = range.match(/^bytes=(\d*)-(\d*)$/)
    if (!match || (!match[1] && !match[2])) {
      res.writeHead(416, { 'Content-Range': `bytes */${fileSize}` })
      return res.end()
    }

    let start: number
    let end: number

    if (match[1] === '') {
      // suffix range: bytes=-500 -> last 500 bytes
      const suffixLength = parseInt(match[2], 10)
      start = Math.max(fileSize - suffixLength, 0)
      end = fileSize - 1
    } else {
      start = parseInt(match[1], 10)
      end = match[2] ? parseInt(match[2], 10) : fileSize - 1
    }

    if (start >= fileSize || start > end) {
      res.writeHead(416, { 'Content-Range': `bytes */${fileSize}` })
      return res.end()
    }

    end = Math.min(end, fileSize - 1)

    res.writeHead(206, {
      'Content-Type': mime_type,
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': end - start + 1,
    })

    const stream = fs.createReadStream(filePath, { start, end })
    stream.on('error', () => res.destroy())
    stream.pipe(res)
  } catch {
    if (!res.headersSent) res.sendStatus(404)
  } finally {
    conn.release()
  }
})

router.delete('', authenticateSession, async (req, res) => {
  const userId = req.user.id
  const songIds = req.body?.songIds

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
