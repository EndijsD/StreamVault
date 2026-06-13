import { useEffect, useRef, useState, type ReactNode } from 'react'
import { translations, type Locale, type TranslationKey } from '../../translations'
import { AppContext } from './useAppContext'
import type { DBUserStripped } from '../../../../../shared-types/types'
import axios from 'axios'

interface Props {
  children: ReactNode
}

export const AppProvider = ({ children }: Props) => {
  const [locale, setLocale] = useState<Locale>('en-US')
  const activeTranslations = translations[locale]
  const [user, setUser] = useState<DBUserStripped | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [initializationError, setInitializationError] = useState<unknown>()
  const refreshPooling = useRef<ReturnType<typeof setInterval>>(undefined)

  const refresh = async () => {
    await axios.post('auth/refresh').catch(() => {
      clearInterval(refreshPooling.current)
      setUser(null)
    })
  }

  const activateRefresh = () => {
    refreshPooling.current = setInterval(refresh, 600000)
  }

  useEffect(() => {
    const checkAuthAndStartRefresh = async () => {
      if (refreshPooling.current) return

      try {
        const { status, data } = await axios.get('auth/check')
        if (status !== 200) return

        setUser(data)
        refresh()
        activateRefresh()
      } catch (error) {
        setInitializationError(error)
      } finally {
        setIsInitializing(false)
      }
    }

    checkAuthAndStartRefresh()
  }, [])

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
        user,
        onUserChange: setUser,
        isInitializing,
        initializationError,
        activateRefresh,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
