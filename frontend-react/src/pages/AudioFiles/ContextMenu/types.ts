import type { PopoverPosition } from '@mui/material'
import type { DBSong } from '../../../../../shared-types/types'

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
  anchor: ContextMenuOpen
  onClose: () => void
  item?: { currentRow: DBSong; selectedRows: DBSong[]; allRows: DBSong[] } | null
}

export type Open = 'delete' | 'edit' | false
