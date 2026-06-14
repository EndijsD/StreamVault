import type { TranslationKey } from '../../../assets/translations'

export type ContextMenuOption<T> = {
  action: (allRows: T[], selectedRows: T[], currentRow: T) => void
  label: TranslationKey
}

export type ContextMenuProps<T> = {
  handleClose: () => void
  anchorPosition: { top: number; left: number }
  options: ContextMenuOption<T>[]
  selectedRows: T[]
  all: T[]
  currentRow: T
}
