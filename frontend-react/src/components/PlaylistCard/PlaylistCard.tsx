import { Typography } from '@mui/material'
import * as S from './style'
import type { Props } from './types'
import CustomImage from '../CustomImage'

const PlaylistCard = ({ data, onClick }: Props) => {
  const { name, type, image } = data

  return (
    <S.Main onClick={onClick}>
      <CustomImage type={type} size={128} image={image} />

      <Typography variant='subtitle2'>{name}</Typography>
    </S.Main>
  )
}

export default PlaylistCard
