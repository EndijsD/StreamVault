import type { Errors } from './GeneralTypes'

export function validateEmpty<T extends object, K extends keyof T = keyof T>(form: T, requiredKeys?: K[]): Errors<T> {
  return (requiredKeys ?? (Object.keys(form) as K[])).reduce((errors, key) => {
    const value = typeof form[key] === 'string' ? form[key].trim() : form[key]

    if (!value) errors[key] = 'field_required'

    return errors
  }, {} as Errors<T>)
}
