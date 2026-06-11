import { CssBaseline, ThemeProvider } from '@mui/material'
import { RouterProvider } from 'react-router'
import { router } from './assets/routes'
import theme from './assets/theme'
import { ToastProvider } from './assets/contexts/Toast/ToastProvider'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
