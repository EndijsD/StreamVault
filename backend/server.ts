import express from 'express'
import cors from 'cors'
import routes from './routes.js'
import cookieParser from 'cookie-parser'

const app = express()
const http_port = Number(process.env.HTTP_PORT)

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))
app.use(express.json({ limit: '50mb' }))
app.use(cookieParser())
app.use('/', routes)

app.listen(http_port, () => console.log(`HTTP server is running on port ${http_port}`))
