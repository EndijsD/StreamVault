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
        })
      },
    },
    {
      label: 'edit',
      action: () => {},
    },
    {
      label: 'delete',
      action: () => {},
    },
  ]

  if (error) toast({ message: 'something_went_wrong', severity: 'error' })

  return (
    <>
      {isPending ? (
        <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress size={60} />
        </div>
      ) : (
        <DataTable<DBSong>
          options={Options}
          rows={rows}
          columns={columns}
          orderState={orderState}
          setOrderState={setOrderState}
        />
      )}
    </>
  )
}

export default AudioFiles
