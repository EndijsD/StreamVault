import { useAppContext } from '../../assets/contexts/App/useAppContext'
import * as S from './styles'
import { useNavigate } from 'react-router'

const NotFound = () => {
  const { t, user } = useAppContext()
  const nav = useNavigate()

  return (
    <S.Content>
      <S.StyledPaper>
        <S.StyledWarning />
        <S.Title variant='h4'>{t('page_not_found')}</S.Title>
        <S.StyledLink onClick={() => (user ? nav('/library') : nav('/'))}>{t('back_to_home')}</S.StyledLink>
      </S.StyledPaper>
    </S.Content>
  )
}

export default NotFound
