import type { TabItem } from './props'
import { Tab, Tabs } from '@mui/material'
import { useAppContext } from '../../assets/contexts/App/useAppContext'
import { Audiotrack, List, Radio } from '@mui/icons-material'
import { Outlet, useLocation, useNavigate } from 'react-router'

const tabs: TabItem[] = [
  { label: 'library_tab', value: 'library', icon: <List /> },
  { label: 'radio_tab', value: 'radio', icon: <Radio /> },
  { label: 'files_tab', value: 'audio', icon: <Audiotrack /> },
]

const Home = () => {
  const { t } = useAppContext()
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <>
      <Tabs value={location.pathname.split('/')[1]}>
        {tabs.map((el, i) => (
          <Tab key={i} value={el.value} label={t(el.label)} icon={el.icon} onClick={() => navigate(`/${el.value}`)} />
        ))}
      </Tabs>

      <Outlet />
    </>
  )
}

export default Home
