import express from 'express'
import general from './general.ts'
import auth from './auth.ts'
import custom from './custom.ts'

const router = express.Router()

router.use('/auth', auth)
router.use('/custom', custom)

const generalRoutes = ['users', 'folders', 'playlists', 'songs']

generalRoutes.forEach((route) => router.use(`/${route}`, general))

export default router
