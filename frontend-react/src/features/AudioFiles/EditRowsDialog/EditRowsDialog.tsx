import { Button, Dialog, DialogActions, DialogContentText, DialogTitle } from '@mui/material'
import { useAppContext } from '../../../assets/contexts/App/useAppContext'
import { useEffect, useState } from 'react'
import * as S from './style'
import { useMutation } from '@tanstack/react-query'
import { useToast } from '../../../assets/contexts/Toast/useToast'
import axios from 'axios'
import type { EditRowsDialogProps } from './props'
import { queryClient } from '../../../assets/QueryClient'
// import { fileToBase64 } from '../../../functions'
import CustomImage from '../../../components/CustomImage'

type EditForm = {
  title: string
  artist: string
  album: string
  image: string | null
}

const EmptyForm: EditForm = {
  title: '',
  album: '',
  artist: '',
  image: null,
}

const EditRowsDialog = ({ open, setOpen, rows }: EditRowsDialogProps) => {
  const { t } = useAppContext()
  const [form, setForm] = useState<EditForm>(EmptyForm)
  // const [isDragging, setIsDragging] = useState(false)
  // const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  // const fileInputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()

  const handleReset = () => {
    if (rows.length > 0)
      if (rows.length > 1) {
        setForm(EmptyForm)
        // setPreviewUrl(null)
      } else {
        const { title, album, artist, image_base64 } = rows[0]
        // setPreviewUrl(image_base64)
        setForm(rows.length > 1 ? EmptyForm : { title, album: album ?? '', artist: artist ?? '', image: image_base64 })
      }
  }

  useEffect(() => {
    if (open)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleReset()
  }, [open])

  // useEffect(() => {
  //   if (!form.image) {
  //     // eslint-disable-next-line react-hooks/set-state-in-effect
  //     setPreviewUrl(null)
  //     return
  //   }

  //   const url = URL.createObjectURL(form.image)
  //   // eslint-disable-next-line react-hooks/set-state-in-effect
  //   setPreviewUrl(url)

  //   return () => URL.revokeObjectURL(url)
  // }, [form.image])

  const { mutate, isPending } = useMutation({
    mutationFn: async (form: EditForm) => {
      const { title, artist, album, image } = form

      // Convert the image File to a base64 string (without the data: prefix)
      // const image_base64 = image ? await fileToBase64(image) : undefined

      const reqForm = {
        title: rows.length === 1 ? title : undefined,
        artist,
        album,
        image_base64: image,
      }

      return axios.patch('files', {
        ids: rows.map((el) => el.id),
        data: reqForm,
      })
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ['songs'],
      })
      toast({ message: 'files_update_success' })
      setOpen(false)
    },
    onError: () => {
      toast({ message: 'files_update_error', severity: 'error' })
    },
  })

  // const handleFile = (file: File | null) => {
  //   if (!file) return
  //   if (!file.type.startsWith('image/')) {
  //     toast({ message: 'invalid_image_file', severity: 'error' })
  //     return
  //   }
  //   //2mb
  //   if (file.size > 2000000) {
  //     toast({ message: 'file_too_large', severity: 'error' })
  //     return
  //   }
  //   setForm({ ...form, image: file })
  // }

  // const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
  //   e.preventDefault()
  //   e.stopPropagation()
  //   setIsDragging(false)
  //   const file = e.dataTransfer.files?.[0] ?? null
  //   handleFile(file)
  // }

  // const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
  //   e.preventDefault()
  //   e.stopPropagation()
  //   setIsDragging(true)
  // }

  // const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
  //   e.preventDefault()
  //   e.stopPropagation()
  //   setIsDragging(false)
  // }

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0] ?? null
  //   handleFile(file)
  // }

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>
        {t('edit')} {t(rows.length > 1 ? 'files' : 'file').toLowerCase()}
        <DialogContentText>{t('edit_files_description')}</DialogContentText>
      </DialogTitle>
      <S.StyledDialogContent>
        {/* <S.StyledDropzone
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input ref={fileInputRef} type='file' accept='image/*' hidden onChange={handleInputChange} />
          {previewUrl ? (
            <S.StyledPreviewImage src={previewUrl} alt={form.image?.name ?? ''} />
          ) : (
            <Typography variant='body2'>{t('drag_and_drop_image')}</Typography>
          )}
        </S.StyledDropzone> */}
        <CustomImage
          type={'music'}
          size={188}
          image={form.image}
          onImageChange={(image) => setForm({ ...form, image })}
        />

        <S.StyledInputsCol>
          {rows.length === 1 && (
            <S.StyledTextField
              required
              size='small'
              label={t('title')}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          )}

          <S.StyledTextField
            size='small'
            label={t('artist')}
            value={form.artist}
            onChange={(e) => setForm({ ...form, artist: e.target.value })}
          />
          <S.StyledTextField
            size='small'
            label={t('album')}
            value={form.album}
            onChange={(e) => setForm({ ...form, album: e.target.value })}
          />
        </S.StyledInputsCol>
      </S.StyledDialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            mutate(form)
          }}
          loading={isPending}
          loadingPosition='start'
        >
          {t('update')}
        </Button>
        <Button onClick={() => setOpen(false)}>{t('cancel')}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditRowsDialog
