import { Navigate, Outlet } from 'react-router'
import { useAppContext } from '../../assets/contexts/App/useAppContext'
import { CircularProgress } from '@mui/material'
import * as S from './styles'

const RedirectRoute = () => {
  const { user, isInitializing } = useAppContext()

  if (isInitializing)
    return (
      <S.Container>
        <CircularProgress />
      </S.Container>
    )

  return user ? <Navigate to='/library' replace /> : <Outlet />
}

export default RedirectRoute
