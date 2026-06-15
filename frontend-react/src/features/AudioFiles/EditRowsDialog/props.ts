import type { Dispatch, SetStateAction } from 'react'
import type { DBSong } from '../../../../../shared-types/types'

export type EditRowsDialogProps = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  rows: DBSong[]
}
