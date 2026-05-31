import type { TranslationKey } from './translations'

export type Errors<T> = {
  [K in keyof T]?: TranslationKey | null
}
