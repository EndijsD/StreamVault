import { Navigate, Outlet } from 'react-router'
import { useAppContext } from '../../assets/contexts/App/useAppContext'
import { CircularProgress } from '@mui/material'
import * as S from './styles'

const ProtectedRoute = () => {
  const { user, isInitializing } = useAppContext()

  if (isInitializing)
    return (
      <S.Container>
        <CircularProgress />
      </S.Container>
    )

  return user ? <Outlet /> : <Navigate to='/login' replace />
}

export default ProtectedRoute
