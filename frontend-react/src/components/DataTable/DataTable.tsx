import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import type { DataTableProps, DisplayType } from './props'
import { useEffect, useState, type MouseEvent, type ReactNode } from 'react'
import TableHeader from './TableHeader'
import TableToolBar from './TableToolBar'

export const DataTable = <T extends { id: number | string }>({
  rows,
  columns,
  orderState,
  setOrderState,
  height,
  onPlayPlaylist,
  playlistID,
  onRowDoubleClick,
  onContextMenu,
}: DataTableProps<T>) => {
  const [selected, setSelected] = useState<(number | string)[]>([])
  const [displayType, setDisplayType] = useState<DisplayType>('list')

  const handleRequestSort = (_: MouseEvent<unknown>, property: keyof T) => {
    setOrderState((prev) => ({ orderBy: property, orderDir: prev.orderDir === 'asc' ? 'desc' : 'asc' }))
  }

  const handleRowClick = (e: MouseEvent<unknown>, id: number | string) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.ctrlKey || e.metaKey) {
      setSelected((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]))
    } else if (e.shiftKey && selected.length > 0) {
      const lastSelected = selected[selected.length - 1]
      const ids = visibleRows.map((r) => r.id)
      const fromId = ids.indexOf(lastSelected)
      const toId = ids.indexOf(id)
      const [start, end] = fromId < toId ? [fromId, toId] : [toId, fromId]
      const rangeIds = ids.slice(start, end + 1)
      setSelected((prev) => Array.from(new Set([...prev, ...rangeIds])))
    } else {
      setSelected([id])
    }
  }

  const getSelectedRows = (): T[] => {
    return rows.filter((row) => selected.includes(row.id))
  }

  const { orderBy, orderDir } = orderState
  const sortFn = columns.find((el) => el.id == orderBy)?.sort
  const visibleRows =
    orderBy && orderDir && sortFn ? rows.sort((a, b) => (orderDir == 'asc' ? sortFn(a, b) : sortFn(b, a))) : rows
  const dense = displayType == 'compact'

  useEffect(() => {
    const handleClickOutside = (e: globalThis.MouseEvent) => {
      const target = e.target as HTMLElement

      if (!target.closest("[data-row='true']")) {
        setSelected([])
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <>
      <Box sx={{ width: '100%', height: height ?? '100%' }}>
        <Paper sx={{ width: '100%', height: '100%' }}>
          <TableToolBar
            playlistID={playlistID}
            onPlayPlaylist={onPlayPlaylist}
            displayType={displayType}
            setDisplayType={setDisplayType}
          />

          <TableContainer style={{ overflow: 'auto', height: 'calc(100% - 64px)' }}>
            <Table stickyHeader sx={{ minWidth: 750 }} size={dense ? 'small' : 'medium'}>
              <TableHeader dense={dense} columns={columns} orderState={orderState} onRequestSort={handleRequestSort} />
              <TableBody>
                {visibleRows.map((row) => {
                  const isSelected = selected.includes(row.id)
                  return (
                    <TableRow
                      onMouseDown={(e: React.MouseEvent) => e.shiftKey && e.preventDefault()}
                      data-row
                      onDoubleClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onRowDoubleClick?.(row)
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault()
                        e.stopPropagation()

                        setSelected((prev) => [...prev, row.id])
                        onContextMenu?.({
                          position: {
                            left: e.clientX,
                            top: e.clientY,
                          },
                          data: {
                            currentRow: row,
                            selectedRows: getSelectedRows().includes(row)
                              ? getSelectedRows()
                              : [row, ...getSelectedRows()],
                            allRows: rows,
                          },
                        })
                      }}
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
                            {col.render ? col.render(value, row, dense) : (value as ReactNode)}
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
    </>
  )
}

export default DataTable
