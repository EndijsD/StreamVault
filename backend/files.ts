import express from 'express'
import multer from 'multer'
import fsPromises from 'fs/promises'
import fs from 'fs'
import path from 'path'
import { authenticateSession } from './auth.ts'
import db from './db.ts'
import type { ResultSetHeader } from 'mysql2'

const router = express.Router()

const root = process.env.STORAGE_ROOT!

const getUserDir = (userId: string) => path.join(root, userId)

const getFilePath = (userId: string, fileId: string) => path.join(root, userId, fileId)

const getMetaPath = (userId: string, fileId: string) => path.join(root, userId, fileId + '.meta.json')

interface FileMeta {
  userId: string
  mimeType: string
  originalName: string
  size: number
  uploadedAt: string
}

const ensureUserDir = async (userId: string) => {
  await fsPromises.mkdir(getUserDir(userId), { recursive: true })
}

//Temporary file storage directory where files are kept until placed into a valid directory
const upload = multer({ dest: 'tmp' })

router.post('', upload.array('files'), async (req, res) => {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    return res.status(400).json({ message: 'Files were not provided' })
  }

  // const userId = req.user.id
  const userId = 1
  const files = req.files as Express.Multer.File[]

  const records = files.map((file) => ({
    tempPath: file.path,
    originalName: file.originalname,
    mimeType: file.mimetype,
  }))

  let insertedIds: number[]

  // 1. Grab a connection from the pool for the transaction
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
    // Always release back to the pool regardless of outcome
    conn.release()
  }

  // 2. Move files — same as before
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

router.get('/files/:fileId', authenticateSession, async (req, res) => {
  const fileId = req.params.fileId
  if (Array.isArray(fileId)) return res.status(400).json({ message: 'fileId must be a string' })

  const userId = req.user.id.toString()

  const filePath = getFilePath(userId, fileId)
  const metaPath = getMetaPath(userId, fileId)

  try {
    const [stat, metaRaw] = await Promise.all([fsPromises.stat(filePath), fsPromises.readFile(metaPath, 'utf-8')])

    const meta: FileMeta = JSON.parse(metaRaw)

    if (meta.userId !== userId) return res.sendStatus(403)

    const range = req.headers.range

    if (!range) {
      res.writeHead(200, {
        'Content-Type': meta.mimeType,
        'Content-Length': stat.size,
        'Accept-Ranges': 'bytes',
      })
      return fs.createReadStream(filePath).pipe(res)
    }

    const parts = range.replace('bytes=', '').split('-')
    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1

    if (start >= stat.size) {
      return res.status(416).setHeader('Content-Range', `bytes */${stat.size}`).end()
    }

    res.writeHead(206, {
      'Content-Type': meta.mimeType,
      'Content-Range': `bytes ${start}-${end}/${stat.size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': end - start + 1,
    })

    fs.createReadStream(filePath, { start, end }).pipe(res)
  } catch {
    res.sendStatus(404)
  }
})

router.delete('/files/:fileId', authenticateSession, async (req, res) => {
  const fileId = req.params.fileId
  if (Array.isArray(fileId)) return res.status(400).json({ message: 'fileId must be a string' })

  const userId = req.user.id.toString()

  try {
    const metaRaw = await fsPromises.readFile(getMetaPath(userId, fileId), 'utf-8')
    const meta: FileMeta = JSON.parse(metaRaw)

    if (meta.userId !== userId) return res.sendStatus(403)

    await Promise.all([fsPromises.unlink(getFilePath(userId, fileId)), fsPromises.unlink(getMetaPath(userId, fileId))])

    res.sendStatus(204)
  } catch {
    res.sendStatus(404)
  }
})

export default router
