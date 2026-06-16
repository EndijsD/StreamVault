import { Close } from '@mui/icons-material'
import { Tooltip } from '@mui/material'
import { useAppContext } from '../../assets/contexts/App/useAppContext'
import type { Props } from './types'
import * as S from './styles'

const DialogClose = ({ onClick }: Props) => {
  const { t } = useAppContext()

  return (
    <Tooltip title={t('close')}>
      <S.StyledIconButton onClick={() => onClick(false)}>
        <Close />
      </S.StyledIconButton>
    </Tooltip>
  )
}

export default DialogClose
