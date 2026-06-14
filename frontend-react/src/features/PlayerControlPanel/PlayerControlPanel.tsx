import { useState, useCallback } from 'react'
import { Box, IconButton, Typography, Stack, Tooltip, useTheme, tooltipClasses } from '@mui/material'
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

type RepeatMode = 'none' | 'all' | 'one'

const PlayerControlPanel = () => {
  const { t } = useAppContext()
  const theme = useTheme()
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(74)
  const [duration] = useState(213)
  const [volume, setVolume] = useState(70)
  const [prevVolume, setPrevVolume] = useState(70)
  const [isMuted, setIsMuted] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('none')

  const effectiveVolume = isMuted ? 0 : volume

  const handleMuteToggle = useCallback(() => {
    if (isMuted) {
      setIsMuted(false)
      setPrevVolume(volume)
      setVolume(prevVolume)
    } else {
      setIsMuted(true)
      setPrevVolume(volume)
      setVolume(0)
    }
  }, [isMuted, prevVolume, volume])

  const handleRepeat = () => setRepeatMode((m) => (m === 'none' ? 'all' : m === 'all' ? 'one' : 'none'))

  const VolumeIcon =
    effectiveVolume === 0 ? (isMuted ? VolumeOff : VolumeMute) : effectiveVolume < 50 ? VolumeDown : VolumeUp

  return (
    <S.StyledAppBar component='footer' color='default'>
      <S.ContentGrid>
        <S.SongBox>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 1.5,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              flexShrink: 0,
              boxShadow: `0 0 10px ${theme.palette.primary.main}80`,
            }}
          />
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
              title='Someth i ngdddd dd ddd asd a wd awd'
            >
              <Typography noWrap variant='subtitle2'>
                Someth i ngdddd dd ddd asd a wd awd
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
              <S.SmallText noWrap>Someone</S.SmallText>
            </Tooltip>
          </S.TextBox>
        </S.SongBox>

        <Stack direction='row' alignItems='center' justifyContent='center' spacing={1}>
          <Tooltip title={isShuffle ? t('shuffle_on') : t('shuffle_off')}>
            <S.StyledIconButton active={isShuffle} size='small' onClick={() => setIsShuffle((v) => !v)}>
              <Shuffle fontSize='small' />
            </S.StyledIconButton>
          </Tooltip>

          <Tooltip title={t('previous')}>
            <IconButton>
              <SkipPrevious />
            </IconButton>
          </Tooltip>

          <Tooltip title={isPlaying ? t('pause') : t('play')}>
            <S.PlayPauseIconButton onClick={() => setIsPlaying((v) => !v)}>
              {isPlaying ? <Pause /> : <PlayArrow />}
            </S.PlayPauseIconButton>
          </Tooltip>

          <Tooltip title={t('next')}>
            <IconButton>
              <SkipNext />
            </IconButton>
          </Tooltip>

          <Tooltip
            title={repeatMode === 'none' ? t('repeat_off') : repeatMode === 'all' ? t('repeat_all') : t('repeat_one')}
          >
            <S.StyledIconButton active={repeatMode !== 'none'} size='small' onClick={handleRepeat}>
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
              setVolume(v as number)
              setPrevVolume(v as number)
              if (v === 0) setIsMuted(true)
              else setIsMuted(false)
            }}
          />
        </S.VolumeBox>
      </S.ContentGrid>

      <Box>
        <S.StyledSlider
          value={progress}
          max={duration}
          valueLabelDisplay='auto'
          valueLabelFormat={(v) => formatTime(v)}
          onChange={(_, v) => setProgress(v as number)}
        />
        <S.SliderLabelBox>
          <S.SmallText variant='caption'>{formatTime(progress)}</S.SmallText>
          <S.SmallText variant='caption'>{formatTime(duration)}</S.SmallText>
        </S.SliderLabelBox>
      </Box>
    </S.StyledAppBar>
  )
}

export default PlayerControlPanel
