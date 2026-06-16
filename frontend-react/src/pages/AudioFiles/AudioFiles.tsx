import DataTable from '../../components/DataTable'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import type { DBSong } from '../../../../shared-types/types'
import { useToast } from '../../assets/contexts/Toast/useToast'
import { useState } from 'react'
import { columns } from './columns'
import type { Order } from '../../components/DataTable/props'
import { CircularProgress } from '@mui/material'
import type { ContextMenuOption } from '../../components/DataTable/ContextMenu/props'
import { usePlayerContext } from '../../assets/contexts/PlayerContext/usePlayerContext'
import EditRowsDialog from '../../features/AudioFiles/EditRowsDialog'
import ConfirmDelete from '../../features/AudioFiles/ConfirmDelete'

const fetch = async () => {
  const res = await axios.get<DBSong[]>('/files')
  return res.data
}

type DialogState = { type: 'edit'; open: boolean; rows: DBSong[] } | { type: 'delete'; open: boolean; rows: number[] }

const initData: DialogState = { type: 'edit', open: false, rows: [] }

const AudioFiles = () => {
  const toast = useToast()
  const { play } = usePlayerContext()
  const [orderState, setOrderState] = useState<Order<DBSong>>({ orderBy: null, orderDir: null })
  const [dialogState, setDialogState] = useState<DialogState>(initData)
  const { error, data, isPending } = useQuery({
    queryKey: ['songs'],
    queryFn: fetch,
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
          height='calc(100% - 96px)'
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

export default AudioFiles
