import type { LibraryItem } from '../../../../shared-types/types'

export const addLibraryItem = (items: LibraryItem[], newItem: LibraryItem, parentId?: number | null): LibraryItem[] => {
  if (!parentId) {
    return [...items, newItem]
  }

  return items.map((item) => {
    if (item.type !== 'folder') {
      return item
    }

    if (item.id === parentId) {
      return {
        ...item,
        children: [...item.children, newItem],
      }
    }

    return {
      ...item,
      children: addLibraryItem(item.children, newItem, parentId),
    }
  })
}
