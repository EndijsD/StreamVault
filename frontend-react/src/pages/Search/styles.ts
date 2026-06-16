import { Box, Paper, styled } from '@mui/material'

export const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}))

export const Grid = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
  justifyContent: 'start',
}))

export const TitleBox = styled(Paper)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'center',
  padding: theme.spacing(1),

  '*': {
    fontWeight: theme.typography.fontWeightMedium,
  },

  svg: {
    color: theme.palette.secondary.main,
  },
}))
