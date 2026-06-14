import { useEffect, useRef, useState, type ReactNode } from 'react'
import { PlayerContext } from './usePlayerContext'
import { RadioStationData } from '../../../RadioStations'

interface Props {
  children: ReactNode
}

export type RepeatMode = 'none' | 'all' | 'one'

export type PlayerState = {
  volume: number
  progress: number
  duration: number
  isShuffle: boolean
  repeatMode: RepeatMode
  isPlaying: boolean
}

export interface TrackInfo {
  type: 'radio' | 'song' | null
  title: string
  artist: string
  duration: number | null
  src: string | null
  image: string | null
}

export const PlayerProvider = ({ children }: Props) => {
  const [trackInfo, setTrackInfo] = useState<TrackInfo>({
    type: null,
    artist: '',
    title: '',
    duration: null,
    src: null,
    image: null,
  })
  const [playerState, setPlayerState] = useState<PlayerState>({
    duration: 213,
    isPlaying: false,
    isShuffle: false,
    progress: 74,
    repeatMode: 'none',
    volume: 70,
  })
  const playerRef = useRef<HTMLAudioElement | null>(null)

  const setPlayerStateValue = <K extends keyof PlayerState>(key: K, value: PlayerState[K]) => {
    setPlayerState((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.volume = playerState.volume / 100
      if (playerState.isPlaying) playerRef.current.play()
      else playerRef.current.pause()
    }
  }, [playerState])

  useEffect(() => {
    if (playerRef.current && trackInfo.src) {
      playerRef.current.src = trackInfo.src
      playerRef.current.play()
      setPlayerState((prev) => ({ ...prev, isPlaying: true, progress: 0 }))
    }
  }, [trackInfo])

  useEffect(() => {
    //fetch last played song/radio state
  }, [])

  const changeTrack = (dir: 'next' | 'prev') => {
    if (trackInfo.type === 'radio') {
      const currID = RadioStationData.findIndex((el) => el.url === trackInfo.src)
      const length = RadioStationData.length
      const nextStation =
        RadioStationData[
          dir == 'next' ? (currID == length - 1 ? 0 : currID + 1) : currID == 0 ? length - 1 : currID - 1
        ]
      const { imagePath, name, url } = nextStation
      setTrackInfo({ artist: '', duration: null, image: imagePath, src: url, title: name, type: 'radio' })
    }
  }

  return (
    <PlayerContext.Provider
      value={{ play: setTrackInfo, changeTrack, playerRef, playerState, trackInfo, setPlayerStateValue }}
    >
      {children}
    </PlayerContext.Provider>
  )
}
