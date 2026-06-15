import { Navigate, Outlet } from 'react-router'
import { useAppContext } from '../../assets/contexts/App/useAppContext'
import * as S from './styles'
import Header from '../Header'
import PlayerControlPanel from '../../features/PlayerControlPanel'
import { PlayerProvider } from '../../assets/contexts/PlayerContext/PlayerProvider'
import Loader from '../Loader'

const ProtectedRoute = () => {
  const { user, isInitializing } = useAppContext()

  if (isInitializing)
    return (
      <S.Page>
        <Loader />
      </S.Page>
    )

  if (user)
    return (
      <PlayerProvider>
        <S.Page>
          <Header />

          <S.StyledBox>
            <Outlet />
          </S.StyledBox>

          <PlayerControlPanel />
        </S.Page>
      </PlayerProvider>
    )

  return <Navigate to='/login' replace />
}

export default ProtectedRoute
