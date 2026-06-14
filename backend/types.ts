import type { RowDataPacket } from 'mysql2'
import type { DBUserStripped, Folder } from '../shared-types/types.js'

export interface User extends DBUserStripped {
  password: string
  refresh_token: string | null
}

export type Song = {
  original_file_name: string
  mime_type: string
  image_base64: string | null
  image_mime_type: string | null
  upload_date: Date
  users_id: number
}

export interface FolderRow extends RowDataPacket {
  id: number
  name: string
  description: string | null
  parent_folders_id: number | null
  users_id: number
}

export interface PlaylistRow extends RowDataPacket {
  id: number
  name: string
  description: string | null
  users_id: number
}

export interface FolderPlaylistRow extends RowDataPacket {
  folders_id: number
  playlists_id: number
}

export interface TempFolder extends Folder {
  parentId: number | null
}
