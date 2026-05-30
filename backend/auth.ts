import express, { type CookieOptions, type NextFunction, type Request, type Response } from 'express'
import db from './db.ts'
import bcrypt from 'bcrypt'
import jwt, { JsonWebTokenError } from 'jsonwebtoken'
import type { RowDataPacket, ResultSetHeader } from 'mysql2'
import { getErrorMessage } from './functions.ts'
import type { User } from './types.ts'

const router = express.Router()

const isProduction = process.env.NODE_ENV === 'production'

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'strict',
}

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const [rows] = await db.query<RowDataPacket[]>(`SELECT * FROM users WHERE epasts = ?`, [email])

    if (rows.length < 1) return res.status(403).json({ message: 'Invalid credentials' })
    if (rows.length > 1) return res.status(403).json({ message: 'Duplicate accounts' })

    const user = { ...rows[0] }
    const { password: hashPassword, id } = user

    const isCorrectPass = bcrypt.compareSync(password, hashPassword)

    if (!isCorrectPass) return res.status(403).json({ message: 'Invalid credentials' })

    // cleanup user object
    Object.keys(user).forEach((key) => {
      if (user[key] === null) delete user[key]
    })

    delete user.refresh_token
    delete user.password

    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET!)

    await db.query<ResultSetHeader>(`UPDATE users SET refresh_token = ? WHERE id = ?`, [refreshToken, id])

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' })

    res.cookie('refreshToken', refreshToken, cookieOptions)

    res.cookie('accessToken', accessToken, {
      maxAge: 900000,
      ...cookieOptions,
    })

    return res.status(200).json(user)
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

    const refresh_secret = process.env.REFRESH_TOKEN_SECRET
    if (!refresh_secret) return res.sendStatus(500)

    const user = jwt.verify(refreshToken, refresh_secret) as User

    const access_secret = process.env.ACCESS_TOKEN_SECRET
    if (!access_secret) return res.sendStatus(500)

    const accessToken = jwt.sign(user, access_secret, { expiresIn: '15m' })

    res.cookie('accessToken', accessToken, {
      maxAge: 900000,
      ...cookieOptions,
    })

    res.sendStatus(200)
  } catch (err: unknown) {
    if (err instanceof JsonWebTokenError) return res.status(403).json({ message: 'Invalid token' })

    res.status(500).json({ message: getErrorMessage(err) })
  }
})

router.post('/logout', async (req, res) => {
  try {
    await db.query('UPDATE lietotajs SET refresh_token = NULL WHERE refresh_token = ?', [req.cookies.refreshToken])

    res.clearCookie('refreshToken', cookieOptions)
    res.clearCookie('accessToken', cookieOptions)

    res.json({ message: 'Logged out' })
  } catch (err) {
    res.status(500).json({ message: getErrorMessage(err) })
  }
})

router.get('/check', (req, res) => {
  const accessToken = req.cookies.accessToken
  if (!accessToken) return res.sendStatus(401)

  const secret = process.env.ACCESS_TOKEN_SECRET
  if (!secret) return res.sendStatus(500)

  try {
    const user = jwt.verify(accessToken, secret) as User

    return res.status(200).json(user)
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
