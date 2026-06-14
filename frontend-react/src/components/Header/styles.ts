import { AppBar, Box, styled, TextField } from '@mui/material'
import { Link } from 'react-router'

export const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: theme.spacing(10),
  justifyContent: 'space-between',
  alignItems: 'center',
  flex: 1,
  padding: theme.spacing(2),
}))

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  minHeight: theme.spacing(8),
  maxHeight: theme.spacing(8),
  justifyContent: 'space-between',
  alignItems: 'center',
  flex: 1,
  padding: theme.spacing(1),
  background: `radial-gradient(${theme.palette.primary.main} 10%, ${theme.palette.secondary.main} 300%)`,
  zIndex: theme.zIndex.appBar,
  position: 'static',

  '*': {
    color: theme.palette.primary.contrastText,
  },
}))

export const SearchField = styled(TextField)(({ theme }) => ({
  width: '50%',
  maxWidth: 500,
  height: '100%',

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
  height: '100%',
  borderRadius: theme.shape.borderRadius,
  background: theme.palette.primary.contrastText,
}))

export const StyledLink = styled(Link)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(0.5),
}))
