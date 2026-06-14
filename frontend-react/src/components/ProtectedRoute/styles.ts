import { Box, styled } from '@mui/material'

export const Page = styled(Box)({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
})

export const Container = styled(Page)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
})

export const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flex: 1,
  width: '100%',
  padding: theme.spacing(3),
  gap: theme.spacing(3),
  overflow: 'auto',
}))
