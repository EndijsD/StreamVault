import type { LibraryItem } from '../../../../shared-types/types'

export interface Props {
  data: LibraryItem
  onClick?: (id: number) => void
}
