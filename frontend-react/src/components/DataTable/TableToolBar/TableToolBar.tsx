import { MenuItem, Select, Toolbar } from '@mui/material'
import type { ToolbarProps } from '../props'
import { useAppContext } from '../../../assets/contexts/App/useAppContext'

const TableToolBar = ({ displayType, setDisplayType }: ToolbarProps) => {
  const { t } = useAppContext()
  return (
    <Toolbar style={{ height: 32, display: 'flex', justifyContent: 'end' }}>
      <div>
        <Select variant="standard" value={displayType} onChange={(e) => setDisplayType(e.target.value)}>
          <MenuItem value={'list'}>{t('list')}</MenuItem>
          <MenuItem value={'compact'}>{t('compact')}</MenuItem>
        </Select>
      </div>
    </Toolbar>
  )
}

export default TableToolBar
