import DataTable from '../../../../components/DataTable'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import type { DBSong } from '../../../../../../shared-types/types'
import { useToast } from '../../../../assets/contexts/Toast/useToast'
import { useEffect, useState } from 'react'
import { columns } from './columns'
import type { Order } from '../../../../components/DataTable/props'
import UploadFiles from '../../../../components/UploadFiles/UploadFiles'

const fetchFiles = async () => {
  return await axios.get<DBSong[]>('/files')
}

const AudioFiles = () => {
  const toast = useToast()
  const [rows, setRows] = useState<DBSong[]>([])
  const [orderState, setOrderState] = useState<Order<DBSong>>({ orderBy: null, orderDir: null })

  const { error, data } = useQuery({
    queryKey: ['songs'],
    queryFn: fetchFiles,
  })

  useEffect(() => {
    if (data?.data) setRows(data.data)
  }, [data])
  if (error) toast({ message: 'something_went_wrong', severity: 'error' })

  return (
    <>
      <UploadFiles />
      <DataTable<DBSong> rows={rows} columns={columns} orderState={orderState} setOrderState={setOrderState} />
    </>
  )
}

export default AudioFiles
