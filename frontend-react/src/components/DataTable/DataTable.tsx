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
import ContextMenu from './ContextMenu'

export const DataTable = <T extends { id: number | string }>({
  rows,
  columns,
  orderState,
  setOrderState,
  options,
  height,
  onPlayPlaylist,
  playlistID,
}: DataTableProps<T>) => {
  const [selected, setSelected] = useState<(number | string)[]>([])
  const [displayType, setDisplayType] = useState<DisplayType>('list')
  const [contextMenuState, setContextMenuState] = useState<{
    open: boolean
    row: T | null
    pos: { x: number; y: number } | null
  }>({ open: false, row: null, pos: null })

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

  const handleContextMenu = (event: MouseEvent<HTMLTableRowElement, globalThis.MouseEvent>, row: T) => {
    event.preventDefault()
    if (selected.length === 0 || !selected.includes(row.id)) handleRowClick(event, row.id)
    setContextMenuState((prev) =>
      prev.open
        ? { open: false, row: null, pos: null }
        : { open: true, row, pos: { x: event.clientX, y: event.clientY } },
    )
  }

  const { orderBy, orderDir } = orderState
  const sortFn = columns.find((el) => el.id == orderBy)?.sort
  const visibleRows =
    orderBy && orderDir && sortFn ? rows.sort((a, b) => (orderDir == 'asc' ? sortFn(a, b) : sortFn(b, a))) : rows
  const dense = displayType == 'compact'

  const { pos, open, row } = contextMenuState

  return (
    <>
      {pos && open && row && options && (
        <ContextMenu<T>
          anchorPosition={{ top: pos.y, left: pos.x }}
          handleClose={() => setContextMenuState({ open: false, pos: null, row: null })}
          options={options}
          selectedRows={getSelectedRows()}
          currentRow={row}
          all={rows}
        />
      )}
      <Box sx={{ width: '100%', height: height }}>
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
                      onContextMenu={(e) => handleContextMenu(e, row)}
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
