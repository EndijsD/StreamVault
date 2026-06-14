import { Typography } from '@mui/material'
import * as S from './style'
import type { Props } from './types'
import { Folder, LibraryMusic } from '@mui/icons-material'

const PlaylistCard = ({ data, onClick }: Props) => {
  const { name, type, image } = data

  return (
    <S.Main onClick={onClick}>
      {image ? <S.Image src={image} /> : <S.NoImage>{type === 'playlist' ? <LibraryMusic /> : <Folder />}</S.NoImage>}

      <Typography variant='subtitle2'>{name}</Typography>
    </S.Main>
  )
}

export default PlaylistCard
