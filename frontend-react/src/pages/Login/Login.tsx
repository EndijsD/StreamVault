import { IconButton, InputAdornment, Link, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import * as S from './styles'
import type { LoginForm } from './types'
import type { Errors } from '../../assets/GeneralTypes'
import { validateEmpty } from '../../assets/GeneralFunctions'
import { useAppContext } from '../../assets/contexts/App/useAppContext'
import { useNavigate } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import axios, { isAxiosError } from 'axios'
import { useToast } from '../../assets/contexts/Toast/useToast'
import type { DBUserStripped } from '../../../../shared-types/types'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import type { Locale } from '../../assets/translations'

const fetch = async (form: LoginForm) => {
  const res = await axios.post<DBUserStripped>('/auth/login', form)
  return res.data
}

const Login = () => {
  const { t, onUserChange, activateRefresh, onLocaleChange } = useAppContext()
  const nav = useNavigate()
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Errors<LoginForm>>({})
  const toast = useToast()
  const [showPassword, setShowPassword] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: fetch,
    onSuccess: (data) => {
      onUserChange(data)
      onLocaleChange(data.locale as Locale)
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
    const newErrors: Errors<LoginForm> = {
      ...validateEmpty(form),
    }

    setErrors({ ...newErrors })
    if (Object.keys(newErrors).length !== 0) return

    mutate(form)
  }

  return (
    <S.Container>
      <S.StyledPaper elevation={2}>
        <S.Title variant='h4'>{t('log_in')}</S.Title>

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

        <S.StyledButton variant='contained' onClick={handleSubmit} loading={isPending} loadingPosition='start'>
          {t('log_in')}
        </S.StyledButton>

        <Typography variant='body2'>
          {t('no_account_yet')}{' '}
          <Link
            href='/register'
            underline='hover'
            onClick={(e) => {
              e.preventDefault()
              nav('/register')
            }}
          >
            {t('sign_up')}
          </Link>
        </Typography>
      </S.StyledPaper>
    </S.Container>
  )
}

export default Login
