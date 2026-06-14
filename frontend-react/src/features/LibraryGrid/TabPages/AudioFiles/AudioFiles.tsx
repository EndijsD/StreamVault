import DataTable from '../../../../components/DataTable'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import type { DBSong } from '../../../../../../shared-types/types'
import { useToast } from '../../../../assets/contexts/Toast/useToast'
import { useEffect, useState } from 'react'
import { columns } from './columns'
import type { Order } from '../../../../components/DataTable/props'
import { CircularProgress } from '@mui/material'

const fetchFiles = async () => {
  return await axios.get<DBSong[]>('/files')
}

const AudioFiles = () => {
  const toast = useToast()
  const [rows, setRows] = useState<DBSong[]>([])
  const [orderState, setOrderState] = useState<Order<DBSong>>({ orderBy: null, orderDir: null })

  const { error, data, isPending } = useQuery({
    queryKey: ['songs'],
    queryFn: fetchFiles,
  })

  useEffect(() => {
    if (data?.data) setRows(data.data)
  }, [data])

  if (error) toast({ message: 'something_went_wrong', severity: 'error' })

  return (
    <>
      {isPending ? (
        <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress size={60} />
        </div>
      ) : (
        <DataTable<DBSong> rows={rows} columns={columns} orderState={orderState} setOrderState={setOrderState} />
      )}
    </>
  )
}

export default AudioFiles
