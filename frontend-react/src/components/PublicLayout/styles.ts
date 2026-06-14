import { Box, styled } from '@mui/material'

export const StyledBox = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: -200,
  background: `radial-gradient(${theme.palette.primary.main} 10%, ${theme.palette.secondary.main} 150%)`,
  width: '100%',
  height: 300,
  borderRadius: '100% 10% 0 0',
  filter: 'blur(10px)',
}))

export const StyledBox2 = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: -20,
  left: -150,
  background: `linear-gradient(120deg, ${theme.palette.secondary.main} 30%, ${theme.palette.primary.main} , ${theme.palette.secondary.main} 110%)`,
  width: 300,
  height: 100,
  borderRadius: ' 100% 50% 100% 50%',
  filter: 'blur(10px)',
}))

export const Foreground = styled(Box)({
  position: 'relative',
  zIndex: 1,
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
})

export const Background = styled(Box)({
  zIndex: 0,
})
