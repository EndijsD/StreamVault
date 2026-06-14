import { useState } from 'react'
import LibraryGrid from '../../features/LibraryGrid'
import type { LibraryTab } from './props'
import * as S from './style'

const Library = () => {
  const [selectedTab, setSelectedTab] = useState<LibraryTab>('library')

  return (
    <S.Main>
      <S.PaddedContent>
        <LibraryGrid selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      </S.PaddedContent>
    </S.Main>
  )
}

export default Library
