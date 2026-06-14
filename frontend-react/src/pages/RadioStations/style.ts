import { Box, styled } from '@mui/material'

export const Grid = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
  justifyContent: 'start',
}))
