import { isApiUnavailableError } from '@/shared/api/errors'

export async function withFixtureFallback<T>(
  request: () => Promise<T>,
  fallback: () => T | Promise<T>,
): Promise<T> {
  try {
    return await request()
  } catch (error) {
    if (isApiUnavailableError(error)) {
      return fallback()
    }

    throw error
  }
}
