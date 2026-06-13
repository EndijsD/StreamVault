import { Navigate, Outlet, useNavigate } from 'react-router'
import { useAppContext } from '../../assets/contexts/App/useAppContext'
import { Box, CircularProgress, IconButton, InputAdornment, ListItemIcon, Menu, MenuItem, Tooltip } from '@mui/material'
import * as S from './styles'
import { Logout, Person, Search, Settings } from '@mui/icons-material'
import { useState } from 'react'
import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { useToast } from '../../assets/contexts/Toast/useToast'

const ProtectedRoute = () => {
  const { user, isInitializing, t, onUserChange } = useAppContext()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const nav = useNavigate()
  const toast = useToast()

  const { mutate, isPending } = useMutation({
    mutationFn: () => axios.post('auth/logout'),
    onSuccess: () => {
      onUserChange(null)
      nav('/login')
    },
    onError: () => {
      toast({ message: 'something_went_wrong', severity: 'error' })
    },
  })

  if (isInitializing)
    return (
      <S.Container>
        <CircularProgress />
      </S.Container>
    )

  const handleClose = () => setAnchorEl(null)

  return user ? (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <S.StyledAppBar position='static'>
        <S.StyledLink to='/library'>
          <S.Image src='/logo-no-background.png' />
        </S.StyledLink>

        <S.SearchField
          variant='filled'
          placeholder={t('search')}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position='start'>
                  <IconButton edge='start'>
                    <Search />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Tooltip title={t('options')}>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Person />
          </IconButton>
        </Tooltip>

        <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem
            onClick={() => {
              handleClose()
              nav('/settings')
            }}
          >
            <ListItemIcon>
              <Settings fontSize='small' />
            </ListItemIcon>
            {t('settings')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose()
              mutate()
            }}
            disabled={isPending}
          >
            <ListItemIcon>{isPending ? <CircularProgress size={20} /> : <Logout fontSize='small' />}</ListItemIcon>
            {t('logout')}
          </MenuItem>
        </Menu>
      </S.StyledAppBar>

      <Outlet />
    </Box>
  ) : (
    <Navigate to='/login' replace />
  )
}

export default ProtectedRoute
