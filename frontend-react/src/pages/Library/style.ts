import { styled } from '@mui/material'

export const Main = styled('div')({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
})

export const PaddedContent = styled('div')({
  height: '100%',
  width: '100%',
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
})
