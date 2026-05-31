import { Box, Paper, styled, Typography } from '@mui/material'
import { GeneralContainedButton } from '../../assets/GeneralStyles'

export const Container = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
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
  gap: theme.spacing(2),
  padding: `${theme.spacing(6)} ${theme.spacing(12)}`,
  width: '100%',
  maxWidth: 500,
}))

export const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: theme.typography.fontWeightBold,
  textTransform: 'uppercase',
  textShadow: `0px 0px 1px ${theme.palette.grey[900]}`,
}))

export const StyledButton = styled(GeneralContainedButton)(({ theme }) => ({
  marginTop: theme.spacing(1),
}))
