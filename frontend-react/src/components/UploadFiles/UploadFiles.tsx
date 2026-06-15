import { useState, useCallback, useRef } from 'react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material'
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  AudioFile as AudioFileIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import axios, { isAxiosError } from 'axios'
import { useMutation } from '@tanstack/react-query'
import { useToast } from '../../assets/contexts/Toast/useToast'
import * as S from './style'
import { queryClient } from '../../assets/QueryClient'
import { useAppContext } from '../../assets/contexts/App/useAppContext'
import type { Props } from './types'
const ACCEPTED_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac', 'audio/aac', 'audio/mp4']
const ACCEPTED_EXTENSIONS = '.mp3,.wav,.ogg,.flac,.aac,.m4a'
const MAX_FILE_SIZE_MB = 50

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatFileName(name: string): string {
  return name.replace(/\.[^/.]+$/, '')
}

const UploadFiles = ({ onOpenChange, open }: Props) => {
  const [files, setFiles] = useState<File[]>([])
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { t } = useAppContext()
  const toast = useToast()
  const addFiles = useCallback((incoming: File[]) => {
    const valid = incoming.filter((f) => {
      const isType = ACCEPTED_TYPES.includes(f.type) || f.name.match(/\.(mp3|wav|ogg|flac|aac|m4a)$/i)
      const isSize = f.size <= MAX_FILE_SIZE_MB * 1024 * 1024
      return isType && isSize
    })

    setFiles((prev) => [...prev, ...valid])
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      addFiles(Array.from(e.dataTransfer.files))
    },
    [addFiles],
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => setDragging(false)
  const handleBrowse = () => inputRef.current?.click()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files))
      e.target.value = ''
    }
  }

  const removeFile = (id: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== id))
  }

  const postFiles = () => {
    const formData = new FormData()
    files.forEach((el) => formData.append('files', el))
    return axios.post('/files', formData)
  }

  const { mutate, isPending } = useMutation({
    mutationFn: postFiles,
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ['songs'],
      })
      handleClose()
    },
    onError: (error) => {
      if (isAxiosError(error) && error.status === 403) {
        toast({ message: 'login_credentials_error', severity: 'warning' })
        return
      }
      toast({ message: 'something_went_wrong', severity: 'error' })
    },
  })

  const handleClose = () => {
    onOpenChange(false)
    setFiles([])
  }

  const submit = () => {
    if (isPending) return
    if (files.length == 0) {
      toast({ message: 'upload_no_files', severity: 'warning' })
      return
    }
    mutate()
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <S.StyledDialogTitle>
        <S.TitleTop>
          <Box flex={1}>
            <Typography variant='h6' fontWeight={700} lineHeight={1.2}>
              {t('upload_audio_files')}
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              MP3, WAV, OGG, FLAC, AAC · Max {MAX_FILE_SIZE_MB} MB each
            </Typography>
          </Box>

          <div>
            <IconButton onClick={handleClose} size='small'>
              <CloseIcon fontSize='small' />
            </IconButton>
          </div>
        </S.TitleTop>

        <S.UploadBox
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleBrowse}
          dragging={dragging}
        >
          <S.UploadBoxContent>
            <CloudUploadIcon sx={{ fontSize: 28, color: '#6C63FF' }} />
          </S.UploadBoxContent>
          <Box textAlign='center'>
            <Typography fontWeight={600} variant='body1'>
              {t('drop_files_here')}
            </Typography>
            <Typography variant='body2' color='text.secondary' mt={0.25}>
              {t('or')}{' '}
              <Typography
                component='span'
                variant='body2'
                sx={{ color: '#6C63FF', fontWeight: 600, textDecoration: 'underline' }}
              >
                {t('browse_device')}
              </Typography>
            </Typography>
          </Box>
          <input ref={inputRef} type='file' accept={ACCEPTED_EXTENSIONS} multiple hidden onChange={handleInputChange} />
        </S.UploadBox>
      </S.StyledDialogTitle>

      <DialogContent sx={{ py: 0 }}>
        {files.length > 0 && (
          <Box>
            <Typography variant='subtitle2' color='text.secondary' mb={1} fontWeight={600}>
              {files.length} {files.length == 1 ? t('file') : t('files')}
            </Typography>
            <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {files.map((f, i) => (
                <ListItem
                  key={i}
                  sx={{
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    px: 2,
                  }}
                >
                  <Box display='flex' alignItems='center' width='100%'>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <AudioFileIcon sx={{ color: '#6C63FF', fontSize: 24 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant='body2' fontWeight={600} noWrap sx={{ maxWidth: 220 }} title={f.name}>
                          {formatFileName(f.name)}
                        </Typography>
                      }
                      secondary={
                        <Typography variant='caption' color='text.secondary'>
                          {formatBytes(f.size)}
                        </Typography>
                      }
                    />
                    <Chip
                      label={t('ready')}
                      size='small'
                      color={'primary'}
                      variant='filled'
                      sx={{ fontSize: 12, height: 24 }}
                    />
                    <IconButton
                      size='small'
                      edge='end'
                      onClick={() => removeFile(i)}
                      sx={{ color: 'text.disabled', '&:hover': { color: 'error.main' } }}
                    >
                      <DeleteIcon fontSize='small' />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 3,
          gap: 1,
        }}
      >
        <Button variant='contained' loading={isPending} onClick={submit} startIcon={<CloudUploadIcon />}>
          {t('upload')} {files.length > 0 ? `${files.length} ${files.length == 1 ? t('file') : t('files')}` : ''}
        </Button>

        <Button onClick={handleClose} variant='outlined'>
          {t('cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UploadFiles
