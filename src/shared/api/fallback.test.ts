import { describe, expect, it } from 'vitest'
import { ApiClientError } from '@/shared/api/errors'
import { withFixtureFallback } from '@/shared/api/fallback'

describe('withFixtureFallback', () => {
  it('returns API data when the request succeeds', async () => {
    await expect(
      withFixtureFallback(
        async () => 'api-data',
        () => 'fixture-data',
      ),
    ).resolves.toBe('api-data')
  })

  it('returns fixture data when the API is unavailable', async () => {
    await expect(
      withFixtureFallback(
        async () => {
          throw new ApiClientError('unavailable')
        },
        () => 'fixture-data',
      ),
    ).resolves.toBe('fixture-data')
  })

  it('rethrows validation or authorization errors', async () => {
    await expect(
      withFixtureFallback(
        async () => {
          throw new ApiClientError('bad request', { status: 400 })
        },
        () => 'fixture-data',
      ),
    ).rejects.toMatchObject({ status: 400 })
  })
})
