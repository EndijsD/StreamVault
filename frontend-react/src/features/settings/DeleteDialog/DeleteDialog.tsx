import {
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  Typography,
} from '@mui/material'
import { FormField } from '../../../pages/Settings/styles'
import { useAppContext } from '../../../assets/contexts/App/useAppContext'
import { useEffect, useState } from 'react'
import * as S from './styles'
import { useMutation } from '@tanstack/react-query'
import { useToast } from '../../../assets/contexts/Toast/useToast'
import axios, { isAxiosError } from 'axios'
import { useNavigate } from 'react-router'
import type { Errors } from '../../../assets/GeneralTypes'
import type { PasswordForm } from './types'
import { validateEmpty } from '../../../assets/GeneralFunctions'
import { Visibility, VisibilityOff } from '@mui/icons-material'

const DeleteDialog = () => {
  const { t, onUserChange } = useAppContext()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<PasswordForm>({
    password: '',
  })
  const [errors, setErrors] = useState<Errors<PasswordForm>>({})
  const toast = useToast()
  const [continueDelete, setContinueDelete] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const nav = useNavigate()

  useEffect(() => {
    if (!open) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({ password: '' })
    setErrors({})
    setContinueDelete(false)
  }, [open])

  const { mutate, isPending } = useMutation({
    mutationFn: (password: string) => axios.delete('custom/account', { data: { password } }),
    onSuccess: () => {
      onUserChange(null)
      toast({ message: 'delete_account_success' })
      nav('/login')
    },
    onError: (error) => {
      if (isAxiosError(error) && error.status === 403) {
        setErrors({ password: 'login_credentials_error' })
        return
      }
      toast({ message: 'delete_account_error', severity: 'error' })
    },
  })

  const handleSubmit = () => {
    const newErrors: Errors<PasswordForm> = {
      ...validateEmpty(form),
    }

    setErrors({ ...newErrors })
    if (Object.keys(newErrors).length !== 0) return

    mutate(form.password)
  }

  return (
    <>
      <FormField>
        <Typography>{t('delete_account')}</Typography>
        <Button variant='outlined' onClick={() => setOpen(true)} color='error'>
          {t('delete')}
        </Button>
      </FormField>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{t('delete_account')}</DialogTitle>
        <S.StyledDialogContent>
          {!continueDelete && <DialogContentText>{t('delete_account_confirmation')}</DialogContentText>}

          {continueDelete && (
            <>
              <DialogContentText>{t('enter_password_to_delete')}</DialogContentText>
              <S.StyledTextField
                required
                size='small'
                label={t('password')}
                value={form.password}
                onChange={(event) => {
                  setForm({ ...form, password: event.target.value })
                  setErrors({ ...errors, password: null })
                }}
                type={showPassword ? 'text' : 'password'}
                error={!!errors.password}
                helperText={errors.password && t(errors.password)}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton onClick={() => setShowPassword((prev) => !prev)} edge='end'>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </>
          )}
        </S.StyledDialogContent>
        <DialogActions>
          {continueDelete ? (
            <Button onClick={handleSubmit} loading={isPending} loadingPosition='start' color='error'>
              {t('delete')}
            </Button>
          ) : (
            <Button onClick={() => setContinueDelete(true)}>{t('continue')}</Button>
          )}
          <Button onClick={() => setOpen(false)}>{t('cancel')}</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DeleteDialog
