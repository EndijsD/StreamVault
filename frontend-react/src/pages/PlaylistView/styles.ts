import { Box, Paper, styled, Typography } from '@mui/material'

export const Container = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
})

export const NoImage = styled(Box)(({ theme }) => ({
  height: 128,
  width: 128,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundImage: `linear-gradient(-45deg,${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.primary.contrastText,

  svg: {
    height: theme.spacing(8),
    width: theme.spacing(8),
  },
}))

export const Header = styled(Paper)(({ theme }) => ({
  display: 'flex',
  width: '100%',
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
}))

export const Description = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}))
