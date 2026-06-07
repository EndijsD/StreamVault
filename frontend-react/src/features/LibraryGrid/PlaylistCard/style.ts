import { styled } from '@mui/material';

export const Main = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: 8,
  transition: 'all .2s ease-out',
  borderRadius: 8,
  position: 'relative',
  boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
  ':hover': {
    backgroundColor: theme.palette.primary.light,
    cursor: 'pointer',
  },
}));

export const Image = styled('img')({
  height: 128,
  width: 128,
  backgroundColor: 'green',
});

export const NoImage = styled('div')(({ theme }) => ({
  height: 128,
  width: 128,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundImage: `linear-gradient(-45deg,${theme.palette.secondary.main} , ${theme.palette.primary.main} )`,
}));
