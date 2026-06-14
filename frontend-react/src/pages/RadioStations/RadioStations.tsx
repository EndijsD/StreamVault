import { usePlayerContext } from '../../assets/contexts/PlayerContext/usePlayerContext'
import PlaylistCard from '../../components/PlaylistCard'
import { RadioStationData } from '../../RadioStations'
import * as S from './style'

const RadioStations = () => {
  const { play } = usePlayerContext()

  return (
    <S.Grid>
      {RadioStationData.map((el, i) => (
        <PlaylistCard
          onClick={() =>
            play({
              type: 'radio',
              title: el.name,
              artist: '',
              duration: null,
              src: el.url,
              image: el.imagePath,
              playlistRows: [],
            })
          }
          data={{ image: el.imagePath, name: el.name, type: 'station' }}
          key={i}
        />
      ))}
    </S.Grid>
  )
}

export default RadioStations
