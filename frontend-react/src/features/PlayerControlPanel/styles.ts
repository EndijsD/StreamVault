import { Loop } from '@mui/icons-material'
import { AppBar, Box, IconButton, Slider, styled, Typography } from '@mui/material'

export const StyledAppBar = styled(AppBar)<{ component: string }>(({ theme }) => ({
  top: 'auto',
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  zIndex: theme.zIndex.appBar,
  position: 'static',
  padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
}))

export const StyledSlider = styled(Slider)(({ theme }) => ({
  '& .MuiSlider-thumb': {
    width: theme.spacing(1.5),
    height: theme.spacing(1.5),
    '&:hover': {
      width: theme.spacing(2),
      height: theme.spacing(2),
    },

    '&:after': {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
  },
}))

export const StyledVolumeSlider = styled(StyledSlider)({
  width: 100,
})

export const ContentGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2),
  gridTemplateColumns: '1fr 1fr 1fr',
  width: '100%',

  '& > *': {
    minWidth: 0,
  },
}))

export const SliderLabelBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(-2),
  display: 'flex',
  justifyContent: 'space-between',
}))

export const PlayPauseIconButton = styled(IconButton)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  boxShadow: `0 0 10px ${theme.palette.primary.dark}80`,
  transition: 'transform 0.15s ease, box-shadow 0.15s ease',

  '&:hover': {
    background: theme.palette.primary.dark,
    transform: 'scale(1.08)',
    boxShadow: `0 0 20px ${theme.palette.primary.main}80`,
  },
  '&:active': { transform: 'scale(0.96)' },
}))

export const VolumeBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center',
  justifyContent: 'end',
}))

export const StyledIconButton = styled(IconButton)<{ active?: boolean }>(({ theme, active }) => ({
  ...(active && { color: theme.palette.secondary.main }),
}))

export const RepeatBox = styled(Box)({
  position: 'relative',
  display: 'inline-flex',
})

export const StyledLoop = styled(Loop)({
  position: 'absolute',
  // top: '50%',
  // left: '50%',
  // transform: 'translate(-50%, -50%)',
  top: -4,
  right: -4,
  fontSize: 8,
  filter: 'drop-shadow(.3px 0 currentColor)',
})

export const SongBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  minWidth: 0,
}))

export const TextBox = styled(Box)({
  minWidth: 0,
})

export const SmallText = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.caption.fontSize,
  color: theme.palette.text.secondary,
}))
