import { WarningAmber } from '@mui/icons-material'
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
  background: `radial-gradient(${theme.palette.primary.main} 10%, ${theme.palette.secondary.main} 300%)`,
  gap: theme.spacing(2),
  padding: `${theme.spacing(6)} ${theme.spacing(12)}`,
  width: '100%',
  maxWidth: 500,
}))

export const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  fontWeight: theme.typography.fontWeightBold,
  textShadow: `1px 1px 2px ${theme.palette.grey[900]}`,
}))

export const StyledLink = styled(Link)(({ theme }) => ({
  cursor: 'pointer',
  color: theme.palette.primary.contrastText,
}))

export const StyledWarning = styled(WarningAmber)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  fontSize: theme.typography.h3.fontSize,
}))
