import * as S from './style'
import type { Props } from './types'
import CustomImage from '../CustomImage'
import { Tooltip } from '@mui/material'

const PlaylistCard = ({ data, onClick, onContextMenu }: Props) => {
  const { type, image } = data

  return (
    <S.Main onClick={onClick} onContextMenu={onContextMenu}>
      <CustomImage type={type} size={128} image={image} />

      <Tooltip title={data.type === 'music' ? data.title : data.name}>
        <S.Title variant='subtitle2'>{data.type === 'music' ? data.title : data.name}</S.Title>
      </Tooltip>
    </S.Main>
  )
}

export default PlaylistCard
