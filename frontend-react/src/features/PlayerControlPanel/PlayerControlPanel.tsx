import { useState, useCallback } from 'react'
import { Box, IconButton, Typography, Stack, Tooltip, tooltipClasses } from '@mui/material'
import {
  SkipPrevious,
  SkipNext,
  PlayArrow,
  Pause,
  Shuffle,
  Repeat,
  RepeatOne,
  VolumeOff,
  VolumeDown,
  VolumeUp,
  VolumeMute,
} from '@mui/icons-material'
import * as S from './styles'
import { useAppContext } from '../../assets/contexts/App/useAppContext'
import { formatTime } from './functions'
import { usePlayerContext } from '../../assets/contexts/PlayerContext/usePlayerContext'
import CustomImage from '../../components/CustomImage'

const PlayerControlPanel = () => {
  const { t } = useAppContext()
  const { playerState, playerRef, trackInfo, setPlayerStateValue, changeTrack } = usePlayerContext()
  const { isPlaying, isShuffle, progress, repeatMode, volume } = playerState
  const [prevVolume, setPrevVolume] = useState(70)
  const [tempProgress, setTempProgress] = useState(progress)
  const [isDragging, setIsDragging] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const handleMuteToggle = useCallback(() => {
    if (isMuted) {
      setIsMuted(false)
      setPrevVolume(volume)
      setPlayerStateValue('volume', prevVolume)
    } else {
      setIsMuted(true)
      setPrevVolume(volume)
      setPlayerStateValue('volume', 0)
    }
  }, [isMuted, prevVolume, volume])

  const handleRepeat = () =>
    setPlayerStateValue('repeatMode', repeatMode === 'none' ? 'all' : repeatMode === 'all' ? 'one' : 'none')

  const { artist, title, type, image, duration } = trackInfo

  const isPlayingRadio = type === 'radio'
  const effectiveVolume = isMuted ? 0 : volume

  const VolumeIcon =
    effectiveVolume === 0 ? (isMuted ? VolumeOff : VolumeMute) : effectiveVolume < 50 ? VolumeDown : VolumeUp

  return (
    <S.StyledAppBar component='footer' color='default'>
      <audio
        ref={playerRef}
        onPause={() => setPlayerStateValue('isPlaying', false)}
        onPlay={() => setPlayerStateValue('isPlaying', true)}
      />
      <S.ContentGrid>
        <S.SongBox>
          <CustomImage size={48} type={type === 'song' ? 'music' : 'station'} image={image} />

          <S.TextBox>
            <Tooltip
              placement='top'
              slotProps={{
                popper: {
                  sx: {
                    [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]: {
                      marginTop: '0px',
                    },
                    [`&.${tooltipClasses.popper}[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]: {
                      marginBottom: '0px',
                    },
                    [`&.${tooltipClasses.popper}[data-popper-placement*="right"] .${tooltipClasses.tooltip}`]: {
                      marginLeft: '0px',
                    },
                    [`&.${tooltipClasses.popper}[data-popper-placement*="left"] .${tooltipClasses.tooltip}`]: {
                      marginRight: '0px',
                    },
                  },
                },
              }}
              title={title}
            >
              <Typography noWrap variant='subtitle2'>
                {title}
              </Typography>
            </Tooltip>

            <Tooltip
              placement='top'
              slotProps={{
                popper: {
                  sx: {
                    [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]: {
                      marginTop: '0px',
                    },
                    [`&.${tooltipClasses.popper}[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]: {
                      marginBottom: '0px',
                    },
                    [`&.${tooltipClasses.popper}[data-popper-placement*="right"] .${tooltipClasses.tooltip}`]: {
                      marginLeft: '0px',
                    },
                    [`&.${tooltipClasses.popper}[data-popper-placement*="left"] .${tooltipClasses.tooltip}`]: {
                      marginRight: '0px',
                    },
                  },
                },
              }}
              title='Someone'
            >
              <S.SmallText noWrap>{artist}</S.SmallText>
            </Tooltip>
          </S.TextBox>
        </S.SongBox>

        <Stack direction='row' alignItems='center' justifyContent='center' spacing={1}>
          <Tooltip title={isShuffle ? t('shuffle_on') : t('shuffle_off')}>
            <S.StyledIconButton
              disabled={isPlayingRadio}
              active={isShuffle}
              size='small'
              onClick={() => setPlayerStateValue('isShuffle', !isShuffle)}
            >
              <Shuffle fontSize='small' />
            </S.StyledIconButton>
          </Tooltip>

          <Tooltip title={t('previous')}>
            <IconButton onClick={() => changeTrack('prev')}>
              <SkipPrevious />
            </IconButton>
          </Tooltip>

          <Tooltip title={isPlaying ? t('pause') : t('play')}>
            <S.PlayPauseIconButton onClick={() => setPlayerStateValue('isPlaying', !isPlaying)}>
              {isPlaying ? <Pause /> : <PlayArrow />}
            </S.PlayPauseIconButton>
          </Tooltip>

          <Tooltip title={t('next')}>
            <IconButton onClick={() => changeTrack('next')}>
              <SkipNext />
            </IconButton>
          </Tooltip>

          <Tooltip
            title={repeatMode === 'none' ? t('repeat_off') : repeatMode === 'all' ? t('repeat_all') : t('repeat_one')}
          >
            <S.StyledIconButton
              disabled={isPlayingRadio}
              active={repeatMode !== 'none'}
              size='small'
              onClick={handleRepeat}
            >
              {repeatMode === 'one' ? (
                <S.RepeatBox>
                  <RepeatOne fontSize='small' />
                  <S.StyledLoop />
                </S.RepeatBox>
              ) : repeatMode === 'all' ? (
                <S.RepeatBox>
                  <Repeat fontSize='small' />
                  <S.StyledLoop />
                </S.RepeatBox>
              ) : (
                <Repeat fontSize='small' />
              )}
            </S.StyledIconButton>
          </Tooltip>
        </Stack>

        <S.VolumeBox>
          <Tooltip title={isMuted ? t('unmute') : t('mute')}>
            <IconButton size='small' onClick={handleMuteToggle}>
              <VolumeIcon fontSize='small' />
            </IconButton>
          </Tooltip>

          <S.StyledVolumeSlider
            value={volume}
            onChange={(_, v) => {
              setPlayerStateValue('volume', v as number)
              setPrevVolume(v as number)
              if (v === 0) setIsMuted(true)
              else setIsMuted(false)
            }}
          />
        </S.VolumeBox>
      </S.ContentGrid>

      <Box>
        <S.StyledSlider
          disabled={isPlayingRadio}
          value={isDragging ? tempProgress : progress}
          max={duration ?? 0}
          valueLabelDisplay='auto'
          onMouseDown={() => {
            setIsDragging(true)
            setTempProgress(progress)
          }}
          onMouseUp={() => {
            setIsDragging(false)
            setPlayerStateValue('progress', tempProgress)
          }}
          valueLabelFormat={(v) => formatTime(v)}
          onChange={(_, v) => setTempProgress(v as number)}
        />
        <S.SliderLabelBox>
          <S.SmallText variant='caption'>{isPlayingRadio ? '--:--' : formatTime(progress)}</S.SmallText>
          <S.SmallText variant='caption'>{isPlayingRadio ? '--:--' : formatTime(duration ?? 0)}</S.SmallText>
        </S.SliderLabelBox>
      </Box>
    </S.StyledAppBar>
  )
}

export default PlayerControlPanel
