import type { DBUserStripped } from '../shared-types/types.js'

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
