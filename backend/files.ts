import express from 'express'
import multer from 'multer'
import fsPromises from 'fs/promises'
import { randomUUID } from 'crypto'
import fs from 'fs'
import path from 'path'
import { authenticateSession } from './auth.ts'
// import db from './db.ts'

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

router.post('/files', upload.array('files'), authenticateSession, async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'File was not provided' })

  // db.query(
  //   `SELECT uzdevumi.*
  //   FROM uzdevumi INNER JOIN moduli_uzdevumi
  //   ON moduli_uzdevumi.uzdevumi_id = uzdevumi.uzdevumi_id
  //   WHERE moduli_uzdevumi.moduli_id = ?`,
  //   id,
  //   (err, result) => {
  //     if (err) {
  //       res.status(500).json({ message: err.message })
  //     } else {
  //       res.send(result)
  //     }
  //   },
  // )

  const userId = req.user.id.toString()
  const fileId = randomUUID()
  await ensureUserDir(userId)

  const destination = getFilePath(userId, fileId)

  try {
    await fsPromises.rename(req.file.path, destination)
  } catch {
    await fsPromises.copyFile(req.file.path, destination)
    await fsPromises.unlink(req.file.path)
  }

  const meta: FileMeta = {
    userId,
    mimeType: req.file.mimetype,
    originalName: req.file.originalname,
    size: req.file.size,
    uploadedAt: new Date().toISOString(),
  }

  await fsPromises.writeFile(getMetaPath(userId, fileId), JSON.stringify(meta))

  res.status(201).json({ fileId, ...meta })
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
