import type { Folder } from '../../../../../shared-types/types'

export interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: Folder
}
