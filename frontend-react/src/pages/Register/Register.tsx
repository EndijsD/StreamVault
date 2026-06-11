import { Link, TextField, Typography } from '@mui/material'
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

const fetch = async (form: LoginForm) => {
  const res = await axios.post<DBUserStripped>('/auth/login', form)
  return res.data
}

const Register = () => {
  const { t, onUserChange, activateRefresh } = useAppContext()
  const nav = useNavigate()
  const [form, setForm] = useState<LoginForm>({
    name: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Errors<LoginForm>>({})
  const toast = useToast()

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
        <S.Title variant='h4'>{t('sign_up')}</S.Title>

        <TextField
          required
          variant='standard'
          label={t('name')}
          value={form.name}
          onChange={(event) => {
            setForm({ ...form, name: event.target.value })
            setErrors({ ...errors, name: null })
          }}
          type='name'
          error={!!errors.name}
          helperText={errors.name && t(errors.name)}
        />

        <TextField
          required
          variant='standard'
          label={t('surname')}
          value={form.surname}
          onChange={(event) => {
            setForm({ ...form, surname: event.target.value })
            setErrors({ ...errors, surname: null })
          }}
          type='surname'
          error={!!errors.surname}
          helperText={errors.surname && t(errors.surname)}
        />

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
          type='password'
          error={!!errors.password}
          helperText={errors.password && t(errors.password)}
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
          type='confirmPassword'
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword && t(errors.confirmPassword)}
        />

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
