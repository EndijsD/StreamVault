import { useState, type ReactNode } from 'react'
import { translations, type Locale, type TranslationKey } from '../../translations'
import { AppContext } from './useAppContext'

interface Props {
  children: ReactNode
}

export const AppProvider = ({ children }: Props) => {
  const [locale, setLocale] = useState<Locale>('en-US')
  const activeTranslations = translations[locale]
  //   const [isInitializing, setIsInitializing] = useState(true);
  //   const [initializationError, setInitializationError] = useState<unknown>();

  const t = (key: TranslationKey) =>
    activeTranslations[key] ??
    (() => {
      console.warn(`Missing translation: ${key}`)
      return key
    })()

  return (
    <AppContext.Provider
      value={{
        t,
        locale,
        onLocaleChange: setLocale,
        // isInitializing,
        // initializationError,
        // locale,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
