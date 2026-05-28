import { describe, expect, it } from 'vitest'
import { searchPlaces } from '@/shared/api/safewayApi'

describe('searchPlaces', () => {
  it('matches Sejong place candidates by name, address, district, and alias', async () => {
    await expect(searchPlaces('호수')).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining({ name: '세종호수공원' })]),
    )

    await expect(searchPlaces('보람로 77')).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining({ name: '도담동 주민센터' })]),
    )

    await expect(searchPlaces('시청')).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining({ name: '세종특별자치시청' })]),
    )
  })
})
