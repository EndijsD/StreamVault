import DataTable from '../../components/DataTable'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import type { DBSong } from '../../../../shared-types/types'
import { useToast } from '../../assets/contexts/Toast/useToast'
import { useState } from 'react'
import { columns } from './columns'
import type { Order, TableContextData } from '../../components/DataTable/props'
import { CircularProgress, type PopoverPosition } from '@mui/material'
import { usePlayerContext } from '../../assets/contexts/PlayerContext/usePlayerContext'
import ContextMenu from './ContextMenu'

const fetch = async () => {
  const res = await axios.get<DBSong[]>('/files')
  return res.data
}

const AudioFiles = () => {
  const toast = useToast()
  const { play } = usePlayerContext()
  const [orderState, setOrderState] = useState<Order<DBSong>>({ orderBy: null, orderDir: null })
  const { error, data, isPending } = useQuery({
    queryKey: ['songs'],
    queryFn: fetch,
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
          height='calc(100% - 96px)'
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

export default AudioFiles
