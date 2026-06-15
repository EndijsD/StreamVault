import { Box, styled } from '@mui/material'

export const Page = styled(Box)({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
})

export const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  padding: theme.spacing(3),
  gap: theme.spacing(3),
  overflow: 'auto',
}))
