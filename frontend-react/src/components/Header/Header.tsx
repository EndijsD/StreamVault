import { CircularProgress, IconButton, InputAdornment, ListItemIcon, Menu, MenuItem, Tooltip } from '@mui/material'
import * as S from './styles'
import axios from 'axios'
import { Logout, Person, Search, Settings, Upload } from '@mui/icons-material'
import { useAppContext } from '../../assets/contexts/App/useAppContext'
import { useEffect, useState } from 'react'
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router'
import { useToast } from '../../assets/contexts/Toast/useToast'
import { useMutation } from '@tanstack/react-query'
import UploadFiles from '../UploadFiles'

const Header = () => {
  const { t, onUserChange } = useAppContext()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const nav = useNavigate()
  const toast = useToast()
  const [openUpload, setOpenUpload] = useState(false)
  const [query, setQuery] = useState('')
  const location = useLocation()
  const [searchParams] = useSearchParams()

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

  const handleClose = () => setAnchorEl(null)

  const handleSearch = () => {
    if (!query.trim()) return

    nav({
      pathname: '/search',
      search: createSearchParams({ query }).toString(),
    })
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuery(searchParams.get('query') ?? '')
  }, [searchParams])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (location.pathname !== '/search') setQuery('')
  }, [location.pathname])

  return (
    <S.StyledAppBar>
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
                <IconButton edge='start' onClick={handleSearch}>
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch()
          }
        }}
      />

      <S.OptionsBox>
        <Tooltip title={t('upload')}>
          <S.UploadButton onClick={() => setOpenUpload(true)}>
            <Upload />
          </S.UploadButton>
        </Tooltip>

        <UploadFiles open={openUpload} onOpenChange={setOpenUpload} />

        <Tooltip title={t('options')}>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Person />
          </IconButton>
        </Tooltip>
      </S.OptionsBox>

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
  )
}

export default Header
