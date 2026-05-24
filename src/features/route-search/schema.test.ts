import { describe, expect, it } from 'vitest'
import { routeSearchSchema } from '@/features/route-search/schema'

describe('routeSearchSchema', () => {
  it('rejects missing start and destination', () => {
    const result = routeSearchSchema.safeParse({
      startPlace: '',
      destination: '',
      departureAt: '2026-05-24T15:00',
      transportMode: 'WALK',
      preference: 'SAFE',
      lowVisibilitySafety: true,
    })

    expect(result.success).toBe(false)
  })
})
