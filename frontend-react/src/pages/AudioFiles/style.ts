import { styled, Typography } from '@mui/material'

export const NoImage = styled('div')(({ theme }) => ({
  height: 42,
  width: 42,
  borderRadius: 4,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundImage: `linear-gradient(-45deg,${theme.palette.secondary.main} , ${theme.palette.primary.main} )`,
}))

export const TableText = styled(Typography)({
  fontSize: 12,
})
