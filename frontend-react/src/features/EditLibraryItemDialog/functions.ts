import type { LibraryItem } from '../../../../shared-types/types'

export const updateLibraryItem = (
  items: LibraryItem[],
  id: number,
  type: LibraryItem['type'],
  updates: Pick<LibraryItem, 'name' | 'description' | 'image'>,
): LibraryItem[] => {
  return items.map((item) => {
    if (item.type === type && item.id === id) {
      return {
        ...item,
        ...updates,
      }
    }

    if (item.type === 'folder') {
      return {
        ...item,
        children: updateLibraryItem(item.children, id, type, updates),
      }
    }

    return item
  })
}
