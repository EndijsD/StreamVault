import express from 'express'
import general from './general.ts'
import auth from './auth.ts'
import custom from './custom.ts'
import files from './files.ts'

const router = express.Router()

router.use('/auth', auth)
router.use('/custom', custom)
router.use('/files', files)

const generalRoutes = ['users', 'folders', 'playlists', 'songs', 'folders_has_playlists', 'songs_has_playlists']

generalRoutes.forEach((route) => router.use(`/${route}`, general))

export default router
