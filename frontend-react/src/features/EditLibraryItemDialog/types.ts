import type { ItemType } from '../../../../shared-types/types'

export interface PlaylistFolderEditForm {
  id: number
  image: null | string
  name: string
  description: string
}

export type Focus = keyof PlaylistFolderEditForm

export interface Props {
  open: Focus | false
  onOpenChange: (open: boolean) => void
  item: PlaylistFolderEditForm
  type: Extract<ItemType, 'playlist' | 'folder'>
}
