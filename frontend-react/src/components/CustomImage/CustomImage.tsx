import { Delete, Folder, LibraryMusic, Radio } from '@mui/icons-material'
import * as S from './style'
import type { Props } from './types'
import { useEffect, useRef } from 'react'
import { useToast } from '../../assets/contexts/Toast/useToast'
import { useAppContext } from '../../assets/contexts/App/useAppContext'
import { Tooltip } from '@mui/material'
import { getBase64 } from '../../assets/GeneralFunctions'

const MAX_SIZE_MB = 50
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024
// const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.ogg', '.flac', '.m4a', '.aac', '.wma', '.opus']
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp']

const isImageFile = (file: File) => {
  if (file.type.startsWith('image/')) {
    return true
  }

  return IMAGE_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext))
}

const CustomImage = ({ type, size, image, onImageChange, autoOpen }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()
  const { t } = useAppContext()
  const hasOpenedRef = useRef(false)

  useEffect(() => {
    if (!autoOpen) return
    if (hasOpenedRef.current) return

    hasOpenedRef.current = true

    requestAnimationFrame(() => {
      inputRef.current?.click()
    })
  }, [autoOpen])

  useEffect(() => {
    if (!autoOpen) {
      hasOpenedRef.current = false
    }
  }, [autoOpen])

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    if (!isImageFile(file)) {
      toast({ message: 'invalid_image_file_warning', severity: 'warning' })
      return
    }

    if (file.size > MAX_SIZE_BYTES) {
      toast({
        message: <>{t(`invalid_audio_size_warning`).replace('{size}', MAX_SIZE_MB.toString())}</>,
        severity: 'warning',
      })
      return
    }

    const base64 = await getBase64(file)

    onImageChange?.(base64)
  }

  const display = image ? (
    <S.Image size={size} src={image} />
  ) : (
    <S.Empty size={size}>
      {type === 'playlist' ? <LibraryMusic /> : type === 'folder' ? <Folder /> : type === 'station' && <Radio />}
    </S.Empty>
  )

  if (onImageChange)
    return (
      // <Tooltip title={t('upload_image_tooltip').replace('{size}', MAX_SIZE_MB.toString())}>
      <S.Relative>
        <S.StyledButton onClick={() => inputRef.current?.click()}>{display}</S.StyledButton>

        {image && (
          <Tooltip title={t('delete')}>
            <S.DeleteIconButton
              onClick={() => {
                onImageChange?.(null)
                if (inputRef.current) inputRef.current.value = ''
              }}
            >
              <Delete />
            </S.DeleteIconButton>
          </Tooltip>
        )}

        <input ref={inputRef} type='file' accept='image/*' hidden onChange={handleChange} />
      </S.Relative>
      // </Tooltip>
    )

  return display
}

export default CustomImage
