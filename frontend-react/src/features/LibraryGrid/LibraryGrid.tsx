// import type { LibraryGridProps } from './props'
// import type { LibraryTab, TabItem } from '../../pages/Home/props'
// import { Tab, Tabs } from '@mui/material'
// import * as S from './style'
// import AudioFiles from './TabPages/AudioFiles'
// import RadioStations from './TabPages/RadioStations'
// import Libraries from '../../pages/Library'
// import { useAppContext } from '../../assets/contexts/App/useAppContext'

// const LibraryTabs: TabItem[] = [
//   { label: 'library_tab', value: 'library' },
//   { label: 'radio_tab', value: 'radio' },
//   { label: 'files_tab', value: 'audio' },
// ]

// const getTabContent = (selectedTab: LibraryTab) => {
//   switch (selectedTab) {
//     case 'audio':
//       return <AudioFiles />
//     case 'library':
//       return <Libraries />
//     case 'radio':
//       return <RadioStations />
//   }
// }

// const LibraryGrid = ({ selectedTab, setSelectedTab }: LibraryGridProps) => {
//   const handleTabChange = (_: React.SyntheticEvent<Element, Event>, value: any) => setSelectedTab(value)
//   const { t } = useAppContext()

//   return (
//     <S.Main>
//       <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//         <Tabs value={selectedTab} onChange={handleTabChange}>
//           {LibraryTabs.map((el, i) => (
//             <Tab key={i} value={el.value} label={t(el.label)} />
//           ))}
//         </Tabs>
//       </div>

//       {getTabContent(selectedTab)}
//     </S.Main>
//   )
// }

// export default LibraryGrid
