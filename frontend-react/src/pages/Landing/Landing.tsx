import { useNavigate } from 'react-router'
import * as S from './styles'
import { useAppContext } from '../../assets/contexts/App/useAppContext'
import { GeneralContainedButton } from '../../assets/GeneralStyles'
import { Button } from '@mui/material'

const Landing = () => {
  const nav = useNavigate()
  const { t } = useAppContext()

  return (
    <S.Container>
      <S.Title variant='h2'>StreamVault</S.Title>

      <S.ButtonBox>
        <GeneralContainedButton variant='contained' onClick={() => nav('/login')}>
          {t('log_in')}
        </GeneralContainedButton>
        <Button onClick={() => nav('/register')}>{t('sign_up')}</Button>
      </S.ButtonBox>
    </S.Container>
  )
}

export default Landing
