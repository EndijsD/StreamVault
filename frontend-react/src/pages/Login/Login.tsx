import { TextField } from '@mui/material'
import { useState } from 'react'
import * as S from './styles'
import type { LoginForm } from './types'
import type { Errors } from '../../assets/GeneralTypes'
import { validateEmpty } from '../../assets/GeneralFunctions'
import { useAppContext } from '../../assets/contexts/App/useAppContext'

const Login = () => {
  const { t } = useAppContext()
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Errors<LoginForm>>({})

  const handleSubmit = () => {
    const newErrors: Errors<LoginForm> = {
      ...validateEmpty(form),
    }

    setErrors({ ...newErrors })
    if (Object.keys(newErrors).length !== 0) return
  }

  return (
    <S.Container>
      <S.StyledPaper elevation={2}>
        <S.Title variant='h4'>{t('log_in')}</S.Title>

        <TextField
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

        <S.StyledButton variant='contained' onClick={handleSubmit}>
          {t('log_in')}
        </S.StyledButton>
      </S.StyledPaper>
    </S.Container>
  )
}

export default Login
