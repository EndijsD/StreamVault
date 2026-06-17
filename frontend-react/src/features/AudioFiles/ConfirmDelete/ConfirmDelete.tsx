import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useAppContext } from '../../../assets/contexts/App/useAppContext'
import { useToast } from '../../../assets/contexts/Toast/useToast'
import { queryClient } from '../../../assets/QueryClient'
import type { ConfirmDeleteProps } from './props'
import type { DBSong } from '../../../../../shared-types/types'

const ConfirmDelete = ({ open, setOpen, songIds }: ConfirmDeleteProps) => {
  const { t } = useAppContext()
  const toast = useToast()

  const { mutate, isPending } = useMutation({
    mutationFn: () => axios.delete('files', { data: { songIds } }),
    onSuccess: async () => {
      queryClient.setQueryData<DBSong[]>(['songs'], (old) => old?.filter((s) => !songIds.includes(s.id)))
      // queryClient.setQueryData<DBSong[]>(['playlist_songs'], (old) => old?.filter((s) => !songIds.includes(s.id)))
      queryClient.invalidateQueries({ queryKey: ['playlist_songs'] })

      toast({ message: 'files_delete_success' })
      setOpen(false)
    },
    onError: () => {
      toast({ message: 'files_delete_error', severity: 'error' })
    },
  })

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>
        {t('delete')} {t(songIds.length > 1 ? 'files' : 'file').toLowerCase()}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{t('confirm_delete_description')}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color='error' onClick={() => mutate()} loading={isPending} loadingPosition='start'>
          {t('delete')}
        </Button>
        <Button onClick={() => setOpen(false)}>{t('cancel')}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDelete
