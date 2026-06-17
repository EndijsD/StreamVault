import moment from 'moment'
import type { DBSong } from '../../shared-types/types'

export const formatDate = (value: string | Date) => {
  return moment(value).format('DD.MM.YYYY')
}

//https://bost.ocks.org/mike/shuffle/
export const shuffle = (array: DBSong[]) => {
  const deepCopy = [...array]
  const copy = []
  let n = array.length,
    i

  // While there remain elements to shuffle…
  while (n) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * deepCopy.length)

    // If not already shuffled, move it to the new array.
    if (i in deepCopy) {
      copy.push(deepCopy[i])
      delete deepCopy[i]
      n--
    }
  }

  return copy
}

// export const fileToBase64 = (file: File): Promise<string> =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader()
//     reader.onload = () => resolve(reader.result as string)
//     reader.onerror = reject
//     reader.readAsDataURL(file)
//   })
