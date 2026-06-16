import { Button, Dialog, DialogActions, DialogTitle, TextField } from '@mui/material'
import { useAppContext } from '../../assets/contexts/App/useAppContext'
import { useEffect, useState } from 'react'
import * as S from './styles'
import { useMutation } from '@tanstack/react-query'
import type { PlaylistFolderAddForm, Props } from './types'
import type { Errors } from '../../assets/GeneralTypes'
import { useToast } from '../../assets/contexts/Toast/useToast'
import axios from 'axios'
import { validateEmpty } from '../../assets/GeneralFunctions'
import CustomImage from '../../components/CustomImage'
import DialogClose from '../../components/DialogClose'
import { queryClient } from '../../assets/QueryClient'
import type { Folder, LibraryItem, Playlist } from '../../../../shared-types/types'
import { addLibraryItem } from './functions'

const defaultForm: PlaylistFolderAddForm = {
  image: null,
  name: '',
  description: '',
}

const AddLibraryItemDialog = ({ onOpenChange, open, type, parentId }: Props) => {
  const { t } = useAppContext()
  const [form, setForm] = useState<PlaylistFolderAddForm>(defaultForm)
  const [errors, setErrors] = useState<Errors<PlaylistFolderAddForm>>({})
  const toast = useToast()

  useEffect(() => {
    if (!open) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(defaultForm)
    setErrors({})
  }, [open])

  const { mutate: mutatePlaylist, isPending: isPendingPlaylist } = useMutation({
    mutationFn: (form: PlaylistFolderAddForm) =>
      axios.post<Playlist>('custom/playlist', {
        name: form.name,
        description: form.description,
        image: form.image,
        folderId: parentId,
      }),
    onSuccess: ({ data: playlist }) => {
      queryClient.setQueryData<LibraryItem[]>(['library'], (old) => {
        if (!old) return [playlist]

        return addLibraryItem(old, playlist, parentId)
      })

      toast({ message: 'playlist_create_success' })
      onOpenChange(false)
    },
    onError: () => {
      toast({ message: 'playlist_create_error', severity: 'error' })
    },
  })

  const { mutate: mutateFolder, isPending: isPendingFolder } = useMutation({
    mutationFn: (form: PlaylistFolderAddForm) =>
      axios.post<Folder>('custom/folder', {
        name: form.name,
        description: form.description,
        image: form.image,
        parentId,
      }),
    onSuccess: ({ data: folder }) => {
      queryClient.setQueryData<LibraryItem[]>(['library'], (old) => {
        if (!old) return [folder]

        return addLibraryItem(old, folder, parentId)
      })

      toast({ message: 'folder_create_success' })
      onOpenChange(false)
    },
    onError: () => {
      toast({ message: 'folder_create_error', severity: 'error' })
    },
  })

  const handleSubmit = () => {
    const newErrors: Errors<PlaylistFolderAddForm> = {
      ...validateEmpty(form, ['name']),
    }

    setErrors({ ...newErrors })
    if (Object.keys(newErrors).length !== 0) return

    if (type === 'playlist') mutatePlaylist(form)
    else mutateFolder(form)
  }

  return (
    <Dialog open={!!open} onClose={() => onOpenChange(false)}>
      <DialogTitle>
        {type === 'playlist' ? t('create_playlist') : t('create_folder')}

        <DialogClose onClick={onOpenChange} />
      </DialogTitle>

      <S.StyledDialogContent>
        <CustomImage type={type} size={188} image={form.image} onImageChange={(image) => setForm({ ...form, image })} />

        <S.StyledBox>
          <TextField
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
        <Button onClick={handleSubmit} loading={isPendingPlaylist || isPendingFolder} loadingPosition='start'>
          {t('create')}
        </Button>
        <Button onClick={() => onOpenChange(false)}>{t('cancel')}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddLibraryItemDialog
