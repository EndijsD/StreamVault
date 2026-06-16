import { CircularProgress } from '@mui/material'
import type { DBSong } from '../../../../shared-types/types'
import DataTable from '../../components/DataTable'
import ConfirmDelete from '../AudioFiles/ConfirmDelete'
import EditRowsDialog from '../AudioFiles/EditRowsDialog'
import type { ContextMenuOption } from '../../components/DataTable/ContextMenu/props'
import { useToast } from '../../assets/contexts/Toast/useToast'
import { usePlayerContext } from '../../assets/contexts/PlayerContext/usePlayerContext'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Order } from '../../components/DataTable/props'
import type { DialogState } from '../../pages/AudioFiles/props'
import { initData } from '../../pages/AudioFiles/data'
import axios from 'axios'
import { useParams } from 'react-router'
import { columns } from '../../pages/AudioFiles/columns'

const fetch = async (playlistID: string) => {
  const res = await axios.get<DBSong[]>(`/files/playlist/${playlistID}`)
  return res.data
}

const PlaylistTable = () => {
  const toast = useToast()
  const { id } = useParams()
  const { play } = usePlayerContext()
  const [orderState, setOrderState] = useState<Order<DBSong>>({ orderBy: null, orderDir: null })
  const [dialogState, setDialogState] = useState<DialogState>(initData)
  const { error, data, isPending } = useQuery({
    queryKey: ['playlist_songs', id],
    queryFn: () => fetch(id!),
  })

  const rows = data ?? []

  const Options: ContextMenuOption<DBSong>[] = [
    {
      label: 'play',
      action: (all, _, track) => {
        play({
          artist: track.artist ?? '',
          duration: track.duration_s,
          image: track.image_base64,
          title: track.title,
          type: 'song',
          src: track.id.toString(),
          playlistRows: all,
          playlistID: 'all_files',
        })
      },
    },
    {
      label: 'edit',
      action: (_, selectedRows) => {
        setDialogState({ type: 'edit', open: true, rows: selectedRows })
      },
    },
    {
      label: 'delete',
      action: (_, selectedRows) => {
        setDialogState({ type: 'delete', open: true, rows: selectedRows.map((el) => el.id) })
      },
    },
  ]

  if (error) toast({ message: 'something_went_wrong', severity: 'error' })

  const handlePlayPlaylist = () => {
    if (!rows) return
    const track = rows[0]
    handlePlayRow(track)
  }

  const handlePlayRow = (row: DBSong) => {
    play({
      artist: row.artist ?? '',
      duration: row.duration_s,
      image: row.image_base64,
      title: row.title,
      type: 'song',
      src: row.id.toString(),
      playlistRows: rows,
      playlistID: 'all_files',
    })
  }
  return (
    <>
      {isPending ? (
        <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress size={60} />
        </div>
      ) : (
        <DataTable<DBSong>
          onPlayPlaylist={handlePlayPlaylist}
          options={Options}
          rows={rows}
          columns={columns}
          orderState={orderState}
          setOrderState={setOrderState}
          playlistID='all_files'
          onRowDoubleClick={handlePlayRow}
        />
      )}
      {dialogState.type == 'delete' ? (
        <ConfirmDelete open={dialogState.open} setOpen={() => setDialogState(initData)} songIds={dialogState.rows} />
      ) : (
        <EditRowsDialog open={dialogState.open} setOpen={() => setDialogState(initData)} rows={dialogState.rows} />
      )}
    </>
  )
}

export default PlaylistTable
