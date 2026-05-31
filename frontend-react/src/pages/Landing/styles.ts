import { Box, styled, Typography } from '@mui/material'

export const Container = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
  height: '100%',
})

export const Title = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(8),
  color: theme.palette.primary.main,
  fontWeight: theme.typography.fontWeightBold,
  textShadow: `0px 0px 1px ${theme.palette.grey[900]}`,
}))

export const ButtonBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: '100%',
  maxWidth: 200,
}))
