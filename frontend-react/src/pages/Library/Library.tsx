import * as S from './style'
import PlaylistCard from '../../components/PlaylistCard'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import type { Folder, LibraryItem } from '../../../../shared-types/types'
import { useNavigate, useParams } from 'react-router'
import { Breadcrumbs, Button, Link, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@mui/material'
import { useAppContext } from '../../assets/contexts/App/useAppContext'
import EditLibraryItemDialog from '../../features/EditLibraryItemDialog'
import { useState } from 'react'
import type { Focus } from '../../features/EditLibraryItemDialog/types'
import CustomImage from '../../components/CustomImage'
import AddLibraryItemDialog from '../../features/AddLibraryItemDialog'
import type { AddType } from '../../features/AddLibraryItemDialog/types'
import { Add, CreateNewFolder, PlaylistAdd } from '@mui/icons-material'

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
  const [openAdd, setOpenAdd] = useState(false)
  const [openAddType, setOpenAddType] = useState<AddType>('playlist')
  const { id } = useParams()
  const nav = useNavigate()
  const { t } = useAppContext()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const { data } = useQuery({
    queryKey: ['library'],
    queryFn: fetch,
  })

  const library = data || []

  const currentFolderId = id ? Number(id) : undefined

  const breadcrumbs = currentFolderId ? (findFolderPath(library, currentFolderId) ?? []) : []

  const currentFolder = breadcrumbs.at(-1)

  const itemsToDisplay = currentFolderId ? (currentFolder?.children ?? []) : library

  const handleClose = () => setAnchorEl(null)

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

        <Button variant='outlined' onClick={(e) => setAnchorEl(e.currentTarget)} startIcon={<Add />}>
          {t('create')}
        </Button>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem
            onClick={() => {
              setOpenAdd(true)
              setOpenAddType('playlist')
              handleClose()
            }}
          >
            <ListItemIcon>
              <PlaylistAdd fontSize='small' />
            </ListItemIcon>
            <ListItemText>{t('playlist')}</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setOpenAdd(true)
              setOpenAddType('folder')
              handleClose()
            }}
          >
            <ListItemIcon>
              <CreateNewFolder fontSize='small' />
            </ListItemIcon>
            <ListItemText>{t('folder')}</ListItemText>
          </MenuItem>
        </Menu>
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

      <S.Section>
        <S.Grid>
          {itemsToDisplay.map((el, i) => (
            <PlaylistCard data={el} key={i} onClick={() => nav(`/library/${el.type}/${el.id}`)} />
          ))}
        </S.Grid>
      </S.Section>

      <AddLibraryItemDialog onOpenChange={setOpenAdd} open={openAdd} type={openAddType} parentId={currentFolderId} />
    </S.Container>
  )
}

export default Library
