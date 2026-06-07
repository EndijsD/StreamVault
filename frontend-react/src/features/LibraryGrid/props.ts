import type { LibraryTab } from '../../pages/Library/props';

export type Library = {
  id: number;
  name: string;
  image: string | null;
  imageExt: string | null;
};

export type LibraryGridProps = {
  selectedTab: LibraryTab;
  setSelectedTab: (tab: LibraryTab) => void;
};
