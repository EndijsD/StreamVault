import type { DBSong } from '../../../../../../shared-types/types'
import type { ColumnDef } from '../../../../components/DataTable/props'
import * as S from './style'
import { formatDate } from '../../../../functions'
import AudiotrackIcon from '@mui/icons-material/Audiotrack'

const formatDuration = (seconds?: number | null) => {
  if (seconds == null) return '-'

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export const columns: ColumnDef<DBSong>[] = [
  {
    id: 'title',
    label: 'title',
    disablePadding: false,
    sort: (a, b) => a.title.localeCompare(b.title),
    render: (_, row, dense) => (
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {dense ? (
          <></>
        ) : row.image_base64 ? (
          <img src={row.image_base64} style={{ height: 42, width: 42, borderRadius: 4, objectFit: 'cover' }} />
        ) : (
          <S.NoImage>
            <AudiotrackIcon style={{ color: '#fff', fontSize: 20 }} />
          </S.NoImage>
        )}

        <S.TableText>{row.title}</S.TableText>
      </div>
    ),
  },
  {
    id: 'artist',
    label: 'artist',
    disablePadding: false,
    sort: (a, b) => (a.artist ?? '').localeCompare(b.artist ?? ''),
    render: (_, row) => <S.TableText>{row.artist ?? '-'}</S.TableText>,
  },
  {
    id: 'album',
    label: 'album',
    disablePadding: false,
    sort: (a, b) => (a.album ?? '').localeCompare(b.album ?? ''),
    render: (_, row) => <S.TableText>{row.album ?? '-'}</S.TableText>,
  },
  {
    id: 'duration_s',
    label: 'duration',
    disablePadding: false,
    sort: (a, b) => a.duration_s - b.duration_s,
    render: (_, row) => <S.TableText>{formatDuration(row.duration_s)}</S.TableText>,
  },
  {
    id: 'upload_date',
    label: 'upload_date',
    disablePadding: false,
    sort: (a, b) => new Date(a.upload_date).getTime() - new Date(b.upload_date).getTime(),
    render: (_, row) => <S.TableText>{formatDate(row.upload_date)}</S.TableText>,
  },
]
