import { Box, styled } from '@mui/material'

export const StyledBox = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: -200,
  background: `radial-gradient(${theme.palette.primary.main} 10%, ${theme.palette.secondary.main} 150%)`,
  width: '100%',
  height: 300,
  borderRadius: '100% 10% 0 0',
  zIndex: 1,
}))

export const OutletWrapper = styled('div')({
  position: 'relative',
  zIndex: 2,
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  height: '100%',
})
