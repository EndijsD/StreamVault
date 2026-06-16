import { Info } from '@mui/icons-material'
import { Box, Link, Paper, styled, Typography } from '@mui/material'

export const Content = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
  height: '100%',
})

export const StyledPaper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: '30% / 100%',
  gap: theme.spacing(1),
  padding: `${theme.spacing(6)} ${theme.spacing(12)}`,
  width: '100%',
  maxWidth: 500,
}))

export const Title = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightMedium,
  fontSize: 'clamp(1rem, 4vw, 2rem)',
}))

export const StyledLink = styled(Link)(({ theme }) => ({
  cursor: 'pointer',
  color: theme.palette.primary.contrastText,
}))

export const StyledIcon = styled(Info)(({ theme }) => ({
  color: theme.palette.warning.main,
  fontSize: theme.typography.h3.fontSize,
}))

export const Description = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}))
