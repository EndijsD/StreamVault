import type { DBUserStripped } from '../shared-types/types.js'

export interface User extends DBUserStripped {
  password: string
  refresh_token: string | null
}
