import { Paper, styled } from '@mui/material'

export const Main = styled(Paper)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',

  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: 8,

  borderRadius: 8,
  boxShadow: theme.shadows[3],
  cursor: 'pointer',

  transition: 'all .2s ease-out',

  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,

    background: `radial-gradient(
    circle at bottom right,
    ${theme.palette.secondary.main}66 0%,
    ${theme.palette.secondary.main}33 20%,
    ${theme.palette.secondary.main}11 40%,
    transparent 70%
  )`,

    opacity: 0,
    transition: 'all .3s ease-out',

    zIndex: 0,
  },

  '& > *': {
    position: 'relative',
    zIndex: 1,
  },

  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[5],
  },

  '&:hover::before': {
    opacity: 1,
  },
}))
