import axios from 'axios'

export class ApiClientError extends Error {
  status?: number
  cause: unknown

  constructor(message: string, options: { status?: number; cause?: unknown } = {}) {
    super(message)
    this.name = 'ApiClientError'
    this.status = options.status
    this.cause = options.cause
  }
}

export function toApiClientError(error: unknown): ApiClientError {
  if (error instanceof ApiClientError) {
    return error
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const message =
      status === undefined
        ? 'API server is unavailable'
        : `API request failed with status ${status}`

    return new ApiClientError(message, { status, cause: error })
  }

  return new ApiClientError('API request failed', { cause: error })
}

export function isApiUnavailableError(error: unknown): boolean {
  const apiError = toApiClientError(error)

  return apiError.status === undefined || apiError.status >= 500 || apiError.status === 404
}
