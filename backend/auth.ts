import express, { type CookieOptions, type NextFunction, type Request, type Response } from 'express'
import db from './db.ts'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import type { RowDataPacket, ResultSetHeader } from 'mysql2'
import { getErrorMessage } from './functions.ts'
import type { User } from './types.ts'
import type { DBUserStripped } from '../shared-types/types.ts'

const router = express.Router()

const isProduction = process.env.NODE_ENV === 'production'

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'strict',
}

const createSession = async (user: DBUserStripped, res: Response) => {
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET
  const accessSecret = process.env.ACCESS_TOKEN_SECRET

  if (!refreshSecret || !accessSecret) {
    throw new Error('JWT secrets missing')
  }

  const refreshToken = jwt.sign(user, refreshSecret)

  await db.query('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, user.id])

  const accessToken = jwt.sign(user, accessSecret, {
    expiresIn: '15m',
  })

  res.cookie('refreshToken', refreshToken, cookieOptions)

  res.cookie('accessToken', accessToken, {
    maxAge: 900000,
    ...cookieOptions,
  })
}

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body

    const hash = await bcrypt.hash(password, 10)

    const [result] = await db.query<ResultSetHeader>(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, hash])

    const user: DBUserStripped = {
      id: result.insertId,
      name: null,
      surname: null,
      email,
      locale: 'en-US',
    }

    await createSession(user, res)
    return res.json(user)
  } catch (err) {
    res.status(500).json({ message: getErrorMessage(err) })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const [rows] = await db.query<RowDataPacket[]>(`SELECT * FROM users WHERE email = ?`, [email])

    if (rows.length < 1) return res.status(403).json({ message: 'Invalid credentials' })
    if (rows.length > 1) return res.status(403).json({ message: 'Duplicate accounts' })

    const user = { ...rows[0] }
    const { password: hashPassword } = user

    const isCorrectPass = bcrypt.compareSync(password, hashPassword)

    if (!isCorrectPass) return res.status(403).json({ message: 'Invalid credentials' })

    Object.keys(user).forEach((key) => {
      if (user[key] === null) delete user[key]
    })

    delete user.refresh_token
    delete user.password

    await createSession(user as DBUserStripped, res)
    return res.json(user)
  } catch (err) {
    res.status(500).json({ message: getErrorMessage(err) })
  }
})

router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.status(401).json({ message: 'No token' })

    const [rows] = await db.query<RowDataPacket[]>('SELECT refresh_token FROM users WHERE refresh_token = ?', [
      refreshToken,
    ])

    if (rows.length === 0 || rows[0].refresh_token !== refreshToken) {
      res.clearCookie('refreshToken', cookieOptions)
      res.clearCookie('accessToken', cookieOptions)

      return res.status(403).json({ message: 'Invalid token' })
    }

    const refreshSecret = process.env.REFRESH_TOKEN_SECRET
    if (!refreshSecret) return res.sendStatus(500)

    const user = jwt.verify(refreshToken, refreshSecret)

    const accessSecret = process.env.ACCESS_TOKEN_SECRET
    if (!accessSecret) return res.sendStatus(500)

    const accessToken = jwt.sign(user, accessSecret)

    res.cookie('accessToken', accessToken, {
      maxAge: 900000,
      ...cookieOptions,
    })

    res.sendStatus(200)
  } catch (err: unknown) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ message: 'Invalid token' })
    }

    res.status(500).json({ message: getErrorMessage(err) })
  }
})

router.post('/logout', async (req, res) => {
  try {
    await db.query('UPDATE users SET refresh_token = NULL WHERE refresh_token = ?', [req.cookies.refreshToken])

    res.clearCookie('refreshToken', cookieOptions)
    res.clearCookie('accessToken', cookieOptions)

    res.json({ message: 'Logged out' })
  } catch (err) {
    res.status(500).json({ message: getErrorMessage(err) })
  }
})

router.get('/check', async (req, res) => {
  const accessToken = req.cookies.accessToken
  if (!accessToken) return res.sendStatus(401)

  const secret = process.env.ACCESS_TOKEN_SECRET
  if (!secret) return res.sendStatus(500)

  try {
    const user = jwt.verify(accessToken, secret) as User

    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [user.id])

    if (rows.length < 1) return res.status(403).json({ message: 'Invalid token' })
    if (rows.length > 1) return res.status(403).json({ message: 'Duplicate accounts' })

    const dbUser = rows[0] as unknown as User

    const updatedUser: DBUserStripped = {
      email: dbUser.email,
      id: dbUser.id,
      name: dbUser.name,
      surname: dbUser.surname,
      locale: dbUser.locale,
    }

    return res.status(200).json(updatedUser)
  } catch {
    return res.status(403).json({ message: 'Invalid token' })
  }
})

export const authenticateSession = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accessToken
  if (!accessToken) return res.sendStatus(401)

  const secret = process.env.ACCESS_TOKEN_SECRET
  if (!secret) return res.sendStatus(500)

  try {
    const user = jwt.verify(accessToken, secret) as User

    req.user = user
    next()
  } catch {
    return res.status(403).json({ message: 'Invalid token' })
  }
}

export default router
