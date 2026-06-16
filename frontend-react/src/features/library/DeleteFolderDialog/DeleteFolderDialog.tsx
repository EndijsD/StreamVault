import { Button, Dialog, DialogActions, DialogContentText, DialogTitle } from '@mui/material'
import { useAppContext } from '../../../assets/contexts/App/useAppContext'
import * as S from './styles'
import { useMutation } from '@tanstack/react-query'
import type { Props } from './types'
import { useToast } from '../../../assets/contexts/Toast/useToast'
import axios from 'axios'
import DialogClose from '../../../components/DialogClose'
import { queryClient } from '../../../assets/QueryClient'
import type { LibraryItem } from '../../../../../shared-types/types'
import { removeLibraryItem } from '../DeletePlaylistDialog/functions'

const DeleteFolderDialog = ({ onOpenChange, open, item }: Props) => {
  const { t } = useAppContext()
  const toast = useToast()

  const { mutate, isPending } = useMutation({
    mutationFn: (id: number) => axios.delete('custom/folder', { data: { folderId: id } }),
    onSuccess: () => {
      queryClient.setQueryData<LibraryItem[]>(['library'], (old) => {
        if (!old) return old

        return removeLibraryItem(old, item.id, item.type)
      })

      toast({ message: 'delete_folder_success' })
      onOpenChange(false)
    },
    onError: () => {
      toast({ message: 'delete_folder_error', severity: 'error' })
    },
  })

  return (
    <Dialog open={!!open} onClose={() => onOpenChange(false)}>
      <DialogTitle>
        {t('delete_folder')}

        <DialogClose onClick={onOpenChange} />
      </DialogTitle>

      <S.StyledDialogContent>
        <DialogContentText>{t('delete_folder_confirmation').replace('{name}', `"${item.name}"`)}</DialogContentText>
      </S.StyledDialogContent>

      <DialogActions>
        <Button color='error' onClick={() => mutate(item.id)} loading={isPending} loadingPosition='start'>
          {t('delete')}
        </Button>
        <Button onClick={() => onOpenChange(false)}>{t('cancel')}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteFolderDialog
