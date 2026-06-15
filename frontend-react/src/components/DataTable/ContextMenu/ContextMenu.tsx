import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import type { ContextMenuProps } from './props'
import { useAppContext } from '../../../assets/contexts/App/useAppContext'

const ContextMenu = <T extends { id: number | string }>({
  anchorPosition,
  handleClose,
  options,
  selectedRows,
  currentRow,
  all,
}: ContextMenuProps<T>) => {
  const { t } = useAppContext()

  return (
    <Menu
      anchorReference='anchorPosition'
      anchorPosition={anchorPosition}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      open={Boolean(anchorPosition)}
      onClose={handleClose}
    >
      {options.map((option, i) => (
        <MenuItem
          onClick={(event) => {
            option.action(all, selectedRows, currentRow)
            handleClose()
            event.stopPropagation()
          }}
          key={i}
        >
          {t(option.label)}
        </MenuItem>
      ))}
    </Menu>
  )
}

export default ContextMenu
