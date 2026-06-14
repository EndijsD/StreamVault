import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#3F5BFF',
          light: '#6D8BFF',
          dark: '#1A2E9E',
        },
        secondary: {
          main: '#FE6B8B',
          light: '#FF9DB2',
          dark: '#D94D6D',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#7A8CFF',
          light: '#A3B1FF',
          dark: '#4E63D9',
          contrastText: '#fff',
        },
        secondary: {
          main: '#FF7FA8',
          light: '#FFA6C2',
          dark: '#D95C86',
          contrastText: '#fff',
        },
      },
    },
  },

  typography: {
    fontFamily:
      'var(--font-primary, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif)',
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        '::-webkit-scrollbar': {
          width: theme.spacing(2),
        },

        '::-webkit-scrollbar-track': {
          background: theme.palette.grey[200],
          borderRadius: theme.shape.borderRadius,
        },

        '::-webkit-scrollbar-thumb': {
          background: theme.palette.grey[400],
          borderRadius: theme.spacing(1),
          border: `${theme.spacing(0.5)} solid ${theme.palette.grey[200]}`,
        },

        '::-webkit-scrollbar-thumb:hover': {
          background: theme.palette.grey[500],
        },
      }),
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          minWidth: 100,
          fontWeight: 'bold',
        },

        contained: ({ theme }) => ({
          background: `linear-gradient(
        45deg,
        ${theme.palette.primary.main} 30%,
        ${theme.palette.secondary.main} 90%
      )`,

          backgroundSize: '200% 200%',
          backgroundPosition: '20% 50%',

          transition: 'background-position 0.3s ease-in-out, transform 0.2s ease-in-out',

          boxShadow: theme.shadows[4],

          '&:hover': {
            backgroundPosition: '100% 50%',
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[4],
          },

          '&:active': {
            boxShadow: theme.shadows[4],
          },

          '&.Mui-disabled': {
            background: 'none',
          },
        }),
      },
    },

    MuiFormControl: {
      styleOverrides: {
        root: {
          width: '100%',
        },
      },
    },
  },
})

export default theme
