import type { LibraryTab } from '../../pages/Library/props';

export type Library = {
  id: number;
  name: string;
};

export type LibraryGridProps = {
  selectedTab: LibraryTab;
  setSelectedTab: (tab: LibraryTab) => void;
};
