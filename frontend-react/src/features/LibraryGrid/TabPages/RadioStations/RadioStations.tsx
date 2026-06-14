import { usePlayerContext } from '../../../../assets/contexts/PlayerContext/usePlayerContext'
import { RadioStationData } from '../../../../RadioStations'
import PlaylistCard from '../../PlaylistCard'
import * as S from '../Libraries/style'
const RadioStations = () => {
  const { play } = usePlayerContext()
  return (
    <S.TabContentWrapper>
      {RadioStationData.map((el, i) => (
        <PlaylistCard
          onClick={() =>
            play({ type: 'radio', title: el.name, artist: '', duration: null, src: el.url, image: el.imagePath })
          }
          data={{ id: i, image: el.imagePath, imageExt: '', name: el.name }}
          key={i}
        />
      ))}
    </S.TabContentWrapper>
  )
}

export default RadioStations
