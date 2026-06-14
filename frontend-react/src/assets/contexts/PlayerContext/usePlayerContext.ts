import { createContext, useContext } from 'react'
import type { PlayerState, TrackInfo } from './PlayerProvider'

export interface PlayerContext {
  play: (data: TrackInfo) => void
  changeTrack: (dir: 'next' | 'prev') => void
  playerRef: React.RefObject<HTMLAudioElement | null>
  playerState: PlayerState
  setPlayerStateValue: <K extends keyof PlayerState>(key: K, value: PlayerState[K]) => void
  trackInfo: TrackInfo
}

export const PlayerContext = createContext<PlayerContext | null>(null)

export const usePlayerContext = () => {
  const context = useContext(PlayerContext)
  if (!context) throw new Error('usePlayerContext must be used within PlayerProvider')
  return context
}
