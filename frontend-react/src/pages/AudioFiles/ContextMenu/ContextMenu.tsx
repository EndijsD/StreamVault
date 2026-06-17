import { ChevronRight, Delete, Download, Edit, PlayArrow, PlaylistAdd } from '@mui/icons-material'
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import { useAppContext } from '../../../assets/contexts/App/useAppContext'
import type { Open, Props } from './types'
import { useState } from 'react'
import * as S from './styles'
import ConfirmDelete from '../../../features/AudioFiles/ConfirmDelete'
import EditRowsDialog from '../../../features/AudioFiles/EditRowsDialog'
import { usePlayerContext } from '../../../assets/contexts/PlayerContext/usePlayerContext'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { DBSong, Playlist } from '../../../../../shared-types/types'
import axios from 'axios'
import { queryClient } from '../../../assets/QueryClient'
import { useToast } from '../../../assets/contexts/Toast/useToast'

const fetch = async (songIds: number[]) => {
  const res = await axios.get<Playlist[]>('custom/playlists', { params: { songIds: songIds.join(',') } })
  return res.data
}

const ContextMenu = ({ onClose, anchor, item }: Props) => {
  const [open, setOpen] = useState<Open>(false)
  const { t } = useAppContext()
  const { play } = usePlayerContext()
  const [playlistAnchor, setPlaylistAnchor] = useState<HTMLElement | null>(null)
  const toast = useToast()
  const songIds = item?.selectedRows.map((el) => el.id) ?? []

  const { data } = useQuery({
    queryKey: ['playlists', songIds],
    queryFn: () => fetch(songIds),
    enabled: !!songIds.length,
  })

  const playlists = data ?? []

  const { mutate } = useMutation({
    mutationFn: ({ playlistId, songs }: { playlistId: number; songs: DBSong[] }) =>
      axios.post(
        'songs_has_playlists',
        songs.map((el) => ({
          songs_id: el.id,
          playlists_id: playlistId,
        })),
      ),
    onSuccess: (_, { playlistId, songs }) => {
      queryClient.setQueryData<DBSong[]>(['playlist_songs', playlistId], (old) => [...(old ?? []), ...songs])
      queryClient.setQueryData<Playlist[]>(['playlists', songs.map((el) => el.id)], (old) => {
        if (!old) return old
        return old.filter((p) => p.id !== playlistId)
      })

      toast({ message: 'add_to_playlist_success' })
    },
    onError: () => {
      toast({ message: 'add_to_playlist_error', severity: 'error' })
    },
  })

  const { mutate: mutateDownload } = useMutation({
    mutationFn: async (songs: DBSong[]) => {
      const res = await axios.get('files/download', {
        params: {
          songIds: songs.map((el) => el.id).join(','),
        },
        responseType: 'blob',
      })

      const blob = new Blob([res.data], { type: 'application/zip' })
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = 'songs.zip'
      document.body.appendChild(a)
      a.click()
      a.remove()

      window.URL.revokeObjectURL(url)
    },
    onSuccess: () => {
      toast({ message: 'download_success' })
    },
    onError: () => {
      toast({ message: 'download_error', severity: 'error' })
    },
  })

  if (!item) return null

  return (
    <>
      <Menu {...(anchor ?? {})} open={Boolean(anchor)} onClose={onClose}>
        <MenuItem
          onClick={() => {
            play({
              artist: item.currentRow.artist,
              duration: item.currentRow.duration_s,
              image: item.currentRow.image_base64,
              title: item.currentRow.title,
              type: 'song',
              src: item.currentRow.id.toString(),
              playlistRows: item.allRows,
              playlistID: 'all_files',
            })
            onClose()
          }}
        >
          <ListItemIcon>
            <PlayArrow fontSize='small' />
          </ListItemIcon>
          <ListItemText>{t('play')}</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => {
            setOpen('edit')
            onClose()
          }}
        >
          <ListItemIcon>
            <Edit fontSize='small' />
          </ListItemIcon>
          <ListItemText>{t('edit')}</ListItemText>
        </MenuItem>

        {playlists.length > 0 && (
          <MenuItem
            onClick={(e) => {
              setPlaylistAnchor(e.currentTarget)
            }}
          >
            <ListItemIcon>
              <PlaylistAdd fontSize='small' />
            </ListItemIcon>
            <ListItemText>{t('add_to_playlist')}</ListItemText>
            <ListItemIcon style={{ minWidth: 0, marginLeft: 16 }}>
              <ChevronRight fontSize='small' />
            </ListItemIcon>
          </MenuItem>
        )}

        <MenuItem
          onClick={() => {
            mutateDownload(item.selectedRows)
            onClose()
          }}
        >
          <ListItemIcon>
            <Download fontSize='small' />
          </ListItemIcon>
          <ListItemText>{t('download')}</ListItemText>
        </MenuItem>

        <S.DeleteMenuItem
          onClick={() => {
            setOpen('delete')
            onClose()
          }}
        >
          <ListItemIcon>
            <Delete fontSize='small' />
          </ListItemIcon>
          <ListItemText>{t('delete')}</ListItemText>
        </S.DeleteMenuItem>
      </Menu>

      <Menu
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        anchorEl={playlistAnchor}
        open={Boolean(playlistAnchor)}
        onClose={() => setPlaylistAnchor(null)}
      >
        {playlists.map((playlist, i) => (
          <MenuItem
            key={i}
            onClick={() => {
              mutate({ playlistId: playlist.id, songs: item.selectedRows })
              setPlaylistAnchor(null)
              onClose()
            }}
          >
            {playlist.name}
          </MenuItem>
        ))}
      </Menu>

      <ConfirmDelete
        open={open === 'delete'}
        setOpen={() => setOpen(false)}
        songIds={item.selectedRows.map((r) => r.id)}
      />

      <EditRowsDialog open={open === 'edit'} setOpen={() => setOpen(false)} rows={item.selectedRows} />
    </>
  )
}

export default ContextMenu
