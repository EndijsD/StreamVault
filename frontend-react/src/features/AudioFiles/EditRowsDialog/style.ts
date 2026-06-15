import { DialogContent, styled, TextField } from '@mui/material'

export const StyledTextField = styled(TextField)({
  width: 300,
})

export const StyledDialogContent = styled(DialogContent)({
  display: 'flex',
  gap: 16,
  overflow: 'visible',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
})

export const StyledInputsCol = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  overflow: 'visible',
  width: '100%',
  alignItems: 'center',
})

export const StyledDropzone = styled('div')<{ isDragging: boolean }>(({ theme, isDragging }) => ({
  border: `2px dashed ${isDragging ? theme.palette.primary.main : theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  cursor: 'pointer',
  backgroundColor: isDragging ? theme.palette.action.hover : 'transparent',
  transition: 'border-color 0.2s ease, background-color 0.2s ease',
  width: 300,
  height: 200,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}))

export const StyledPreviewImage = styled('img')({
  maxWidth: '100%',
  maxHeight: 160,
  objectFit: 'contain',
  borderRadius: 4,
})
