import type { PopoverPosition } from '@mui/material'
import type { LibraryItem } from '../../../../../shared-types/types'

interface OpenByElement {
  anchorReference: 'anchorEl'
  anchorEl: HTMLElement
}

interface OpenByPosition {
  anchorReference: 'anchorPosition'
  anchorPosition: PopoverPosition
}

export type ContextMenuOpen = OpenByElement | OpenByPosition | null

export interface Props {
  anchor: OpenByElement | OpenByPosition | null
  onClose: () => void
  parentId?: number
  item?: LibraryItem | null
}

export type Open = 'add' | 'deletePlaylist' | 'deleteFolder' | false
