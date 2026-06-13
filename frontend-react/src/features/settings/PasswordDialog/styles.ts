import { DialogContent, styled, TextField } from '@mui/material'

export const StyledTextField = styled(TextField)({
  width: 300,
})

export const StyledDialogContent = styled(DialogContent)({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  overflow: 'visible',
  width: 550,
  alignItems: 'center',
})
