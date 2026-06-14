import type { ReactElement } from 'react'
import type { TranslationKey } from '../../assets/translations'

export type TabValue = 'library' | 'radio' | 'audio'
export type TabItem = { value: TabValue; label: TranslationKey; icon: ReactElement }
