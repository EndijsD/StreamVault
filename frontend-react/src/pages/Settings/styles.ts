import { Box, Paper, Select, styled } from '@mui/material'

export const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flex: 1,
  width: '100%',
  padding: theme.spacing(3),
  gap: theme.spacing(3),
}))

export const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  padding: 32,
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  width: '100%',
}))

export const StyledPaperRed = styled(StyledPaper)(({ theme }) => ({
  borderColor: theme.palette.error.main,
}))

export const StyledSelect = styled(Select)({
  minWidth: 200,
})

export const FormField = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})
