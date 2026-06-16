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

export type LibraryType = 'playlist' | 'folder' | 'station'

interface LibraryNode {
  id: number
  name: string
  description: string | null
  image: string | null
  type: LibraryType
}

// export const LibraryType = {
//   PLAYLIST: 'playlist',
//   FOLDER: 'folder',
//   STATION: 'station',
// } as const

// export type LibraryType = keyof typeof LibraryType

export interface Playlist extends LibraryNode {
  type: 'playlist'
}

export interface Folder extends LibraryNode {
  type: 'folder'
  children: LibraryItem[]
}

export type LibraryItem = Folder | Playlist
