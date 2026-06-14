import type { TranslationKey } from '../../../assets/translations'

export type ContextMenuOption = { action: () => void; label: TranslationKey }

export type ContextMenuProps = {
  handleClose: () => void
  anchorPosition: { top: number; left: number }
  options: ContextMenuOption[]
}
