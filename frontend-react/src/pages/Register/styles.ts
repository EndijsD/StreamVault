import { Box, Button, Link, Paper, styled, Typography } from '@mui/material'

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

export const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
}))

export const StyledLink = styled(Link)({
  cursor: 'pointer',
})

// export const StyledListItemIcon = styled(ListItemIcon)<{ success: boolean }>(({ theme, success }) => ({
//   color: success ? theme.palette.success.main : undefined,
// }))
