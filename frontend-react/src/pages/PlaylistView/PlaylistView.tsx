import { Navigate, useParams } from 'react-router'
import type { Playlist } from '../../../../shared-types/types'
import * as S from './styles'
import EditLibraryItemDialog from '../../features/EditLibraryItemDialog'
import { useState } from 'react'
import CustomImage from '../../components/CustomImage'
import type { Focus } from '../../features/EditLibraryItemDialog/types'
import { useQuery } from '@tanstack/react-query'
import axios, { isAxiosError } from 'axios'
import Loader from '../../components/Loader'

const fetch = async (id: number) => {
  const res = await axios.get<Playlist>(`custom/playlist/${id}`)
  return res.data
}

const PlaylistView = () => {
  const [open, setOpen] = useState<Focus | false>(false)
  const { id } = useParams()

  const numId = Number(id)

  const { data, isPending, error } = useQuery({
    queryKey: ['playlist', numId],
    queryFn: () => fetch(numId),
    enabled: !!id,
  })

  if (isPending) return <Loader />

  if (isAxiosError(error) && error.status === 404) return <Navigate to='/library' replace />

  if (!data) return 'an error occurred'

  return (
    <S.Container>
      <S.Header>
        <S.StyledButton onClick={() => setOpen('image')}>
          <CustomImage type='playlist' size={128} image={data.image} />
        </S.StyledButton>

        <S.TextBox>
          <S.Title variant='h3' onClick={() => setOpen('name')}>
            {data.name}
          </S.Title>

          {data.description && (
            <S.Description variant='body1' onClick={() => setOpen('description')}>
              {data.description}
            </S.Description>
          )}
        </S.TextBox>
      </S.Header>

      <EditLibraryItemDialog
        item={{ description: data.description || '', image: data.image, name: data.name, id: data.id }}
        type='playlist'
        onOpenChange={() => setOpen(false)}
        open={open}
      />
    </S.Container>
  )
}

export default PlaylistView
