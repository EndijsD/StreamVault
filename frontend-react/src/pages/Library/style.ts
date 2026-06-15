import { Box, styled } from '@mui/material'

export const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  flex: 1,
}))

export const Grid = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
  justifyContent: 'start',
}))

export const FolderBox = styled(Box)(({ theme }) => ({
  cursor: 'pointer',
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center',
  width: 'fit-content',
}))

export const Section = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
})

export const SpaceBetween = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
})
