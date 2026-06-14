import { RadioStationData } from '../../../../RadioStations'
import PlaylistCard from '../../PlaylistCard'
import * as S from '../Libraries/style'
const RadioStations = () => {
  return (
    <S.TabContentWrapper>
      {RadioStationData.map((el, i) => (
        <PlaylistCard data={{ id: i, image: el.imagePath, imageExt: '', name: el.name }} key={i} />
      ))}
    </S.TabContentWrapper>
  )
}

export default RadioStations

{
  /* <audio autoPlay>
        <source src="https://stream.radioskonto.lv:8443/stereo" type="audio/mpeg" />
      </audio> */
}
