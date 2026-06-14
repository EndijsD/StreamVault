import { Typography } from '@mui/material'
import * as S from './style'
import type { Props } from './types'
import { Folder, LibraryMusic } from '@mui/icons-material'

const PlaylistCard = ({ data, onClick }: Props) => {
  const { name, id, type } = data

  // return (
  //   <Card sx={{ minWidth: 275 }}>
  //     <CardMedia sx={{ height: 128 }} image='/static/images/cards/contemplative-reptile.jpg' title='green iguana' />
  //     <CardContent>
  //       <Typography>{name}</Typography>
  //     </CardContent>
  //   </Card>
  // )

  return (
    <S.Main onClick={() => onClick?.(id)}>
      {/* {image ? (
        <S.Image src={image && !imageExt ? image : `data:image/${imageExt};base64,${image}`} />
      ) : ( */}
      <S.NoImage>{type === 'playlist' ? <LibraryMusic /> : <Folder />}</S.NoImage>
      {/* )} */}

      <Typography variant='subtitle2'>{name}</Typography>
    </S.Main>
  )
}

export default PlaylistCard
