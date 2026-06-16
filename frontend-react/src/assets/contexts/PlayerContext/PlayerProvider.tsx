import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { PlayerContext } from './usePlayerContext'
import { RadioStationData } from '../../../RadioStations'
import type { DBSong } from '../../../../../shared-types/types'
import { shuffle } from '../../../functions'

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
  artist?: string | null
  duration?: number | null
  src: string
  image?: string | null
  playlistRows?: DBSong[]
  playlistID?: string
}

const baseURL = import.meta.env.VITE_BACKEND_URL

export const PlayerProvider = ({ children }: Props) => {
  const [trackInfo, setTrackInfo] = useState<TrackInfo>({
    type: null,
    artist: '',
    title: '',
    duration: null,
    src: '',
    image: null,
    playlistRows: [],
    playlistID: '',
  })
  const [shuffled, setShuffled] = useState<DBSong[] | null>(null)
  const [playerState, setPlayerState] = useState<PlayerState>({
    duration: 0,
    isPlaying: false,
    isShuffle: false,
    progress: 0,
    repeatMode: 'none',
    volume: 50,
  })
  const playerRef = useRef<HTMLAudioElement | null>(null)

  const setPlayerStateValue = <K extends keyof PlayerState>(key: K, value: PlayerState[K]) => {
    if (key === 'progress' && playerRef.current) playerRef.current.currentTime = value as number //Handles manual progress change
    setPlayerState((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  //Creates a new shuffled list when new play session is called
  const play = (data: TrackInfo) => {
    setTrackInfo(data)
    if (data.playlistRows) setShuffled(shuffle(data.playlistRows))
  }

  const playSong = (dir: 'next' | 'prev') => {
    if (!trackInfo.playlistRows) return
    if (trackInfo.type !== 'song' || trackInfo.playlistRows.length === 0) return

    const activeList = playerState.isShuffle ? (shuffled ?? shuffle(trackInfo.playlistRows)) : trackInfo.playlistRows

    const currIndex = activeList.findIndex((el) => el.id.toString() === trackInfo.src)
    if (currIndex === -1) return

    const newIndex =
      dir === 'next'
        ? currIndex === activeList.length - 1
          ? 0
          : currIndex + 1
        : currIndex === 0
          ? activeList.length - 1
          : currIndex - 1

    const nextSong = activeList[newIndex]

    setTrackInfo((prev) => ({
      type: 'song',
      title: nextSong.title,
      artist: nextSong.artist ?? '',
      duration: nextSong.duration_s,
      src: nextSong.id.toString(),
      image: nextSong.image_base64,
      playlistRows: trackInfo.playlistRows,
      playlistID: prev.playlistID,
    }))

    if (playerState.isShuffle && !shuffled) setShuffled(activeList)
  }

  //Observes volume change
  useEffect(() => {
    const Player = playerRef.current
    if (!Player) return
    Player.volume = playerState.volume / 100
  }, [playerState.volume])

  //Observes repeat mode change
  useEffect(() => {
    const Player = playerRef.current
    if (!Player) return
    Player.loop = playerState.repeatMode === 'one'
  }, [playerState.repeatMode])

  //Observes shuffle mode change
  useEffect(() => {
    const Player = playerRef.current
    if (!Player) return
    const { playlistRows, src } = trackInfo
    if (playlistRows && src) {
      if (!trackInfo.playlistRows) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setShuffled(null)
        return
      }

      const currentItem = trackInfo.playlistRows.find((el) => String(el.id) === src)!
      setShuffled([currentItem, ...shuffle(trackInfo.playlistRows).filter((el) => String(el.id) !== src)])
    }
  }, [playerState.isShuffle])

  //Observes play/pause change
  useEffect(() => {
    const Player = playerRef.current
    if (!Player) return

    if (playerState.isPlaying && Player.paused) {
      Player.play().catch((err) => {
        if (err.name !== 'AbortError') console.error(err)
      })
    } else if (!playerState.isPlaying && !Player.paused) {
      Player.pause()
    }
  }, [playerState.isPlaying])

  //Sets audio source on track change and adds credentials when needed
  //radio API's break with credentials so DO NOT TOUCH
  useEffect(() => {
    const Player = playerRef.current
    if (!Player || !trackInfo.src) return

    if (trackInfo.type == 'radio') {
      Player.crossOrigin = null
      Player.src = trackInfo.src
    } else {
      Player.crossOrigin = 'use-credentials'
      Player.src = `${baseURL}/files/${trackInfo.src}`
    }

    Player.play().catch((err) => {
      if (err.name !== 'AbortError') console.error(err)
    })
    setPlayerState((prev) => ({ ...prev, isPlaying: true, progress: 0 }))
  }, [trackInfo])

  //Uncontrolled track switching function
  const changeTrack = useCallback(
    (dir: 'next' | 'prev') => {
      if (trackInfo.type === 'radio') {
        const currID = RadioStationData.findIndex((el) => el.url === trackInfo.src)
        const length = RadioStationData.length
        const newTrackID =
          dir == 'next' ? (currID == length - 1 ? 0 : currID + 1) : currID == 0 ? length - 1 : currID - 1
        const nextStation = RadioStationData[newTrackID]
        const { imagePath, name, url } = nextStation
        setTrackInfo((prev) => ({
          artist: '',
          duration: null,
          image: imagePath,
          src: url,
          title: name,
          type: 'radio',
          playlistRows: [],
          playlistID: prev.playlistID,
        }))
      } else if (trackInfo.type === 'song') playSong(dir)
    },
    [trackInfo, playerState.isShuffle, shuffled],
  )

  useEffect(() => {
    //fetch last played song/radio state
  }, [])

  //System media control data and control handling
  useEffect(() => {
    if (!('mediaSession' in navigator)) return

    navigator.mediaSession.metadata = new MediaMetadata({
      title: trackInfo.title,
      artist: trackInfo.artist ?? undefined,
      artwork: [
        { src: trackInfo.image ?? '', sizes: '96x96' },
        { src: trackInfo.image ?? '', sizes: '128x128' },
        { src: trackInfo.image ?? '', sizes: '192x192' },
        { src: trackInfo.image ?? '', sizes: '256x256' },
        { src: trackInfo.image ?? '', sizes: '384x384' },
        { src: trackInfo.image ?? '', sizes: '512x512' },
      ],
    })
  }, [trackInfo])

  //audio tag event handling
  useEffect(() => {
    if (!('mediaSession' in navigator)) return

    navigator.mediaSession.setActionHandler('play', () => {
      playerRef.current?.play()
      setPlayerStateValue('isPlaying', true)
    })

    navigator.mediaSession.setActionHandler('pause', () => {
      playerRef.current?.pause()
      setPlayerStateValue('isPlaying', false)
    })

    navigator.mediaSession.setActionHandler('previoustrack', () => {
      changeTrack('prev')
    })

    navigator.mediaSession.setActionHandler('nexttrack', () => {
      changeTrack('next')
    })

    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (playerRef.current && details.seekTime != null) {
        playerRef.current.currentTime = details.seekTime
      }
    })

    return () => {
      navigator.mediaSession.setActionHandler('play', null)
      navigator.mediaSession.setActionHandler('pause', null)
      navigator.mediaSession.setActionHandler('previoustrack', null)
      navigator.mediaSession.setActionHandler('nexttrack', null)
      navigator.mediaSession.setActionHandler('seekto', null)
    }
  }, [changeTrack])

  //Handles setting actual player progress from audio tag state
  useEffect(() => {
    const audio = playerRef.current
    if (!audio) return

    const onTimeUpdate = () => setPlayerState((prev) => ({ ...prev, progress: audio.currentTime }))
    const onLoadedMetadata = () => setPlayerState((prev) => ({ ...prev, duration: audio.duration }))
    const onEnded = () => {
      if (playerState.repeatMode === 'one' || (!trackInfo.playlistRows && playerState.repeatMode === 'all')) {
        audio.currentTime = 0
        audio.play()
        return
      }

      if (!trackInfo.playlistRows) return

      const activeList = playerState.isShuffle ? (shuffled ?? trackInfo.playlistRows) : trackInfo.playlistRows
      const currIndex = activeList.findIndex((el) => el.id.toString() === trackInfo.src)
      const isLast = currIndex === activeList.length - 1

      if (isLast && playerState.repeatMode !== 'all') {
        setPlayerState((prev) => ({ ...prev, isPlaying: false }))
        return
      }

      playSong('next')
    }

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('ended', onEnded)
    }
  }, [playSong])

  return (
    <PlayerContext.Provider value={{ play, changeTrack, playerRef, playerState, trackInfo, setPlayerStateValue }}>
      {children}
    </PlayerContext.Provider>
  )
}
