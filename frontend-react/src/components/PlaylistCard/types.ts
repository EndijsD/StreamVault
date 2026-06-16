import type { LibraryItem, Music } from '../../../../shared-types/types'

interface Station {
  type: 'station'
  image: string
  name: string
}

export interface Props {
  data: LibraryItem | Station | Music
  onClick?: () => void
  onContextMenu?: (e: React.MouseEvent) => void
}
