import { AppBar, Box, IconButton, keyframes, styled, TextField } from '@mui/material'
import { Link } from 'react-router'

export const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: theme.spacing(10),
  justifyContent: 'space-between',
  alignItems: 'center',
  flex: 1,
  padding: theme.spacing(2),
}))

export const StyledAppBar = styled(AppBar)(({ theme }) => {
  return {
    minHeight: theme.spacing(8),
    maxHeight: theme.spacing(8),
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    padding: theme.spacing(1),
    background: `radial-gradient(${theme.palette.primary.main} 10%, ${theme.palette.secondary.main} 300%)`,
    zIndex: theme.zIndex.appBar,
    position: 'static',
    display: 'grid',
    gridTemplateColumns: '1fr 2fr 1fr',

    '& > *': {
      minWidth: 0,
    },

    '*': {
      color: theme.palette.primary.contrastText,
    },
  }
})

export const SearchField = styled(TextField)(({ theme }) => ({
  width: '100%',
  maxWidth: 500,
  height: '100%',
  justifySelf: 'center',

  '.MuiInputBase-root': {
    height: '100%',

    '.MuiInputAdornment-root': {
      margin: '0 !important',
    },

    input: {
      padding: 0,
      color: theme.palette.primary.contrastText,
    },

    '&:before, &:after': {
      content: 'unset',
    },
  },
}))

export const Image = styled('img')(({ theme }) => ({
  height: theme.spacing(5),
  borderRadius: theme.shape.borderRadius,
  background: theme.palette.primary.contrastText,
}))

export const StyledLink = styled(Link)({
  height: 'fit-content',
  width: 'fit-content',
  display: 'flex',
  alignItems: 'center',
})

export const OptionsBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.spacing(1),
}))

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

export const UploadButton = styled(IconButton)(({ theme }) => ({
  background: `linear-gradient(
    135deg,
    ${theme.palette.primary.main},
    ${theme.palette.secondary.main},
    ${theme.palette.primary.main}
  )`,
  backgroundSize: '300% 300%',
  animation: `${gradientShift} 4s ease infinite`,

  boxShadow: `0 0 12px ${theme.palette.secondary.main}66`,

  '&:hover': {
    transform: 'scale(1.05)',
  },

  transition: 'transform 0.2s ease',
}))
