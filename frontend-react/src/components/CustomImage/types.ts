import type { LibraryType } from '../../../../shared-types/types'

export interface Props {
  size: string | number
  type: LibraryType
  image?: string | null
  onImageChange?: (image: string | null) => void
  autoOpen?: boolean
}
