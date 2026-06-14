import { useLocation, type Location } from 'react-router'
import type { Playlist } from '../../../../shared-types/types'
import * as S from './styles'
import { LibraryMusic } from '@mui/icons-material'

const PlaylistView = () => {
  const location = useLocation()
  const { state } = location as Location<Playlist>

  return (
    <S.Container>
      <S.Header>
        <S.NoImage>{<LibraryMusic />}</S.NoImage>

        <S.TextBox>
          <S.Title variant='h3'>{state.name}</S.Title>
          {state.description && <S.Description variant='body1'>{state.description}</S.Description>}
        </S.TextBox>
      </S.Header>
    </S.Container>
  )
}

export default PlaylistView
