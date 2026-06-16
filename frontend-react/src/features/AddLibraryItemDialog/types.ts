import type { LibraryType } from '../../../../shared-types/types'

export interface PlaylistFolderAddForm {
  image: null | string
  name: string
  description: string
}

export type AddType = Exclude<LibraryType, 'station'>

export interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: AddType
  parentId?: number | null
}
