import { Button, MenuItem, Select, Toolbar } from '@mui/material'
import type { ToolbarProps } from '../props'
import { useAppContext } from '../../../assets/contexts/App/useAppContext'
import { PlayArrow, Pause } from '@mui/icons-material'
import { usePlayerContext } from '../../../assets/contexts/PlayerContext/usePlayerContext'

const TableToolBar = ({ displayType, setDisplayType, onPlayPlaylist, playlistID }: ToolbarProps) => {
  const { t } = useAppContext()
  const { playerState, trackInfo, setPlayerStateValue } = usePlayerContext()

  const isPlaying = trackInfo.playlistID == playlistID && playerState.isPlaying

  const handlePlay = () => {
    if (!trackInfo.src || trackInfo.src.startsWith('http')) onPlayPlaylist()
    else setPlayerStateValue('isPlaying', !isPlaying)
  }

  return (
    <Toolbar style={{ height: 32, display: 'flex', justifyContent: 'space-between' }}>
      <Button onClick={handlePlay} variant='contained' startIcon={!isPlaying ? <PlayArrow /> : <Pause />}>
        {!isPlaying ? t('play') : t('pause')}
      </Button>
      <div>
        <Select variant='standard' value={displayType} onChange={(e) => setDisplayType(e.target.value)}>
          <MenuItem value={'list'}>{t('list')}</MenuItem>
          <MenuItem value={'compact'}>{t('compact')}</MenuItem>
        </Select>
      </div>
    </Toolbar>
  )
}

export default TableToolBar
