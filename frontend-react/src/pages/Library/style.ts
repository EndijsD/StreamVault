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

export const PageLabel = styled('div')(({ theme }) => ({
  display: 'flex',
  width: '100%',
  padding: 16,
  backgroundImage: `linear-gradient(to right,${theme.palette.primary.main} 10%, ${theme.palette.secondary.main} 150%)`,
  borderRadius: 8,
}))

export const Title = styled('div')({
  fontWeight: 600,
  fontSize: 20,
  color: '#fff',
})
