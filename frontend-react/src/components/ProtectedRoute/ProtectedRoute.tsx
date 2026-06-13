import { Navigate, Outlet } from 'react-router'
import { useAppContext } from '../../assets/contexts/App/useAppContext'
import { CircularProgress } from '@mui/material'
import * as S from './styles'
import Header from '../Header'
import PlayerControlPanel from '../../features/PlayerControlPanel'

const ProtectedRoute = () => {
  const { user, isInitializing } = useAppContext()

  if (isInitializing)
    return (
      <S.Container>
        <CircularProgress />
      </S.Container>
    )

  return user ? (
    <>
      <Header />

      <Outlet />

      <PlayerControlPanel />
    </>
  ) : (
    <Navigate to='/login' replace />
  )
}

export default ProtectedRoute
