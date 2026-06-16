import type { DBSong } from '../../../../shared-types/types'

export type DialogState =
  | { type: 'edit'; open: boolean; rows: DBSong[] }
  | { type: 'delete'; open: boolean; rows: number[] }
