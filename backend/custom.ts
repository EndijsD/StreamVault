import express from 'express'
import { authenticateSession } from './auth.ts'
import { getErrorMessage } from './functions.ts'
import db from './db.ts'
import type { FolderPlaylistRow, FolderRow, PlaylistRow, SongRow, TempFolder, UserRow } from './types.ts'
import bcrypt from 'bcrypt'
import type { Folder, Music, Playlist, SearchResult } from '../shared-types/types.ts'

const router = express.Router()

router.post('/change-email', authenticateSession, async (req, res) => {
  try {
    const { email: newEmail, password } = req.body

    const [rows] = await db.query<UserRow[]>(`SELECT * FROM users WHERE email = ?`, [req.user.email])

    if (rows.length < 1) return res.status(403).json({ message: 'Invalid credentials' })
    if (rows.length > 1) return res.status(403).json({ message: 'Duplicate accounts' })

    const user = rows[0]

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

    const [rows] = await db.query<UserRow[]>(`SELECT * FROM users WHERE email = ?`, [req.user.email])

    if (rows.length < 1) return res.status(403).json({ message: 'Invalid credentials' })
    if (rows.length > 1) return res.status(403).json({ message: 'Duplicate accounts' })

    const user = rows[0]

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

    const [rows] = await db.query<UserRow[]>(`SELECT * FROM users WHERE email = ?`, [req.user.email])

    if (rows.length < 1) return res.status(403).json({ message: 'Invalid credentials' })
    if (rows.length > 1) return res.status(403).json({ message: 'Duplicate accounts' })

    const user = rows[0]

    const isCorrectPass = bcrypt.compareSync(password, user.password)

    if (!isCorrectPass) return res.status(403).json({ message: 'Invalid credentials' })

    await db.query(`DELETE FROM users WHERE id = ?`, [user.id])

    res.json({ message: 'Account deleted' })
  } catch (err) {
    res.status(500).json({ message: getErrorMessage(err) })
  }
})

router.get('/library', authenticateSession, async (req, res) => {
  try {
    const [folderRows] = await db.query<FolderRow[]>('SELECT * FROM folders WHERE users_id = ?', [req.user.id])
    const [playlistRows] = await db.query<PlaylistRow[]>('SELECT * FROM playlists WHERE users_id = ?', [req.user.id])
    const [folderPlaylistRows] = await db.query<FolderPlaylistRow[]>('SELECT * FROM folders_has_playlists')

    const folderMap = new Map<number, TempFolder>()
    const playlistMap = new Map<number, Playlist>()

    // Create folder nodes
    for (const folder of folderRows) {
      folderMap.set(folder.id, {
        type: 'folder',
        id: folder.id,
        name: folder.name,
        description: folder.description,
        children: [],
        parentId: folder.parent_folders_id,
        image: folder.image ? folder.image.toString() : null,
      })
    }

    // Create playlist nodes
    for (const playlist of playlistRows) {
      playlistMap.set(playlist.id, {
        type: 'playlist',
        id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        image: playlist.image ? playlist.image.toString() : null,
      })
    }

    const rootItems: (TempFolder | Playlist)[] = []

    // Build folder hierarchy
    for (const folder of folderMap.values()) {
      if (folder.parentId) {
        const parent = folderMap.get(folder.parentId)

        if (parent) {
          parent.children.push(folder)
        }
      } else {
        rootItems.push(folder)
      }
    }

    // Track playlists that are assigned to at least one folder
    const assignedPlaylists = new Set<number>()

    // Add playlists into folders
    for (const relation of folderPlaylistRows) {
      const folder = folderMap.get(relation.folders_id)
      const playlist = playlistMap.get(relation.playlists_id)

      if (!folder || !playlist) continue

      folder.children.push({
        ...playlist,
      })

      assignedPlaylists.add(playlist.id)
    }

    // Root playlists
    for (const playlist of playlistMap.values()) {
      if (!assignedPlaylists.has(playlist.id)) {
        rootItems.push(playlist)
      }
    }

    // Remove internal parentId property
    const clean = (items: any[]) => {
      for (const item of items) {
        delete item.parentId

        if (item.type === 'folder') {
          clean(item.children)
        }
      }
    }

    clean(rootItems)

    res.json(rootItems)
  } catch (err) {
    res.status(500).json({
      message: getErrorMessage(err),
    })
  }
})

router.get('/playlist/:id', authenticateSession, async (req, res) => {
  try {
    const id = req.params.id

    const [rows] = await db.query<PlaylistRow[]>('SELECT * FROM playlists WHERE id = ?', [id])

    const row = rows.length === 1 ? rows[0] : null

    if (!row) return res.status(404).json({ message: 'Playlist not found' })

    const playlist: Playlist = {
      type: 'playlist',
      id: row.id,
      name: row.name,
      description: row.description,
      image: row.image ? row.image.toString() : null,
    }

    res.json(playlist)
  } catch (err) {
    res.status(500).json({ message: getErrorMessage(err) })
  }
})

router.post('/folder', authenticateSession, async (req, res) => {
  try {
    const { name, description = null, image = null, parentId = null } = req.body

    if (!name?.trim()) {
      return res.status(400).json({
        message: 'Name is required',
      })
    }

    if (parentId) {
      const [parents] = await db.query<FolderRow[]>('SELECT id FROM folders WHERE id = ? AND users_id = ?', [
        parentId,
        req.user.id,
      ])

      if (parents.length !== 1) {
        return res.status(404).json({
          message: 'Parent folder not found',
        })
      }
    }

    const [result]: any = await db.query(
      `
      INSERT INTO folders
      (name, description, parent_folders_id, users_id, image)
      VALUES (?, ?, ?, ?, ?)
      `,
      [name, description, parentId, req.user.id, image],
    )

    const folder: Folder = {
      type: 'folder',
      id: result.insertId,
      name,
      description,
      image,
      children: [],
    }

    res.status(201).json(folder)
  } catch (err) {
    res.status(500).json({
      message: getErrorMessage(err),
    })
  }
})

router.post('/playlist', authenticateSession, async (req, res) => {
  try {
    const { name, description = null, image = null, folderId = null } = req.body

    if (!name?.trim()) {
      return res.status(400).json({
        message: 'Name is required',
      })
    }

    if (folderId) {
      const [folders] = await db.query<FolderRow[]>('SELECT id FROM folders WHERE id = ? AND users_id = ?', [
        folderId,
        req.user.id,
      ])

      if (folders.length !== 1) {
        return res.status(404).json({
          message: 'Folder not found',
        })
      }
    }

    const [result]: any = await db.query(
      `
      INSERT INTO playlists
      (name, description, users_id, image)
      VALUES (?, ?, ?, ?)
      `,
      [name, description, req.user.id, image],
    )

    if (folderId) {
      await db.query(
        `
        INSERT INTO folders_has_playlists
        (folders_id, playlists_id)
        VALUES (?, ?)
        `,
        [folderId, result.insertId],
      )
    }

    const playlist: Playlist = {
      type: 'playlist',
      id: result.insertId,
      name,
      description,
      image,
    }

    res.status(201).json(playlist)
  } catch (err) {
    res.status(500).json({
      message: getErrorMessage(err),
    })
  }
})

router.delete('/playlist', authenticateSession, async (req, res) => {
  const connection = await db.getConnection()

  try {
    await connection.beginTransaction()

    const { playlistId, folderId } = req.body

    const [playlists] = await connection.query<PlaylistRow[]>(
      `
      SELECT *
      FROM playlists
      WHERE id = ?
      AND users_id = ?
      `,
      [playlistId, req.user.id],
    )

    if (playlists.length !== 1) {
      await connection.rollback()
      return res.status(404).json({
        message: 'Playlist not found',
      })
    }

    const [relations] = await connection.query<FolderPlaylistRow[]>(
      `
      SELECT *
      FROM folders_has_playlists
      WHERE playlists_id = ?
      `,
      [playlistId],
    )

    // deleting from root
    if (!folderId) {
      if (relations.length > 0) {
        await connection.rollback()
        return res.status(400).json({
          message: 'Playlist is linked to folders',
        })
      }

      await connection.query(
        `
        DELETE FROM playlists
        WHERE id = ?
        `,
        [playlistId],
      )

      await connection.commit()

      return res.json({
        deletedPlaylist: true,
      })
    }

    await connection.query(
      `
      DELETE FROM folders_has_playlists
      WHERE folders_id = ?
      AND playlists_id = ?
      `,
      [folderId, playlistId],
    )

    if (relations.length <= 1) {
      await connection.query(
        `
        DELETE FROM playlists
        WHERE id = ?
        `,
        [playlistId],
      )
    }

    await connection.commit()

    res.json({
      deletedPlaylist: relations.length <= 1,
    })
  } catch (err) {
    await connection.rollback()

    res.status(500).json({
      message: getErrorMessage(err),
    })
  } finally {
    connection.release()
  }
})

const getFolderIds = (folders: FolderRow[], rootId: number): number[] => {
  const ids = [rootId]

  for (const folder of folders) {
    if (folder.parent_folders_id === rootId) {
      ids.push(...getFolderIds(folders, folder.id))
    }
  }

  return ids
}

router.delete('/folder', authenticateSession, async (req, res) => {
  const connection = await db.getConnection()

  try {
    await connection.beginTransaction()

    const { folderId } = req.body

    const [folders] = await connection.query<FolderRow[]>(
      `
      SELECT *
      FROM folders
      WHERE users_id = ?
      `,
      [req.user.id],
    )

    const rootFolder = folders.find((f) => f.id === folderId)

    if (!rootFolder) {
      await connection.rollback()

      return res.status(404).json({
        message: 'Folder not found',
      })
    }

    const folderIds = getFolderIds(folders, folderId)

    const [relations] = await connection.query<FolderPlaylistRow[]>(
      `
      SELECT *
      FROM folders_has_playlists
      WHERE folders_id IN (?)
      `,
      [folderIds],
    )

    const affectedPlaylistIds = [...new Set(relations.map((r) => r.playlists_id))]

    await connection.query(
      `
      DELETE FROM folders_has_playlists
      WHERE folders_id IN (?)
      `,
      [folderIds],
    )

    for (const playlistId of affectedPlaylistIds) {
      const [remaining] = await connection.query<FolderPlaylistRow[]>(
        `
        SELECT *
        FROM folders_has_playlists
        WHERE playlists_id = ?
        `,
        [playlistId],
      )

      if (remaining.length === 0) {
        await connection.query(
          `
          DELETE FROM playlists
          WHERE id = ?
          `,
          [playlistId],
        )
      }
    }

    await connection.query(
      `
      DELETE FROM folders
      WHERE id IN (?)
      `,
      [folderIds],
    )

    await connection.commit()

    res.json({
      deletedFolderIds: folderIds,
    })
  } catch (err) {
    await connection.rollback()

    res.status(500).json({
      message: getErrorMessage(err),
    })
  } finally {
    connection.release()
  }
})

router.get('/search', authenticateSession, async (req, res) => {
  try {
    const query = String(req.query.query || '').trim()

    if (!query) {
      return res.json({
        songs: [],
        playlists: [],
        folders: [],
      })
    }

    const search = `%${query}%`

    const [songRows] = await db.query<SongRow[]>(
      `
      SELECT *
      FROM songs
      WHERE users_id = ?
      AND (
        title LIKE ?
        OR album LIKE ?
        OR artist LIKE ?
      )
      LIMIT 25
      `,
      [req.user.id, search, search, search],
    )

    const [playlistRows] = await db.query<PlaylistRow[]>(
      `
      SELECT *
      FROM playlists
      WHERE users_id = ?
      AND (
        name LIKE ?
        OR description LIKE ?
      )
      LIMIT 25
      `,
      [req.user.id, search, search],
    )

    const [folderRows] = await db.query<FolderRow[]>(
      `
      SELECT *
      FROM folders
      WHERE users_id = ?
      AND (
        name LIKE ?
        OR description LIKE ?
      )
      LIMIT 25
      `,
      [req.user.id, search, search],
    )

    const music: Music[] = songRows.map((row) => ({
      type: 'music',
      id: row.id,
      title: row.title,
      album: row.album,
      artist: row.artist,
      duration: row.duration_s,
      image: row.image ? row.image.toString() : null,
      uploadDate: new Date(row.upload_date),
    }))

    const playlists: Playlist[] = playlistRows.map((row) => ({
      type: 'playlist',
      id: row.id,
      name: row.name,
      description: row.description,
      image: row.image ? row.image.toString() : null,
    }))

    const folders: Folder[] = folderRows.map((row) => ({
      type: 'folder',
      id: row.id,
      name: row.name,
      description: row.description,
      image: row.image ? row.image.toString() : null,
      children: [],
    }))

    const result: SearchResult = {
      music,
      playlists,
      folders,
    }

    res.json(result)
  } catch (err) {
    res.status(500).json({
      message: getErrorMessage(err),
    })
  }
})

router.get('/playlists', authenticateSession, async (req, res) => {
  try {
    const songIds = String(req.query.songIds ?? '')
      .split(',')
      .map(Number)
      .filter(Number.isInteger)

    let query = `
      SELECT p.*
      FROM playlists p
      WHERE p.users_id = ?
    `

    const params: (number | string)[] = [req.user.id]

    if (songIds.length > 0) {
      query += `
        AND NOT EXISTS (
          SELECT 1
          FROM songs_has_playlists shp
          WHERE shp.playlists_id = p.id
          AND shp.songs_id IN (${songIds.map(() => '?').join(',')})
        )
      `

      params.push(...songIds)
    }

    query += ` ORDER BY p.name ASC`

    const [rows] = await db.query<PlaylistRow[]>(query, params)

    const playlists: Playlist[] = rows.map((row) => ({
      type: 'playlist',
      id: row.id,
      name: row.name,
      description: row.description,
      image: row.image ? row.image.toString() : null,
    }))

    res.json(playlists)
  } catch (err) {
    res.status(500).json({
      message: getErrorMessage(err),
    })
  }
})

export default router
