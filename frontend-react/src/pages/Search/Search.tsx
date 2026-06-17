import { Typography } from '@mui/material'
import { useNavigate, useSearchParams } from 'react-router'
import { useAppContext } from '../../assets/contexts/App/useAppContext'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import type { SearchResult } from '../../../../shared-types/types'
import Loader from '../../components/Loader'
import * as S from './styles'
import PlaylistCard from '../../components/PlaylistCard'
import { usePlayerContext } from '../../assets/contexts/PlayerContext/usePlayerContext'
import { Audiotrack, Folder, List } from '@mui/icons-material'
import Empty from '../Empty'

const fetch = async (query: string) => {
  const res = await axios.get<SearchResult>('custom/search', { params: { query } })
  return res.data
}

const Search = () => {
  const [searchParams] = useSearchParams()
  const { play } = usePlayerContext()
  const query = searchParams.get('query') ?? ''
  const { t } = useAppContext()
  const nav = useNavigate()

  const { data, isPending } = useQuery({
    queryKey: ['search', query],
    queryFn: () => fetch(query),
  })

  if (isPending) return <Loader />

  const search = data || { music: [], playlists: [], folders: [] }

  if (search.music.length === 0 && search.playlists.length === 0 && search.folders.length === 0)
    return <Empty title='empty_search_title' description='empty_search_description' />

  return (
    <>
      {search.music.length > 0 && (
        <S.Container>
          <S.TitleBox variant='outlined'>
            <Audiotrack fontSize='large' />
            <Typography variant='h4'>{t('music')}</Typography>
          </S.TitleBox>

          <S.Grid>
            {search.music.map((el, i) => (
              <PlaylistCard
                data={el}
                key={i}
                onClick={() =>
                  play({
                    type: 'song',
                    title: el.title,
                    artist: el.artist,
                    duration: el.duration,
                    src: el.id.toString(),
                    image: el.image,
                  })
                }
                //   onContextMenu={(e) => {
                //     e.preventDefault()
                //     e.stopPropagation()

                //     setItem(el)
                //     setMenu({
                //       anchorReference: 'anchorPosition',
                //       anchorPosition: {
                //         left: e.clientX,
                //         top: e.clientY,
                //       },
                //     })
                //   }}
              />
            ))}
          </S.Grid>
        </S.Container>
      )}

      {search.playlists.length > 0 && (
        <S.Container>
          <S.TitleBox variant='outlined'>
            <List fontSize='large' />
            <Typography variant='h4'>{t('playlists')}</Typography>
          </S.TitleBox>

          <S.Grid>
            {search.playlists.map((el, i) => (
              <PlaylistCard
                data={el}
                key={i}
                onClick={() => nav(`/library/${el.type}/${el.id}`)}
                //   onContextMenu={(e) => {
                //     e.preventDefault()
                //     e.stopPropagation()

                //     setItem(el)
                //     setMenu({
                //       anchorReference: 'anchorPosition',
                //       anchorPosition: {
                //         left: e.clientX,
                //         top: e.clientY,
                //       },
                //     })
                //   }}
              />
            ))}
          </S.Grid>
        </S.Container>
      )}

      {search.folders.length > 0 && (
        <S.Container>
          <S.TitleBox variant='outlined'>
            <Folder fontSize='large' />
            <Typography variant='h4'>{t('folders')}</Typography>
          </S.TitleBox>

          <S.Grid>
            {search.folders.map((el, i) => (
              <PlaylistCard
                data={el}
                key={i}
                onClick={() => nav(`/library/${el.type}/${el.id}`)}
                //   onContextMenu={(e) => {
                //     e.preventDefault()
                //     e.stopPropagation()

                //     setItem(el)
                //     setMenu({
                //       anchorReference: 'anchorPosition',
                //       anchorPosition: {
                //         left: e.clientX,
                //         top: e.clientY,
                //       },
                //     })
                //   }}
              />
            ))}
          </S.Grid>
        </S.Container>
      )}
    </>
  )
}

export default Search
