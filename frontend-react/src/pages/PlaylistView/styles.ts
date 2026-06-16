import { Box, Button, Paper, styled, Typography } from '@mui/material'

export const Container = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
})

export const Header = styled(Paper)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(4),
  padding: theme.spacing(2),
  alignItems: 'center',
}))

export const TextBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}))

export const Title = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightBold,
  cursor: 'pointer',
}))

export const Description = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  cursor: 'pointer',
}))

export const StyledButton = styled(Button)({
  padding: 0,
})
