import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import type { DataTableProps, DisplayType } from './props'
import { useState, type MouseEvent, type ReactNode } from 'react'
import TableHeader from './TableHeader'
import TableToolBar from './TableToolBar'

export const DataTable = <T extends { id: number | string }>({
  rows,
  columns,

  orderState,
  setOrderState,
}: DataTableProps<T>) => {
  const [selected, setSelected] = useState<(number | string)[]>([])
  const [displayType, setDisplayType] = useState<DisplayType>('compact')

  const handleRequestSort = (_: MouseEvent<unknown>, property: keyof T) => {
    setOrderState((prev) => ({ orderBy: property, orderDir: prev.orderDir === 'asc' ? 'desc' : 'asc' }))
  }

  const handleRowClick = (_: MouseEvent<unknown>, id: number | string) => {
    setSelected((prev) => {
      const idx = prev.indexOf(id)
      if (idx === -1) return [...prev, id]
      return prev.filter((v) => v !== id)
    })
  }

  // const visibleRows = useMemo(() => [...rows].sort(getComparator(order, orderBy)), [rows, order, orderBy])
  const visibleRows = rows
  const dense = displayType == 'compact'

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Paper sx={{ width: '100%', height: '100%' }}>
        <TableToolBar displayType={displayType} setDisplayType={setDisplayType} />

        <TableContainer>
          <Table sx={{ minWidth: 750 }} size={dense ? 'small' : 'medium'}>
            <TableHeader dense={dense} columns={columns} orderState={orderState} onRequestSort={handleRequestSort} />
            <TableBody>
              {visibleRows.map((row) => {
                const isSelected = selected.includes(row.id)
                return (
                  <TableRow
                    hover
                    key={row.id}
                    selected={isSelected}
                    onClick={(e) => handleRowClick(e, row.id)}
                    sx={{ cursor: 'pointer', height: dense ? 24 : 48 }}
                  >
                    {columns.map((col) => {
                      const value = row[col.id]
                      return (
                        <TableCell
                          key={String(col.id)}
                          align={'left'}
                          padding={col.disablePadding || dense ? 'none' : 'normal'}
                        >
                          {col.render ? col.render(value, row) : (value as ReactNode)}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}

export default DataTable
