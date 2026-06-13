import type { DBSong } from '../../../../../../shared-types/types'
import type { ColumnDef } from '../../../../components/DataTable/props'
import * as S from './style'
import { formatDate } from '../../../../functions'
import AudiotrackIcon from '@mui/icons-material/Audiotrack'

export const columns: ColumnDef<DBSong>[] = [
  {
    id: 'title',
    label: 'title',
    disablePadding: false,
    render: (_, row) => (
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {row.image_base64 ? (
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
    numeric: true,
    disablePadding: false,
    render: (_, row) => <S.TableText>{row.artist ?? '-'}</S.TableText>,
  },
  {
    id: 'album',
    label: 'album',
    numeric: true,
    disablePadding: false,
    render: (_, row) => <S.TableText>{row.album ?? '-'}</S.TableText>,
  },
  {
    id: 'upload_date',
    label: 'upload_date',
    numeric: true,
    disablePadding: false,
    render: (_, row) => <S.TableText>{formatDate(row.upload_date)}</S.TableText>,
  },
]
