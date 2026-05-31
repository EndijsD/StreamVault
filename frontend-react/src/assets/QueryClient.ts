import { QueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

const retry = (failureCount: number, error: unknown) => {
  console.log(`Retry attempt #${failureCount} failed`, error)

  const err = error as AxiosError

  const isRetryable = err.status === 401 || (err?.status ?? 0) >= 500 || err.code === 'ERR_NETWORK'

  return isRetryable ? failureCount < 30 : failureCount < 1
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry,
    },
  },
})
