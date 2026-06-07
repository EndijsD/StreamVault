import { Typography } from '@mui/material';
import type { Library } from '../props';
import * as S from './style';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';

const PlaylistCard = ({ data }: { data: Library }) => {
  const { name, image } = data;
  return (
    <S.Main>
      {image ? (
        <S.Image src={`data:image/${data.imageExt};base64,${image}`} />
      ) : (
        <S.NoImage>
          <LibraryMusicIcon style={{ color: '#fff', fontSize: 42 }} />
        </S.NoImage>
      )}

      <Typography>{name}</Typography>
    </S.Main>
  );
};

export default PlaylistCard;
