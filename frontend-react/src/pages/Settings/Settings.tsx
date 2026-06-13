import { Divider, MenuItem, Typography, useColorScheme } from '@mui/material'
import * as S from './styles'
import type { Locale, TranslationKey } from '../../assets/translations'
import { useAppContext } from '../../assets/contexts/App/useAppContext'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useToast } from '../../assets/contexts/Toast/useToast'
import InformationDialog from '../../features/settings/InformationDialog'
import EmailDialog from '../../features/settings/EmailDialog'
import PasswordDialog from '../../features/settings/PasswordDialog'
import DeleteDialog from '../../features/settings/DeleteDialog'

const languages: { value: Locale; label: TranslationKey }[] = [
  { value: 'en-US', label: 'english' },
  { value: 'lv-LV', label: 'latvian' },
]

type Mode = 'light' | 'dark' | 'system'

const themes: { value: Mode; label: TranslationKey }[] = [
  { value: 'light', label: 'light' },
  { value: 'dark', label: 'dark' },
  { value: 'system', label: 'system' },
]

const Settings = () => {
  const { t, locale, onLocaleChange, user } = useAppContext()
  const { mode, setMode } = useColorScheme()
  const toast = useToast()

  const { mutate: mutateLanguage } = useMutation({
    mutationFn: (locale: Locale) => axios.patch('users', [{ id: user?.id, locale }]),
    onSuccess: () => {
      toast({ message: 'language_update_success' })
    },
    onError: () => {
      toast({ message: 'something_went_wrong', severity: 'error' })
    },
  })

  return (
    <S.Container>
      <Typography variant='h4'>{t('settings')}</Typography>

      <S.StyledPaper variant='outlined'>
        <Typography variant='h5'>{t('general')}</Typography>
        <Divider />

        <S.FormField>
          <Typography>{t('language')}</Typography>
          <S.StyledSelect
            size='small'
            value={locale}
            onChange={(e) => {
              mutateLanguage(e.target.value as Locale)
              onLocaleChange(e.target.value as Locale)
            }}
          >
            {languages.map(({ value, label }) => (
              <MenuItem key={value} value={value}>
                {t(label)}
              </MenuItem>
            ))}
          </S.StyledSelect>
        </S.FormField>

        <S.FormField>
          <Typography>{t('theme')}</Typography>
          <S.StyledSelect size='small' value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
            {themes.map(({ value, label }) => (
              <MenuItem key={value} value={value}>
                {t(label)}
              </MenuItem>
            ))}
          </S.StyledSelect>
        </S.FormField>
      </S.StyledPaper>

      <S.StyledPaper variant='outlined'>
        <Typography variant='h5'>{t('account')}</Typography>

        <Divider />

        <InformationDialog />
        <EmailDialog />
        <PasswordDialog />
      </S.StyledPaper>

      <S.StyledPaperRed variant='outlined'>
        <Typography variant='h5' color='error'>
          {t('dangerous')}
        </Typography>

        <Divider />

        <DeleteDialog />
      </S.StyledPaperRed>
    </S.Container>
  )
}

export default Settings
