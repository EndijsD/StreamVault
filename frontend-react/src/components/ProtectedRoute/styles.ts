import { AppBar, Box, styled, TextField } from '@mui/material'
import { Link } from 'react-router'

export const Container = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
})

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

  '*': {
    color: theme.palette.grey[200],
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
      color: theme.palette.grey[200],
    },

    '&:before, &:after': {
      content: 'unset',
    },

    //   '.MuiOutlinedInput-notchedOutline': {
    //     borderColor: theme.palette.grey[200],
    //   },

    //   '&:hover .MuiOutlinedInput-notchedOutline': {
    //     borderColor: theme.palette.grey[200],
    //   },

    //   '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    //     borderColor: theme.palette.grey[200],
    //   },
  },
}))

export const Image = styled('img')(({ theme }) => ({
  height: '100%',
  borderRadius: '50%',
  background: theme.palette.grey[200],
}))

export const StyledLink = styled(Link)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(0.5),
}))
