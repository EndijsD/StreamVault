import type { Errors } from './GeneralTypes'

export function validateEmpty<T extends object, K extends keyof T = keyof T>(form: T, requiredKeys?: K[]): Errors<T> {
  return (requiredKeys ?? (Object.keys(form) as K[])).reduce((errors, key) => {
    const value = typeof form[key] === 'string' ? form[key].trim() : form[key]

    if (!value) errors[key] = 'field_required'

    return errors
  }, {} as Errors<T>)
}

export const getBase64 = (file: File, onProgress?: (percent: number) => void): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('File is missing or invalid'))
      return
    }

    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onerror = (error) => reject(error)
    reader.onload = () => resolve(reader.result as string)
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100)
        onProgress?.(percent)
      }
    }
  })
}
