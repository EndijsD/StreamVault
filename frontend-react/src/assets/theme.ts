import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';

export const tokens: ThemeOptions = {
  palette: {
    primary: {
      main: '#3F5BFF',
      light: '#6D8BFF',
      dark: '#1A2E9E',
    },
    // secondary: {
    //   main: '#7C5CFF',
    //   light: '#A28BFF',
    //   dark: '#4E33CC',
    // },
    secondary: {
      main: '#FE6B8B',
      light: '#FF9DB2',
      dark: '#D94D6D',
    },
    // info: {
    //   main: '#53C8FF',
    //   light: '#8BE3FF',
    //   dark: '#1F9EDB',
    //   //   contrastText: '#fff',
    // },
    // background: {
    //   paper: '#07124F',
    //   default: '#010A3D',
    // },
  },

  typography: {
    // allVariants: { color: '#010A3D' },
    // fontFamily:
    //   'var(--font-primary, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif)',
  },
};

export const components: ThemeOptions['components'] = {
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        minWidth: 100,
        fontWeight: 'bold',
      },
    },
  },
  MuiFormControl: {
    styleOverrides: {
      root: {
        width: '100%',
      },
    },
  },
};

const theme = createTheme({
  ...tokens,
  components: components,
});

export default theme;
