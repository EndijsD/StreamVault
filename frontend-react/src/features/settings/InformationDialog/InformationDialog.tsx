import { Button, Dialog, DialogActions, DialogContentText, DialogTitle, Typography } from '@mui/material'
import { FormField } from '../../../pages/Settings/styles'
import { useAppContext } from '../../../assets/contexts/App/useAppContext'
import { useEffect, useState } from 'react'
import * as S from './styles'
import { useMutation } from '@tanstack/react-query'
import type { InformationForm } from './types'
import { useToast } from '../../../assets/contexts/Toast/useToast'
import axios from 'axios'

const InformationDialog = () => {
  const { t, onUserChange, user } = useAppContext()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<InformationForm>({
    name: user?.name ?? '',
    surname: user?.surname ?? '',
  })
  const toast = useToast()

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) setForm({ name: user?.name ?? '', surname: user?.surname ?? '' })
  }, [open, user?.name, user?.surname])

  const { mutate, isPending } = useMutation({
    mutationFn: (form: InformationForm) => axios.patch('users', [{ ...form, id: user?.id }]),
    onSuccess: () => {
      onUserChange(user && { ...user, name: form.name, surname: form.surname })
      toast({ message: 'information_update_success' })
      setOpen(false)
    },
    onError: () => {
      toast({ message: 'information_update_error', severity: 'error' })
    },
  })

  return (
    <>
      <FormField>
        <Typography>{t('information')}</Typography>
        <Button variant='outlined' onClick={() => setOpen(true)}>
          {t('update')}
        </Button>
      </FormField>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {t('information')}
          <DialogContentText>{t('information_description')}</DialogContentText>
        </DialogTitle>
        <S.StyledDialogContent>
          {/* <FormField>
            <Typography>{t('name')}</Typography> */}
          <S.StyledTextField
            size='small'
            label={t('name')}
            variant='outlined'
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {/* </FormField> */}
          {/* <FormField>
            <Typography>{t('surname')}</Typography> */}
          <S.StyledTextField
            size='small'
            label={t('surname')}
            variant='outlined'
            value={form.surname}
            onChange={(e) => setForm({ ...form, surname: e.target.value })}
          />
          {/* </FormField> */}
        </S.StyledDialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              if (user?.name === form.name && user?.surname === form.surname) {
                setOpen(false)
                return
              }
              mutate(form)
            }}
            loading={isPending}
            loadingPosition='start'
          >
            {t('update')}
          </Button>
          <Button onClick={() => setOpen(false)}>{t('cancel')}</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default InformationDialog
