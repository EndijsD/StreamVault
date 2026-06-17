import type { ItemType } from '../../../../shared-types/types'

export interface PlaylistFolderAddForm {
  image: null | string
  name: string
  description: string
}

export type AddType = Extract<ItemType, 'playlist' | 'folder'>

export interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: AddType
  parentId?: number | null
}
