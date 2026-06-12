import { Box, DialogTitle, styled } from '@mui/material'

export const StyledDialogTitle = styled(DialogTitle)({
  display: 'flex',
  flexDirection: 'column',
})

export const TitleTop = styled('div')({
  display: 'flex',
})

export const UploadBox = styled(Box)(({ dragging }: { dragging: boolean }) => ({
  border: '2px dashed',
  borderColor: dragging ? '#6C63FF' : 'gray',
  borderRadius: 4,
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 16,
  cursor: 'pointer',
  transition: 'all 0.1s ease',
  '&:hover': {
    borderColor: '#6C63FF',
  },
}))

export const UploadBoxContent = styled(Box)({
  width: 56,
  height: 56,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})
