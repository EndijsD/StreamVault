import { useState } from 'react'
import LibraryGrid from '../../features/LibraryGrid'
import type { LibraryTab } from './props'
// import PlayerControlPanel from '../../features/PlayerControlPanel'
import * as S from './style'

const Library = () => {
  const [selectedTab, setSelectedTab] = useState<LibraryTab>('library')

  return (
    <S.Main>
      <S.PaddedContent>
        <S.PageLabel>
          <S.Title>Your Library</S.Title>
        </S.PageLabel>
        <LibraryGrid selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        {/* <PlayerControlPanel /> */}
      </S.PaddedContent>
    </S.Main>
  )
}

export default Library
