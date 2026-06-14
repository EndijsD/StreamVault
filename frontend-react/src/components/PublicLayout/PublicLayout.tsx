import { Outlet } from 'react-router'
import * as S from './styles'

const PublicLayout = () => {
  return (
    <>
      <S.Foreground>
        <Outlet />
      </S.Foreground>

      <S.Background>
        <S.StyledBox />
        <S.StyledBox2 />
      </S.Background>
    </>
  )
}

export default PublicLayout
