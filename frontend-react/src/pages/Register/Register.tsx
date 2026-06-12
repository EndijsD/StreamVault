import { IconButton, InputAdornment, Link, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import * as S from './styles'
import type { RegisterForm } from './types'
import type { Errors } from '../../assets/GeneralTypes'
import { validateEmpty } from '../../assets/GeneralFunctions'
import { useAppContext } from '../../assets/contexts/App/useAppContext'
import { useNavigate } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import axios, { isAxiosError } from 'axios'
import { useToast } from '../../assets/contexts/Toast/useToast'
import type { DBUserStripped } from '../../../../shared-types/types'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import type { TranslationKey } from '../../assets/translations'

const fetch = async (form: RegisterForm) => {
  const res = await axios.post<DBUserStripped>('/auth/register', form)
  return res.data
}

// type PasswordRules = 'length' | 'uppercase' | 'lowercase' | 'numbers' | 'special'

// const rules: { value: PasswordRules; key: TranslationKey }[] = [
//   { value: 'length', key: 'password_length' },
//   { value: 'uppercase', key: 'password_uppercase' },
//   { value: 'lowercase', key: 'password_lowercase' },
//   { value: 'numbers', key: 'password_numbers' },
//   { value: 'special', key: 'password_special' },
// ]

const Register = () => {
  const { t, onUserChange, activateRefresh } = useAppContext()
  const nav = useNavigate()
  const [form, setForm] = useState<RegisterForm>({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Errors<RegisterForm>>({})
  const toast = useToast()
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  })
  const [passwordRules, setPasswordRules] = useState({
    uppercase: false,
    lowercase: false,
    numbers: false,
    special: false,
    length: false,
  })
  const [showPasswordRules, setShowPasswordRules] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: fetch,
    onSuccess: (data) => {
      onUserChange(data)
      activateRefresh()
      nav('/library')
    },
    onError: (error) => {
      if (isAxiosError(error) && error.status === 403) {
        toast({ message: 'login_credentials_error', severity: 'warning' })
        return
      }
      toast({ message: 'something_went_wrong', severity: 'error' })
    },
  })

  const handleSubmit = () => {
    if (Object.values(passwordRules).some((value) => !value)) setShowPasswordRules(true)
    const newErrors: Errors<RegisterForm> = {
      // ...(form.password.length < 8 && ({ password: 'password_length' } satisfies Errors<RegisterForm>)),
      // ...(!passwordRules.uppercase && ({ password: 'password_uppercase' } satisfies Errors<RegisterForm>)),
      // ...(!passwordRules.lowercase && ({ password: 'password_lowercase' } satisfies Errors<RegisterForm>)),
      // ...(!passwordRules.numbers && ({ password: 'password_numbers' } satisfies Errors<RegisterForm>)),
      // ...(!passwordRules.special && ({ password: 'password_special' } satisfies Errors<RegisterForm>)),
      ...(form.password !== form.confirmPassword &&
        ({ confirmPassword: 'passwords_dont_match' } satisfies Errors<RegisterForm>)),
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
    <S.Container>
      <S.StyledPaper elevation={2}>
        <S.Title variant='h4'>{t('sign_up')}</S.Title>

        <TextField
          required
          variant='standard'
          label={t('email')}
          value={form.email}
          onChange={(event) => {
            setForm({ ...form, email: event.target.value })
            setErrors({ ...errors, email: null })
          }}
          type='email'
          error={!!errors.email}
          helperText={errors.email && t(errors.email)}
        />

        <TextField
          required
          variant='standard'
          label={t('password')}
          value={form.password}
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
            setForm({ ...form, password: event.target.value })
            setErrors({ ...errors, password: null })
          }}
          type={showPassword.password ? 'text' : 'password'}
          error={!!errors.password || !!getPasswordRuleError()}
          helperText={errors.password ? t(errors.password) : getPasswordRuleError()}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    onClick={() => setShowPassword((prev) => ({ ...prev, password: !prev.password }))}
                    edge='end'
                  >
                    {showPassword.password ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          required
          variant='standard'
          label={t('confirm_password')}
          value={form.confirmPassword}
          onChange={(event) => {
            setForm({ ...form, confirmPassword: event.target.value })
            setErrors({ ...errors, confirmPassword: null })
          }}
          type={showPassword.confirmPassword ? 'text' : 'password'}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword && t(errors.confirmPassword)}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    onClick={() => setShowPassword((prev) => ({ ...prev, confirmPassword: !prev.confirmPassword }))}
                    edge='end'
                  >
                    {showPassword.confirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        {/* <Box style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
          <Typography variant='body2'>{t('password_requirements')}</Typography>
          <List disablePadding>
            {rules.map((rule) => (
              <ListItem disablePadding>
                <S.StyledListItemIcon success={passwordRules[rule.value]}>
                  {passwordRules[rule.value] ? (
                    <CheckCircle fontSize='small' />
                  ) : (
                    <CheckCircleOutline fontSize='small' />
                  )}
                </S.StyledListItemIcon>
                <Typography variant='caption'> {t(rule.key)}</Typography>
              </ListItem>
            ))}
          </List>
        </Box> */}

        <S.StyledButton variant='contained' onClick={handleSubmit} loading={isPending} loadingPosition='start'>
          {t('sign_up')}
        </S.StyledButton>

        <Typography variant='body2'>
          {t('already_have_an_account')}{' '}
          <Link
            href='/login'
            underline='hover'
            onClick={(e) => {
              e.preventDefault()
              nav('/login')
            }}
          >
            {t('log_in')}
          </Link>
        </Typography>
      </S.StyledPaper>
    </S.Container>
  )
}

export default Register
