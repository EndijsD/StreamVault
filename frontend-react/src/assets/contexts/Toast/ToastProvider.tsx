import { useState, type ReactNode } from 'react'
import { ToastContext, type ToastOptions } from './useToast'
import { Alert, Snackbar } from '@mui/material'
import { useAppContext } from '../App/useAppContext'

interface Props {
  children: ReactNode
}

interface Toast extends ToastOptions {
  open: boolean
}

export const ToastProvider = ({ children }: Props) => {
  const [toastState, setToastState] = useState<Toast | null>(null)
  const { t } = useAppContext()

  const handleClose = () => {
    setToastState((prev) => prev && { ...prev, open: false })
  }

  const toast = (options: ToastOptions) => {
    setToastState({ ...options, open: true })
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}

      <Snackbar
        open={toastState?.open}
        autoHideDuration={4000}
        onClose={(_, reason) => reason !== 'clickaway' && handleClose()}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={toastState?.severity}>
          {toastState?.message && (typeof toastState.message === 'string' ? t(toastState.message) : toastState.message)}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  )
}
