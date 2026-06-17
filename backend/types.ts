import type { RowDataPacket } from 'mysql2'
import type { Folder } from '../shared-types/types.js'

export interface UserRow extends RowDataPacket {
  id: number
  name: string | null
  surname: string | null
  email: string
  password: string
  refresh_token: string | null
  locale: string
}

export interface SongRow extends RowDataPacket {
  id: number
  original_file_name: string
  title: string
  album: string | null
  artist: string | null
  duration_s: number
  mime_type: string
  image_base64: string | null
  upload_date: string
  users_id: number
}

interface LibraryNode extends RowDataPacket {
  id: number
  name: string
  description: string | null
  image: string | null
}

export interface FolderRow extends LibraryNode {
  parent_folders_id: number | null
}

export interface PlaylistRow extends LibraryNode {}

export interface FolderPlaylistRow extends RowDataPacket {
  folders_id: number
  playlists_id: number
}

export interface TempFolder extends Folder {
  parentId: number | null
}
