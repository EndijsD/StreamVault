import { Button, styled } from '@mui/material'

// export const StyledPrimaryButton = styled(Button)(({ theme }) => ({
//   // background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
//   background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, #FE6B8B 90%)`,
//   // transition: 'all 0.2s ease-in-out',
//   // '&:hover': {
//   //   background: `linear-gradient(45deg, ${theme.palette.primary.main} 50%, #FE6B8B 90%)`,
//   // },
//   // transition: 'transform 0.2s ease-in-out',

//   // '&:hover': {
//   //   transform: 'translateY(-2px)',
//   // },

//   boxShadow: `0 3px 5px 2px ${theme.palette.grey[300]}`,

//   height: theme.spacing(6),
// }))

export const GeneralContainedButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(
    45deg,
    ${theme.palette.primary.main} 30%,
    #FE6B8B 90%
  )`,

  backgroundSize: '200% 200%',
  backgroundPosition: '20% 50%',

  transition: 'background-position 0.3s ease-in-out, transform 0.2s ease-in-out',

  '&:hover': {
    backgroundPosition: '100% 50%',
    transform: 'translateY(-2px)',
    boxShadow: `0 3px 5px 2px ${theme.palette.grey[300]}`,
  },

  '&:active': {
    boxShadow: `0 3px 5px 2px ${theme.palette.grey[300]}`,
  },

  boxShadow: `0 3px 5px 2px ${theme.palette.grey[300]}`,
  height: theme.spacing(6),

  '&.Mui-disabled': {
    background: 'none',
    // boxShadow: 'none',
  },
}))

// export const GeneralContainedButton = styled(Button)(({ theme }) => ({
//   position: 'relative',
//   overflow: 'hidden',
//   isolation: 'isolate',

//   background: `linear-gradient(
//     45deg,
//     ${theme.palette.primary.main} 30%,
//     #FE6B8B 90%
//   )`,

//   '&::before': {
//     content: '""',
//     position: 'absolute',
//     inset: 0,
//     zIndex: -1,
//     opacity: 0,
//     transition: 'opacity 0.3s ease',
//     background: `linear-gradient(
//       45deg,
//       ${theme.palette.primary.main} 50%,
//       #FE6B8B 90%
//     )`,
//   },

//   '&:hover::before': {
//     opacity: 1,
//   },

//   height: theme.spacing(6),
// }))
