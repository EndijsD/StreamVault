import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import type { ContextMenuProps } from './props'
import { useAppContext } from '../../../assets/contexts/App/useAppContext'

const ContextMenu = ({ anchorPosition, handleClose, options }: ContextMenuProps) => {
  const { t } = useAppContext()
  return (
    <Menu
      id="long-menu"
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      keepMounted
      open={!!anchorPosition}
      onClose={handleClose}
    >
      {options.map((option, i) => (
        <MenuItem
          onClick={(event) => {
            option.action()
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
