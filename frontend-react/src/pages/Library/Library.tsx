import * as S from './style'
import PlaylistCard from '../../components/PlaylistCard'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import type { Folder, LibraryItem } from '../../../../shared-types/types'
import { useNavigate, useParams } from 'react-router'
import { Breadcrumbs, Button, Link, Typography } from '@mui/material'
import { useAppContext } from '../../assets/contexts/App/useAppContext'
import EditLibraryItemDialog from '../../features/EditLibraryItemDialog'
import { useState } from 'react'
import type { Focus } from '../../features/EditLibraryItemDialog/types'
import CustomImage from '../../components/CustomImage'
import { Add } from '@mui/icons-material'
import ContextMenu from '../../features/library/ContextMenu'
import type { ContextMenuOpen } from '../../features/library/ContextMenu/types'
import Loader from '../../components/Loader'
import Empty from '../Empty'

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
  const [openEdit, setOpenEdit] = useState<Focus | false>(false)
  const { id } = useParams()
  const nav = useNavigate()
  const { t } = useAppContext()
  const [menu, setMenu] = useState<ContextMenuOpen>(null)
  const [item, setItem] = useState<LibraryItem | null>(null)

  const { data, isPending } = useQuery({
    queryKey: ['library'],
    queryFn: fetch,
  })

  if (isPending) return <Loader />

  const library = data || []

  const currentFolderId = id ? Number(id) : undefined

  const breadcrumbs = currentFolderId ? (findFolderPath(library, currentFolderId) ?? []) : []

  const currentFolder = breadcrumbs.at(-1)

  const itemsToDisplay = currentFolderId ? (currentFolder?.children ?? []) : library

  return (
    <S.Container>
      <S.SpaceBetween>
        <Breadcrumbs>
          <Link component='button' underline='hover' onClick={() => nav('/library')}>
            {t('library')}
          </Link>

          {breadcrumbs.map((folder, index) => {
            const isLast = index === breadcrumbs.length - 1

            return isLast ? (
              <Link
                key={folder.id}
                onClick={() => setOpenEdit('name')}
                component='button'
                underline='hover'
                color='text.secondary'
              >
                {folder.name}
              </Link>
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

        <Button
          variant='outlined'
          startIcon={<Add />}
          onClick={(e) =>
            setMenu({
              anchorReference: 'anchorEl',
              anchorEl: e.currentTarget,
            })
          }
        >
          {t('create')}
        </Button>
      </S.SpaceBetween>

      {currentFolder && (
        <>
          {currentFolder.description && (
            <S.FolderBox onClick={() => setOpenEdit('description')}>
              <CustomImage size={16} type='folder' image={currentFolder.image} />

              <Typography variant='subtitle2'>{currentFolder.description}</Typography>
            </S.FolderBox>
          )}

          <EditLibraryItemDialog
            item={{
              description: currentFolder.description || '',
              image: currentFolder.image,
              name: currentFolder.name,
              id: currentFolder.id,
            }}
            type='folder'
            onOpenChange={() => setOpenEdit(false)}
            open={openEdit}
          />
        </>
      )}

      {!itemsToDisplay.length ? (
        <Empty
          title={currentFolderId ? 'empty_folder_title' : 'empty_library_title'}
          description={currentFolderId ? 'empty_folder_description' : 'empty_library_description'}
        />
      ) : (
        <S.Section
          onContextMenu={(e) => {
            e.preventDefault()

            setMenu({
              anchorReference: 'anchorPosition',
              anchorPosition: {
                left: e.clientX,
                top: e.clientY,
              },
            })
            setItem(null)
          }}
        >
          <S.Grid>
            {itemsToDisplay.map((el, i) => (
              <PlaylistCard
                data={el}
                key={i}
                onClick={() => nav(`/library/${el.type}/${el.id}`)}
                onContextMenu={(e) => {
                  e.preventDefault()
                  e.stopPropagation()

                  setItem(el)
                  setMenu({
                    anchorReference: 'anchorPosition',
                    anchorPosition: {
                      left: e.clientX,
                      top: e.clientY,
                    },
                  })
                }}
              />
            ))}
          </S.Grid>
        </S.Section>
      )}

      <ContextMenu anchor={menu} onClose={() => setMenu(null)} parentId={currentFolderId} item={item} />
    </S.Container>
  )
}

export default Library
