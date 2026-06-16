import { Typography } from '@mui/material'
import * as S from './style'
import type { Props } from './types'
import CustomImage from '../CustomImage'

const PlaylistCard = ({ data, onClick, onContextMenu }: Props) => {
  const { name, type, image } = data

  return (
    <S.Main onClick={onClick} onContextMenu={onContextMenu}>
      <CustomImage type={type} size={128} image={image} />

      <Typography variant='subtitle2'>{name}</Typography>
    </S.Main>
  )
}

export default PlaylistCard
