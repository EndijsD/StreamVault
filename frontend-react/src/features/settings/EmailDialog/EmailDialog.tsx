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
import type { EmailForm } from './types'
import type { Errors } from '../../../assets/GeneralTypes'
import { useToast } from '../../../assets/contexts/Toast/useToast'
import axios, { isAxiosError } from 'axios'
import { validateEmpty } from '../../../assets/GeneralFunctions'
import { Visibility, VisibilityOff } from '@mui/icons-material'

const defaultForm: EmailForm = {
  email: '',
  confirmEmail: '',
  password: '',
}

const EmailDialog = () => {
  const { t } = useAppContext()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<EmailForm>(defaultForm)
  const [errors, setErrors] = useState<Errors<EmailForm>>({})
  const toast = useToast()
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (!open) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(defaultForm)
    setErrors({})
  }, [open])

  const { mutate, isPending } = useMutation({
    mutationFn: (form: EmailForm) => axios.post('custom/change-email', { email: form.email, password: form.password }),
    onSuccess: () => {
      toast({ message: 'email_update_success' })
      setOpen(false)
    },
    onError: (error) => {
      if (isAxiosError(error) && error.status === 403) {
        setErrors({ password: 'login_credentials_error' })
        return
      }
      toast({ message: 'email_update_error', severity: 'error' })
    },
  })

  const handleSubmit = () => {
    const newErrors: Errors<EmailForm> = {
      ...(form.email !== form.confirmEmail && ({ confirmEmail: 'emails_dont_match' } satisfies Errors<EmailForm>)),
      ...validateEmpty(form),
    }

    setErrors({ ...newErrors })
    if (Object.keys(newErrors).length !== 0) return

    mutate(form)
  }

  return (
    <>
      <FormField>
        <Typography>{t('email')}</Typography>
        <Button variant='outlined' onClick={() => setOpen(true)}>
          {t('change')}
        </Button>
      </FormField>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {t('email')}
          <DialogContentText>{t('email_description')}</DialogContentText>
        </DialogTitle>
        <S.StyledDialogContent>
          {/* <FormField>
            <Typography color={errors.email ? 'error' : undefined}>
              {errors.email ? t(errors.email) : t('email')}
            </Typography> */}
          <S.StyledTextField
            type='email'
            required
            size='small'
            label={t('email')}
            value={form.email}
            onChange={(e) => {
              setForm({ ...form, email: e.target.value })
              setErrors({ ...errors, email: null })
            }}
            error={!!errors.email}
            helperText={errors.email && t(errors.email)}
          />
          {/* </FormField> */}
          {/* <FormField>
            <Typography color={errors.confirmEmail ? 'error' : undefined}>
              {errors.confirmEmail ? t(errors.confirmEmail) : t('confirm_email')}
            </Typography> */}
          <S.StyledTextField
            type='email'
            required
            size='small'
            label={t('confirm_email')}
            value={form.confirmEmail}
            onChange={(e) => {
              setForm({ ...form, confirmEmail: e.target.value })
              setErrors({ ...errors, confirmEmail: null })
            }}
            error={!!errors.confirmEmail}
            helperText={errors.confirmEmail && t(errors.confirmEmail)}
          />
          {/* </FormField> */}

          {/* <FormField>
            <Typography>{t('password')}</Typography> */}
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
          {/* </FormField> */}
        </S.StyledDialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} loading={isPending} loadingPosition='start'>
            {t('change')}
          </Button>
          <Button onClick={() => setOpen(false)}>{t('cancel')}</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default EmailDialog
