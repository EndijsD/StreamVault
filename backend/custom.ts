import express from 'express'
import { authenticateSession } from './auth.ts'
import { getErrorMessage } from './functions.ts'
import type { RowDataPacket } from 'mysql2'
import db from './db.ts'
import type { User } from './types.ts'
import bcrypt from 'bcrypt'

const router = express.Router()

router.post('/change-email', authenticateSession, async (req, res) => {
  try {
    const { email: newEmail, password } = req.body

    const [rows] = await db.query<RowDataPacket[]>(`SELECT * FROM users WHERE email = ?`, [req.user.email])

    if (rows.length < 1) return res.status(403).json({ message: 'Invalid credentials' })
    if (rows.length > 1) return res.status(403).json({ message: 'Duplicate accounts' })

    const user = rows[0] as User

    const isCorrectPass = bcrypt.compareSync(password, user.password)

    if (!isCorrectPass) return res.status(403).json({ message: 'Invalid credentials' })

    await db.query(`UPDATE users SET email = ? WHERE id = ?`, [newEmail, user.id])

    res.json({ message: 'Email changed' })
  } catch (err) {
    res.status(500).json({ message: getErrorMessage(err) })
  }
})

router.post('/change-password', authenticateSession, async (req, res) => {
  try {
    const { newPassword, password } = req.body

    const [rows] = await db.query<RowDataPacket[]>(`SELECT * FROM users WHERE email = ?`, [req.user.email])

    if (rows.length < 1) return res.status(403).json({ message: 'Invalid credentials' })
    if (rows.length > 1) return res.status(403).json({ message: 'Duplicate accounts' })

    const user = rows[0] as User

    const isCorrectPass = bcrypt.compareSync(password, user.password)

    if (!isCorrectPass) return res.status(403).json({ message: 'Invalid credentials' })

    const hash = await bcrypt.hash(newPassword, 10)

    await db.query(`UPDATE users SET password = ? WHERE id = ?`, [hash, user.id])

    res.json({ message: 'Password changed' })
  } catch (err) {
    res.status(500).json({ message: getErrorMessage(err) })
  }
})

router.delete('/account', authenticateSession, async (req, res) => {
  try {
    const { password } = req.body

    const [rows] = await db.query<RowDataPacket[]>(`SELECT * FROM users WHERE email = ?`, [req.user.email])

    if (rows.length < 1) return res.status(403).json({ message: 'Invalid credentials' })
    if (rows.length > 1) return res.status(403).json({ message: 'Duplicate accounts' })

    const user = rows[0] as User

    const isCorrectPass = bcrypt.compareSync(password, user.password)

    if (!isCorrectPass) return res.status(403).json({ message: 'Invalid credentials' })

    await db.query(`DELETE FROM users WHERE id = ?`, [user.id])

    res.json({ message: 'Account deleted' })
  } catch (err) {
    res.status(500).json({ message: getErrorMessage(err) })
  }
})

export default router
