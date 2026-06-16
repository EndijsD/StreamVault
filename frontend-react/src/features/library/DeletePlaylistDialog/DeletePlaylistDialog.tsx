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
import { removeLibraryItem } from './functions'

const DeletePlaylistDialog = ({ onOpenChange, open, item, parentId }: Props) => {
  const { t } = useAppContext()
  const toast = useToast()

  const { mutate, isPending } = useMutation({
    mutationFn: () => axios.delete('custom/playlist', { data: { playlistId: item.id, folderId: parentId } }),
    onSuccess: () => {
      queryClient.setQueryData<LibraryItem[]>(['library'], (old) => {
        if (!old) return old

        return removeLibraryItem(old, item.id, item.type)
      })

      toast({ message: 'delete_playlist_success' })
      onOpenChange(false)
    },
    onError: () => {
      toast({ message: 'delete_playlist_error', severity: 'error' })
    },
  })

  return (
    <Dialog open={!!open} onClose={() => onOpenChange(false)}>
      <DialogTitle>
        {t('delete_playlist')}

        <DialogClose onClick={onOpenChange} />
      </DialogTitle>

      <S.StyledDialogContent>
        <DialogContentText>{t('delete_playlist_confirmation').replace('{name}', `"${item.name}"`)}</DialogContentText>
      </S.StyledDialogContent>

      <DialogActions>
        <Button color='error' onClick={() => mutate()} loading={isPending} loadingPosition='start'>
          {t('delete')}
        </Button>
        <Button onClick={() => onOpenChange(false)}>{t('cancel')}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeletePlaylistDialog
