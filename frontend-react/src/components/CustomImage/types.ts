import type { ItemType } from '../../../../shared-types/types'

export interface Props {
  size: string | number
  type: ItemType
  image?: string | null
  onImageChange?: (image: string | null) => void
  autoOpen?: boolean
}
