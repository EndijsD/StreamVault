import type { LibraryGridProps } from './props'
import type { LibraryTab, TabItem } from '../../pages/Library/props'
import { Tab, Tabs } from '@mui/material'
import * as S from './style'
import AudioFiles from './TabPages/AudioFiles'
import RadioStations from './TabPages/RadioStations'
import Libraries from './TabPages/Libraries'

const LibraryTabs: TabItem[] = [
  { label: 'Your Library', value: 'library' },
  { label: 'Radio stations', value: 'radio' },
  { label: 'Your Audio Files', value: 'audio' },
]

const getTabContent = (selectedTab: LibraryTab) => {
  switch (selectedTab) {
    case 'audio':
      return <AudioFiles />
    case 'library':
      return <Libraries />
    case 'radio':
      return <RadioStations />
  }
}

const LibraryGrid = ({ selectedTab, setSelectedTab }: LibraryGridProps) => {
  const handleTabChange = (_: React.SyntheticEvent<Element, Event>, value: any) => setSelectedTab(value)

  return (
    <S.Main>
      <Tabs value={selectedTab} onChange={handleTabChange}>
        {LibraryTabs.map((el, i) => (
          <Tab key={i} value={el.value} label={el.label} />
        ))}
      </Tabs>
      {getTabContent(selectedTab)}
    </S.Main>
  )
}

export default LibraryGrid
