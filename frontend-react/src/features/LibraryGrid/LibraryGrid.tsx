import { useState } from 'react';
import type { Library, LibraryGridProps } from './props';
import type { TabItem } from '../../pages/Library/props';
import { Tab, Tabs, Typography } from '@mui/material';

const LibraryTabs: TabItem[] = [
  { label: 'Your Library', value: 'library' },
  { label: 'Radio stations', value: 'radio' },
  { label: 'Your Audio Files', value: 'audio' },
];

const LibraryGrid = ({ selectedTab, setSelectedTab }: LibraryGridProps) => {
  const [libraries, _setLibraries] = useState<Library[]>([
    { id: 1, name: 'Peenar' },
    { id: 2, name: '123' },
    { id: 3, name: 'Peenar' },
    { id: 4, name: '123' },
    { id: 5, name: 'Peenar' },
    { id: 6, name: '123' },
    { id: 7, name: 'Peenar' },
    { id: 8, name: '123' },
    { id: 9, name: '123' },
  ]);

  const handleTabChange = (_: React.SyntheticEvent<Element, Event>, value: any) => setSelectedTab(value);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Tabs value={selectedTab} onChange={handleTabChange}>
        {LibraryTabs.map((el) => (
          <Tab value={el.value} label={el.label} />
        ))}
      </Tabs>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {libraries.map((el, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 8 }}>
            <div style={{ height: 128, width: 128, backgroundColor: 'red' }}>peenar image</div>
            <Typography>{el.name}</Typography>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LibraryGrid;
