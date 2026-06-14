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
import type { PasswordForm } from './types'
import type { Errors } from '../../../assets/GeneralTypes'
import { useToast } from '../../../assets/contexts/Toast/useToast'
import axios, { isAxiosError } from 'axios'
import { validateEmpty } from '../../../assets/GeneralFunctions'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import type { TranslationKey } from '../../../assets/translations'

const defaultForm: PasswordForm = {
  confirmNewPassword: '',
  currentPassword: '',
  newPassword: '',
}

const PasswordDialog = () => {
  const { t } = useAppContext()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<PasswordForm>(defaultForm)
  const [errors, setErrors] = useState<Errors<PasswordForm>>({})
  const toast = useToast()
  const [showPassword, setShowPassword] = useState<Record<keyof PasswordForm, boolean>>({
    confirmNewPassword: false,
    currentPassword: false,
    newPassword: false,
  })
  const [passwordRules, setPasswordRules] = useState({
    uppercase: false,
    lowercase: false,
    numbers: false,
    special: false,
    length: false,
  })
  const [showPasswordRules, setShowPasswordRules] = useState(false)

  useEffect(() => {
    if (!open) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(defaultForm)
    setErrors({})
  }, [open])

  const { mutate, isPending } = useMutation({
    mutationFn: (form: PasswordForm) =>
      axios.post('custom/change-password', { newPassword: form.newPassword, password: form.currentPassword }),
    onSuccess: () => {
      toast({ message: 'password_update_success' })
      setOpen(false)
    },
    onError: (error) => {
      if (isAxiosError(error) && error.status === 403) {
        setErrors({ currentPassword: 'login_credentials_error' })
        return
      }
      toast({ message: 'password_update_error', severity: 'error' })
    },
  })

  const handleSubmit = () => {
    if (Object.values(passwordRules).some((value) => !value)) setShowPasswordRules(true)
    const newErrors: Errors<PasswordForm> = {
      ...(form.newPassword !== form.confirmNewPassword &&
        ({ confirmNewPassword: 'passwords_dont_match' } satisfies Errors<PasswordForm>)),
      ...validateEmpty(form),
    }

    setErrors({ ...newErrors })
    if (Object.keys(newErrors).length !== 0) return

    mutate(form)
  }

  const getPasswordRuleError = () => {
    if (!showPasswordRules) return
    return Object.entries(passwordRules)
      .filter(([, value]) => !value)
      .map(([key]) => t(`password_${key}` as TranslationKey))[0]
  }

  return (
    <>
      <FormField>
        <Typography>{t('password')}</Typography>
        <Button variant='outlined' onClick={() => setOpen(true)}>
          {t('change')}
        </Button>
      </FormField>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {t('password')}
          <DialogContentText>{t('password_description')}</DialogContentText>
        </DialogTitle>
        <S.StyledDialogContent>
          <S.StyledTextField
            required
            size='small'
            label={t('new_password')}
            value={form.newPassword}
            onChange={(event) => {
              const newRules = {
                uppercase: /[A-Z]/.test(event.target.value),
                lowercase: /[a-z]/.test(event.target.value),
                numbers: /[0-9]/.test(event.target.value),
                special: /[^A-Za-z0-9]/.test(event.target.value),
                length: event.target.value.length >= 8,
              }
              setPasswordRules(newRules)
              if (Object.values(newRules).every((value) => value)) setShowPasswordRules(false)
              setForm({ ...form, newPassword: event.target.value })
              setErrors({ ...errors, newPassword: null })
            }}
            type={showPassword.newPassword ? 'text' : 'password'}
            error={!!errors.newPassword || !!getPasswordRuleError()}
            helperText={errors.newPassword ? t(errors.newPassword) : getPasswordRuleError()}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() => setShowPassword((prev) => ({ ...prev, newPassword: !prev.newPassword }))}
                      edge='end'
                    >
                      {showPassword.newPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <S.StyledTextField
            required
            size='small'
            label={t('confirm_new_password')}
            value={form.confirmNewPassword}
            onChange={(event) => {
              setForm({ ...form, confirmNewPassword: event.target.value })
              setErrors({ ...errors, confirmNewPassword: null })
            }}
            type={showPassword.confirmNewPassword ? 'text' : 'password'}
            error={!!errors.confirmNewPassword}
            helperText={errors.confirmNewPassword && t(errors.confirmNewPassword)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() =>
                        setShowPassword((prev) => ({ ...prev, confirmNewPassword: !prev.confirmNewPassword }))
                      }
                      edge='end'
                    >
                      {showPassword.confirmNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <S.StyledTextField
            required
            size='small'
            label={t('current_password')}
            value={form.currentPassword}
            onChange={(event) => {
              setForm({ ...form, currentPassword: event.target.value })
              setErrors({ ...errors, currentPassword: null })
            }}
            type={showPassword.currentPassword ? 'text' : 'password'}
            error={!!errors.currentPassword}
            helperText={errors.currentPassword && t(errors.currentPassword)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() => setShowPassword((prev) => ({ ...prev, currentPassword: !prev.currentPassword }))}
                      edge='end'
                    >
                      {showPassword.currentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
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

export default PasswordDialog
