import { Typography } from '@mui/material'
import type { Library } from '../props'
import * as S from './style'
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic'

const PlaylistCard = ({ data, onClick }: { data: Library; onClick?: () => void }) => {
  const { name, image, imageExt } = data
  return (
    <S.Main onClick={onClick}>
      {image ? (
        <S.Image src={image && !imageExt ? image : `data:image/${imageExt};base64,${image}`} />
      ) : (
        <S.NoImage>
          <LibraryMusicIcon style={{ color: '#fff', fontSize: 42 }} />
        </S.NoImage>
      )}

      <Typography>{name}</Typography>
    </S.Main>
  )
}

export default PlaylistCard
