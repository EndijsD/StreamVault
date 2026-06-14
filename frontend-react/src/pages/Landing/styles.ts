import { Box, Button, styled, Typography } from '@mui/material'

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
  fontWeight: theme.typography.fontWeightBold,
  color: 'transparent',
  backgroundClip: 'text',
  backgroundImage: `linear-gradient(
        10deg,
        ${theme.palette.primary.main},
        ${theme.palette.secondary.main} 90%
      )`,
  filter: `drop-shadow(0 0 4px ${theme.palette.grey[200]})`,
}))

export const ButtonBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: '100%',
  maxWidth: 200,
}))

export const PrimaryButton = styled(Button)(({ theme }) => ({
  height: theme.spacing(6),
}))
