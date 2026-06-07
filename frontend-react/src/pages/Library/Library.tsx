import { Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import LibraryGrid from '../../features/LibraryGrid';
import type { LibraryTab } from './props';
import PlayerControlPanel from '../../features/PlayerControlPanel';

const Library = () => {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState<LibraryTab>('library');

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ height: '100%', width: '100%', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div
          style={{
            display: 'flex',
            width: '100%',
            padding: 16,
            backgroundImage: `linear-gradient(to right,${theme.palette.primary.main} 10%, ${theme.palette.secondary.main} 150%)`,
            borderRadius: 8,
          }}
        >
          <Typography style={{ fontWeight: 600, fontSize: 20 }}>Your Library</Typography>
        </div>
        <LibraryGrid selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        <PlayerControlPanel />
      </div>
    </div>
  );
};

export default Library;
