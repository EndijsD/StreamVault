import type { PopoverPosition, SxProps } from '@mui/material'
import type { TranslationKey } from '../../assets/translations'
import type { Theme } from '@mui/material/styles'
import type { Dispatch, SetStateAction } from 'react'

export type OrderDir = 'asc' | 'desc' | null
export type DisplayType = 'list' | 'compact'
export type RowStyleFn<T> = (row: T) => SxProps<Theme> | undefined
export type Order<T> = { orderDir: OrderDir; orderBy: keyof T | null }

export interface ColumnDef<T> {
  id: keyof T
  label: TranslationKey
  disablePadding?: boolean
  sort?: (a: T, b: T) => number
  render?: (value: T[keyof T], row: T, dense: boolean) => React.ReactNode
}

export interface TableContextData<T> {
  currentRow: T
  selectedRows: T[]
  allRows: T[]
}

export interface DataTableProps<T extends { id: number | string }> {
  rows: T[]
  columns: ColumnDef<T>[]
  orderState: Order<T>
  setOrderState: Dispatch<SetStateAction<Order<T>>>
  height?: string
  onPlayPlaylist: () => void
  playlistID: string
  onRowDoubleClick?: (row: T) => void
  onContextMenu?: ({ data, position }: { data: TableContextData<T>; position: PopoverPosition }) => void
}

export interface ToolbarProps {
  displayType: DisplayType
  setDisplayType: (displayType: DisplayType) => void
  onPlayPlaylist: () => void
  playlistID: string
}

export interface TableHeadProps<T> {
  columns: ColumnDef<T>[]
  orderState: Order<T>
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void
  dense: boolean
}
