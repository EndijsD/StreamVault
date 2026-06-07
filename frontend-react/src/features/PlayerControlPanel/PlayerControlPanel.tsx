import { useState, useCallback } from 'react';
import { Box, IconButton, Slider, Typography, Stack, Tooltip, useTheme } from '@mui/material';
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
  QueueMusic,
} from '@mui/icons-material';

type RepeatMode = 'none' | 'all' | 'one';

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const PlayerControlPanel = () => {
  const theme = useTheme();

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(74); // seconds
  const [duration] = useState(213); // seconds
  const [volume, setVolume] = useState(70);
  const [prevVolume, setPrevVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('none');

  const effectiveVolume = isMuted ? 0 : volume;

  const handleMuteToggle = useCallback(() => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(prevVolume);
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  //   const handleVolumeChange = (_: Event, value: number | number[]) => {
  //     const v = value as number;
  //     setVolume(v);
  //     if (v > 0) setIsMuted(false);
  //   };

  const handleRepeat = () => {
    setRepeatMode((m) => (m === 'none' ? 'all' : m === 'all' ? 'one' : 'none'));
  };

  const VolumeIcon = effectiveVolume === 0 ? VolumeOff : effectiveVolume < 50 ? VolumeDown : VolumeUp;

  const RepeatIcon = repeatMode === 'one' ? RepeatOne : Repeat;

  const dimText = theme.palette.primary.main;
  const activeAccent = theme.palette.primary.main;
  const inactiveIcon = theme.palette.primary.main;
  const navIcon = theme.palette.primary.main;

  return (
    <Box
      sx={{
        display: 'flex',
        minWidth: '100%',
        flexDirection: 'column',
        maxWidth: 680,
        bgcolor: 'background.paper',
        borderRadius: 3,
        px: 2.5,
        py: 3,
        boxShadow: theme.shadows[8],
        border: `1px solid ${theme.palette.primary.main}`,
      }}
    >
      <Stack direction='row' alignItems='center' justifyContent='space-between' mb={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 1.5,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              flexShrink: 0,
              boxShadow: `0 4px 16px ${theme.palette.primary.main}55`,
            }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography
              noWrap
              sx={{
                color: 'text.primary',
                fontWeight: 600,
                fontSize: '0.95rem',
                letterSpacing: '-0.01em',
              }}
            >
              Something
            </Typography>
            <Typography noWrap sx={{ color: 'text.secondary', fontSize: '0.78rem' }}>
              Someone
            </Typography>
          </Box>
        </Box>
      </Stack>

      <Box>
        <Slider
          value={progress}
          min={0}
          max={duration}
          onChange={(_, v) => setProgress(v as number)}
          sx={{
            color: 'primary.main',
            '& .MuiSlider-thumb': {
              width: 12,
              height: 12,
              transition: 'transform 0.15s ease',
              '&:hover': {
                width: 16,
                height: 16,
                boxShadow: `0 0 0 4px ${theme.palette.primary.main}33`,
              },
            },
          }}
        />
        <Stack direction='row' justifyContent='space-between'>
          <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>{formatTime(progress)}</Typography>
          <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>{formatTime(duration)}</Typography>
        </Stack>
      </Box>

      <Stack direction='row' alignItems='center' justifyContent='center' spacing={1}>
        <Tooltip title={isMuted ? 'Unmute' : 'Mute'}>
          <IconButton
            size='small'
            onClick={handleMuteToggle}
            sx={{
              color: isMuted ? activeAccent : dimText,
              '&:hover': { color: 'text.primary' },
            }}
          >
            <VolumeIcon fontSize='small' />
          </IconButton>
        </Tooltip>

        <Tooltip title={isShuffle ? 'Shuffle on' : 'Shuffle off'}>
          <IconButton
            size='small'
            onClick={() => setIsShuffle((v) => !v)}
            sx={{
              color: isShuffle ? activeAccent : inactiveIcon,
              '&:hover': { color: 'text.primary' },
            }}
          >
            <Shuffle fontSize='small' />
          </IconButton>
        </Tooltip>

        <Tooltip title='Previous'>
          <IconButton sx={{ color: navIcon, '&:hover': { color: 'text.primary' } }}>
            <SkipPrevious />
          </IconButton>
        </Tooltip>

        <Tooltip title={isPlaying ? 'Pause' : 'Play'}>
          <IconButton
            onClick={() => setIsPlaying((v) => !v)}
            sx={{
              width: 52,
              height: 52,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              boxShadow: `0 4px 20px ${theme.palette.primary.main}80`,
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              '&:hover': {
                bgcolor: 'primary.dark',
                transform: 'scale(1.08)',
                boxShadow: `0 6px 28px ${theme.palette.primary.main}99`,
              },
              '&:active': { transform: 'scale(0.96)' },
            }}
          >
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
        </Tooltip>

        <Tooltip title='Next'>
          <IconButton sx={{ color: navIcon, '&:hover': { color: 'text.primary' } }}>
            <SkipNext />
          </IconButton>
        </Tooltip>

        <Tooltip title={repeatMode === 'none' ? 'Repeat off' : repeatMode === 'all' ? 'Repeat all' : 'Repeat one'}>
          <IconButton
            size='small'
            onClick={handleRepeat}
            sx={{
              color: repeatMode !== 'none' ? activeAccent : inactiveIcon,
              '&:hover': { color: 'text.primary' },
            }}
          >
            <RepeatIcon fontSize='small' />
          </IconButton>
        </Tooltip>

        <Tooltip title='Queue'>
          <IconButton size='small' sx={{ color: inactiveIcon, '&:hover': { color: 'text.primary' } }}>
            <QueueMusic fontSize='small' />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
};

export default PlayerControlPanel;
