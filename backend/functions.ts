export const getErrorMessage = (err: unknown) => {
  if (err instanceof Error) return err.message
  return String(err)
}

export const isStringNumeric = (value: unknown): boolean => {
  if (typeof value != 'string') return false
  return !isNaN(Number(value))
}
