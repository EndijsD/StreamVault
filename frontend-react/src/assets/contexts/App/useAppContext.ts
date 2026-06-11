import { createContext, useContext } from 'react'
import type { Locale, TranslationKey } from '../../translations'
import type { DBUserStripped } from '../../../../../shared-types/types'

export interface AppContext {
  t: (key: TranslationKey) => string
  locale: Locale
  onLocaleChange: (locale: Locale) => void
  isInitializing: boolean
  initializationError: unknown
  user: DBUserStripped | null
  onUserChange: (user: DBUserStripped) => void
  activateRefresh: () => void
}

export const AppContext = createContext<AppContext | null>(null)

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppContext must be used within AppProvider')
  return context
}
