export type Station = {
  url: string
  imagePath: string
  name: string
  stream_mime_type: string
}

export const RadioStationData: Station[] = [
  {
    url: 'https://stream.radioskonto.lv:8443/stereo',
    stream_mime_type: 'audio/mpeg',
    name: 'Radio Skonto',
    imagePath: './RadioStations/Skonto.webp',
  },
  {
    url: 'https://stream.radiotev.lv:8443/radiov',
    stream_mime_type: 'audio/mpeg',
    name: 'Radio TEV',
    imagePath: './RadioStations/RadioTev.webp',
  },
  {
    url: 'https://live.radioswh.lv:8443/swhmp3',
    stream_mime_type: 'audio/mpeg',
    name: 'Radio SWH',
    imagePath: './RadioStations/swh.webp',
  },
  {
    url: 'https://27943.live.streamtheworld.com/EHR_SUPERHITS.mp3',
    stream_mime_type: 'audio/mpeg',
    name: 'EHR Superhits',
    imagePath: './RadioStations/ehrSuperhits.webp',
  },
  {
    url: 'https://de-fra-1.live.advailo.com/starfm/hls/s/d39763de-accd-40b8-baa6-03b1ed0fdcf9/live.m3u8',
    stream_mime_type: 'audio/mpeg',
    name: 'Star FM',
    imagePath: './RadioStations/starfm.webp',
  },
  {
    url: 'https://28933.live.streamtheworld.com/RETRO_FM.mp3',
    stream_mime_type: 'audio/mpeg',
    name: 'Retro FM',
    imagePath: './RadioStations/retrofm.webp',
  },
]
