import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useAppContext } from '../../../assets/contexts/App/useAppContext'
import { useToast } from '../../../assets/contexts/Toast/useToast'
import { queryClient } from '../../../assets/QueryClient'
import type { ConfirmDeleteProps } from './props'

const ConfirmDelete = ({ open, setOpen, songIds }: ConfirmDeleteProps) => {
  const { t } = useAppContext()
  const toast = useToast()

  const { mutate, isPending } = useMutation({
    mutationFn: () => axios.delete('files', { data: { songIds } }),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ['songs'],
      })
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
