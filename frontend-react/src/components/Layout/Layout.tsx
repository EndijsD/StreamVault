import { Outlet } from 'react-router'
import * as S from './styles'

const Layout = () => {
  return (
    <>
      <Outlet />
      <S.StyledBox />
    </>
  )
}

export default Layout
