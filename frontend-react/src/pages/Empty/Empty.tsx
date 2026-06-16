import { useAppContext } from '../../assets/contexts/App/useAppContext'
import * as S from './styles'
import type { Props } from './types'

const Empty = ({ title, description }: Props) => {
  const { t } = useAppContext()

  return (
    <S.Content>
      <S.StyledPaper variant='outlined'>
        <S.StyledIcon />
        <S.Title variant='h4'>{t(title)}</S.Title>
        <S.Description variant='body1'>{t(description)}</S.Description>
      </S.StyledPaper>
    </S.Content>
  )
}

export default Empty
