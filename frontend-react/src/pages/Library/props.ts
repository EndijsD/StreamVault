import type { TranslationKey } from '../../assets/translations'

export type LibraryTab = 'library' | 'radio' | 'audio'
export type TabItem = { value: LibraryTab; label: TranslationKey }
