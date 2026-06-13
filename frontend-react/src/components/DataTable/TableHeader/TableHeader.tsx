import type { MouseEvent } from 'react'
import { useAppContext } from '../../../assets/contexts/App/useAppContext'
import type { TableHeadProps } from '../props'
import { TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material'

export function TableHeader<T>({ columns, orderState, onRequestSort, dense }: TableHeadProps<T>) {
  const { t } = useAppContext()
  const { orderBy, orderDir } = orderState
  const createSortHandler = (property: keyof T) => (event: MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {columns.map((col) => (
          <TableCell
            key={String(col.id)}
            align={'left'}
            padding={col.disablePadding || dense ? 'none' : 'normal'}
            sortDirection={orderBy === col.id ? (orderDir ? orderDir : undefined) : undefined}
          >
            <TableSortLabel
              active={orderBy === col.id}
              direction={orderBy === col.id ? (orderDir ? orderDir : undefined) : undefined}
              onClick={createSortHandler(col.id)}
            >
              {t(col.label)}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}
export default TableHeader
