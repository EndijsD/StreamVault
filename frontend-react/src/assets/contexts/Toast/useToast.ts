import { createContext, useContext, type ReactElement } from 'react'
import type { TranslationKey } from '../../translations'
import type { OverridableStringUnion } from '@mui/types'
import type { AlertColor, AlertPropsColorOverrides } from '@mui/material'

export interface ToastOptions {
  message: TranslationKey | ReactElement
  severity?: OverridableStringUnion<AlertColor, AlertPropsColorOverrides>
}

export const ToastContext = createContext<((options: ToastOptions) => void) | null>(null)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}
