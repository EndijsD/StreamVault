import type { Playlist } from '../../../../../shared-types/types'

export interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: Playlist
  parentId?: number
}
