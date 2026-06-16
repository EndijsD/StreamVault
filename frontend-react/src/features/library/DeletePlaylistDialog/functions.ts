import type { LibraryItem } from '../../../../../shared-types/types'

export const removeLibraryItem = (items: LibraryItem[], id: number, type: LibraryItem['type']): LibraryItem[] => {
  return items
    .filter((item) => !(item.id === id && item.type === type))
    .map((item) => {
      if (item.type !== 'folder') {
        return item
      }

      return {
        ...item,
        children: removeLibraryItem(item.children, id, type),
      }
    })
}
