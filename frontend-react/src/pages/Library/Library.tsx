import * as S from './style'
import PlaylistCard from '../../components/PlaylistCard'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import type { Folder, LibraryItem } from '../../../../shared-types/types'
import { useNavigate, useParams } from 'react-router'
import { Breadcrumbs, Link, Typography } from '@mui/material'
import { useAppContext } from '../../assets/contexts/App/useAppContext'

const fetch = async () => {
  const res = await axios.get<LibraryItem[]>('custom/library')
  return res.data
}

const findFolderPath = (items: LibraryItem[], folderId: number, path: Folder[] = []): Folder[] | undefined => {
  for (const item of items) {
    if (item.type !== 'folder') continue

    const currentPath = [...path, item]

    if (item.id === folderId) {
      return currentPath
    }

    const found = findFolderPath(item.children, folderId, currentPath)

    if (found) {
      return found
    }
  }

  return undefined
}

const Library = () => {
  const { data } = useQuery({
    queryKey: ['library'],
    queryFn: fetch,
  })
  const { id } = useParams()
  const nav = useNavigate()
  const { t } = useAppContext()

  const library = data || []

  const currentFolderId = id ? Number(id) : undefined

  const breadcrumbs = currentFolderId ? (findFolderPath(library, currentFolderId) ?? []) : []

  const itemsToDisplay = currentFolderId ? (breadcrumbs.at(-1)?.children ?? []) : library

  return (
    <S.Container>
      {breadcrumbs.length > 0 && (
        <Breadcrumbs>
          <Link component='button' underline='hover' onClick={() => nav('/library')}>
            {t('library')}
          </Link>

          {breadcrumbs.map((folder, index) => {
            const isLast = index === breadcrumbs.length - 1

            return isLast ? (
              <Typography key={folder.id}>{folder.name}</Typography>
            ) : (
              <Link
                key={folder.id}
                component='button'
                underline='hover'
                onClick={() => nav(`/library/folder/${folder.id}`)}
              >
                {folder.name}
              </Link>
            )
          })}
        </Breadcrumbs>
      )}

      <S.Grid>
        {itemsToDisplay.map((el, i) => (
          <PlaylistCard data={el} key={i} onClick={(id) => nav(`/library/${el.type}/${id}`, { state: el })} />
        ))}
      </S.Grid>
    </S.Container>
  )
}

export default Library
