import { CircularProgress, type PopoverPosition } from '@mui/material'
import type { DBSong } from '../../../../shared-types/types'
import DataTable from '../../components/DataTable'
import { useToast } from '../../assets/contexts/Toast/useToast'
import { usePlayerContext } from '../../assets/contexts/PlayerContext/usePlayerContext'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Order, TableContextData } from '../../components/DataTable/props'
import axios from 'axios'
import { useParams } from 'react-router'
import { columns } from '../../pages/AudioFiles/columns'
import ContextMenu from '../../pages/AudioFiles/ContextMenu'

const fetch = async (playlistID: string) => {
  const res = await axios.get<DBSong[]>(`/files/playlist/${playlistID}`)
  return res.data
}

const PlaylistTable = () => {
  const toast = useToast()
  const { id } = useParams()
  const { play } = usePlayerContext()
  const [orderState, setOrderState] = useState<Order<DBSong>>({ orderBy: null, orderDir: null })
  const { error, data, isPending } = useQuery({
    queryKey: ['playlist_songs', +(id ?? 0)],
    queryFn: () => fetch(id!),
    enabled: !!id,
  })
  const [menu, setMenu] = useState<PopoverPosition | null>(null)
  const [item, setItem] = useState<TableContextData<DBSong> | null>(null)

  const rows = data ?? []

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
          rows={rows}
          columns={columns}
          orderState={orderState}
          setOrderState={setOrderState}
          playlistID='all_files'
          onRowDoubleClick={handlePlayRow}
          onContextMenu={({ data, position }) => {
            setMenu(position)
            setItem(data)
          }}
        />
      )}

      <ContextMenu
        anchor={menu && { anchorReference: 'anchorPosition', anchorPosition: menu }}
        item={item}
        onClose={() => setMenu(null)}
      />
    </>
  )
}

export default PlaylistTable
