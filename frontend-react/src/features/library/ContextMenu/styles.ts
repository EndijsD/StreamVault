import { MenuItem, styled } from '@mui/material'

export const DeleteMenuItem = styled(MenuItem)(({ theme }) => ({
  '*': {
    color: theme.palette.error.main,
  },
}))
