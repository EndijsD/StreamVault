export interface DBUserStripped {
  id: number
  name: string | null
  surname: string | null
  email: string
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
