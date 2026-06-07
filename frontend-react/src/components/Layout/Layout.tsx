import { Outlet } from 'react-router';
import * as S from './styles';

const Layout = () => {
  return (
    <>
      <S.OutletWrapper>
        <Outlet />
      </S.OutletWrapper>
      <S.StyledBox />
    </>
  );
};

export default Layout;
