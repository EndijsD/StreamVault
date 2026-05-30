import * as S from './styles'
import { useNavigate } from 'react-router'

const NotFound = () => {
  const nav = useNavigate()

  return (
    <S.Content>
      <S.StyledPaper>
        <S.StyledWarning />
        <S.Title variant='h4'>Lapa netika atrasta!</S.Title>
        <S.StyledLink onClick={() => nav('/')}>Atpakaļ uz sākumlapu</S.StyledLink>
      </S.StyledPaper>
    </S.Content>
  )
}

export default NotFound
