import { CreateNewFolder, FolderDelete, PlaylistAdd, PlaylistRemove } from '@mui/icons-material'
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import { useAppContext } from '../../../assets/contexts/App/useAppContext'
import type { Open, Props } from './types'
import { useState } from 'react'
import type { AddType } from '../../AddLibraryItemDialog/types'
import AddLibraryItemDialog from '../../AddLibraryItemDialog'
import * as S from './styles'
import DeletePlaylistDialog from '../DeletePlaylistDialog'
import DeleteFolderDialog from '../DeleteFolderDialog'

const ContextMenu = ({ onClose, anchor, parentId, item }: Props) => {
  const [open, setOpen] = useState<Open>(false)
  const [openAddType, setOpenAddType] = useState<AddType>('playlist')
  const { t } = useAppContext()
  const isFolder = item?.type === 'folder'
  const isPlaylist = item?.type === 'playlist'

  return (
    <>
      <Menu {...(anchor ?? {})} open={Boolean(anchor)} onClose={onClose}>
        <MenuItem
          onClick={() => {
            setOpen('add')
            setOpenAddType('playlist')
            onClose()
          }}
        >
          <ListItemIcon>
            <PlaylistAdd fontSize='small' />
          </ListItemIcon>
          <ListItemText>{t('playlist')}</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpen('add')
            setOpenAddType('folder')
            onClose()
          }}
        >
          <ListItemIcon>
            <CreateNewFolder fontSize='small' />
          </ListItemIcon>
          <ListItemText>{t('folder')}</ListItemText>
        </MenuItem>

        {isPlaylist && (
          <S.DeleteMenuItem
            onClick={() => {
              setOpen('deletePlaylist')
              onClose()
            }}
          >
            <ListItemIcon>
              <PlaylistRemove fontSize='small' />
            </ListItemIcon>
            <ListItemText>{t('delete')}</ListItemText>
          </S.DeleteMenuItem>
        )}

        {isFolder && (
          <S.DeleteMenuItem
            onClick={() => {
              setOpen('deleteFolder')
              onClose()
            }}
          >
            <ListItemIcon>
              <FolderDelete fontSize='small' />
            </ListItemIcon>
            <ListItemText>{t('delete')}</ListItemText>
          </S.DeleteMenuItem>
        )}
      </Menu>

      {item && item.type === 'playlist' && (
        <DeletePlaylistDialog
          open={open === 'deletePlaylist'}
          item={item}
          onOpenChange={() => setOpen(false)}
          parentId={parentId}
        />
      )}

      {item && item.type === 'folder' && (
        <DeleteFolderDialog open={open === 'deleteFolder'} item={item} onOpenChange={() => setOpen(false)} />
      )}

      <AddLibraryItemDialog
        onOpenChange={() => setOpen(false)}
        open={open === 'add'}
        type={openAddType}
        parentId={parentId}
      />
    </>
  )
}

export default ContextMenu
