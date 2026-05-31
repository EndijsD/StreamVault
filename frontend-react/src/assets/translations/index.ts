import enUS from './en-US'
import lvLV from './lv-LV'

export const locales = ['en-US', 'lv-LV'] as const
export type Locale = (typeof locales)[number]

export const translations: Record<Locale, typeof enUS> = {
  'en-US': enUS,
  'lv-LV': lvLV,
}

export type TranslationKey = keyof typeof enUS

export const isTranslationKey = (key: unknown): key is TranslationKey => typeof key === 'string' && key in enUS
