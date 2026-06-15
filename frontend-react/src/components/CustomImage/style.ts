import { Box, Button, IconButton, styled } from '@mui/material'

export const Image = styled('img')<{ size: string | number }>(({ theme, size }) => ({
  height: size,
  width: size,
  borderRadius: theme.shape.borderRadius,
  objectFit: 'cover',
}))

export const Empty = styled(Box)<{ size: string | number }>(({ theme, size }) => ({
  height: size,
  width: size,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundImage: `linear-gradient(-45deg,${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.primary.contrastText,

  svg: {
    height: '50%',
    width: '50%',
  },
}))

export const StyledButton = styled(Button)(({ theme }) => ({
  padding: 0,
  border: `2px dashed ${theme.palette.grey[400]}`,

  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}))

export const Relative = styled(Box)({
  position: 'relative',
})

export const DeleteIconButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  color: theme.alpha(theme.palette.common.white, 0.8),
  backgroundColor: theme.alpha(theme.palette.error.main, 0.5),

  '&:hover': {
    backgroundColor: theme.palette.error.dark,
  },
}))
