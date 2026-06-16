import { Button, Dialog, DialogActions, DialogTitle, TextField } from '@mui/material'
import { useAppContext } from '../../assets/contexts/App/useAppContext'
import { useEffect, useState } from 'react'
import * as S from './styles'
import { useMutation } from '@tanstack/react-query'
import type { PlaylistFolderEditForm, Props } from './types'
import type { Errors } from '../../assets/GeneralTypes'
import { useToast } from '../../assets/contexts/Toast/useToast'
import axios from 'axios'
import { validateEmpty } from '../../assets/GeneralFunctions'
import CustomImage from '../../components/CustomImage'
import DialogClose from '../../components/DialogClose'
import { queryClient } from '../../assets/QueryClient'
import type { LibraryItem, Playlist } from '../../../../shared-types/types'
import { updateLibraryItem } from './functions'

const defaultForm: PlaylistFolderEditForm = {
  id: 0,
  image: null,
  name: '',
  description: '',
}

const EditLibraryItemDialog = ({ item, onOpenChange, open, type }: Props) => {
  const { t } = useAppContext()
  const [form, setForm] = useState<PlaylistFolderEditForm>(defaultForm)
  const [errors, setErrors] = useState<Errors<PlaylistFolderEditForm>>({})
  const toast = useToast()

  useEffect(() => {
    if (!open) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(item || defaultForm)
    setErrors({})
  }, [item, open])

  const { mutate, isPending } = useMutation({
    mutationFn: (form: PlaylistFolderEditForm) =>
      axios.patch(type === 'playlist' ? 'playlists' : 'folders', [
        {
          name: form.name,
          description: form.description,
          image: form.image,
          id: form.id,
        },
      ]),
    onSuccess: () => {
      queryClient.setQueryData<LibraryItem[]>(['library'], (old) => {
        if (!old) return old

        return updateLibraryItem(old, form.id, type, {
          name: form.name,
          description: form.description,
          image: form.image,
        })
      })

      if (type === 'playlist')
        queryClient.setQueryData<Playlist>(['playlist', form.id], (old) => {
          if (!old) return old
          return { ...old, name: form.name, description: form.description, image: form.image }
        })
      toast({ message: type === 'playlist' ? 'playlist_update_success' : 'folder_update_success' })
      onOpenChange(false)
    },
    onError: () => {
      toast({ message: type === 'playlist' ? 'playlist_update_error' : 'folder_update_error', severity: 'error' })
    },
  })

  const handleSubmit = () => {
    const newErrors: Errors<PlaylistFolderEditForm> = {
      ...validateEmpty(form, ['name']),
    }

    setErrors({ ...newErrors })
    if (Object.keys(newErrors).length !== 0) return

    mutate(form)
  }

  return (
    <Dialog open={!!open} onClose={() => onOpenChange(false)}>
      <DialogTitle>
        {type === 'playlist' ? t('edit_playlist') : t('edit_folder')}

        <DialogClose onClick={onOpenChange} />
      </DialogTitle>

      <S.StyledDialogContent>
        <CustomImage
          type={type}
          size={188}
          image={form.image}
          onImageChange={(image) => setForm({ ...form, image })}
          autoOpen={open === 'image'}
        />

        <S.StyledBox>
          <TextField
            autoFocus={open === 'name'}
            required
            size='small'
            label={t('name')}
            value={form.name}
            onChange={(e) => {
              setForm({ ...form, name: e.target.value })
              setErrors({ ...errors, name: null })
            }}
            error={!!errors.name}
            helperText={errors.name && t(errors.name)}
          />

          <TextField
            autoFocus={open === 'description'}
            maxRows={5}
            minRows={5}
            multiline
            size='small'
            label={t('description')}
            value={form.description}
            onChange={(e) => {
              setForm({ ...form, description: e.target.value })
              setErrors({ ...errors, description: null })
            }}
            error={!!errors.description}
            helperText={errors.description && t(errors.description)}
          />
        </S.StyledBox>
      </S.StyledDialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} loading={isPending} loadingPosition='start'>
          {t('change')}
        </Button>
        <Button onClick={() => onOpenChange(false)}>{t('cancel')}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditLibraryItemDialog
