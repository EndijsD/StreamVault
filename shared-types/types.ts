export interface DBUserStripped {
  id: number
  name: string | null
  surname: string | null
  email: string
  locale: string
}

export interface DBSong {
  id: number
  original_file_name: string
  title: string
  album: string | null
  artist: string | null
  duration_s: number
  mime_type: string
  image_base64: string | null
  upload_date: Date
  users_id: number
}

export type ItemType = 'playlist' | 'folder' | 'station' | 'music'

export interface Music {
  type: Extract<ItemType, 'music'>
  id: number
  title: string
  album: string | null
  artist: string | null
  duration: number
  image: string | null
  uploadDate: Date
}

interface LibraryNode {
  id: number
  name: string
  description: string | null
  image: string | null
  type: ItemType
}

export interface Playlist extends LibraryNode {
  type: 'playlist'
}

export interface Folder extends LibraryNode {
  type: 'folder'
  children: LibraryItem[]
}

export type LibraryItem = Folder | Playlist

export interface SearchResult {
  music: Music[]
  playlists: Playlist[]
  folders: Folder[]
}
