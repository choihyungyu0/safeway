import { describe, expect, it } from 'vitest'
import {
  safewayClimateScenarios,
  safewayImportMetadata,
  safewayRouteRecommendations,
  safewayShelters,
  safewayUserTypeWeights,
} from '@/mocks/fixtures/generated/safewayData'
import { mockShelters } from '@/mocks/fixtures/shelters'

describe('generated SafeWay data fixtures', () => {
  it('includes shelter records with location and scoring fields', () => {
    expect(safewayShelters).toHaveLength(500)

    const [shelter] = safewayShelters

    expect(shelter.name).toBeTruthy()
    expect(shelter.lat).toEqual(expect.any(Number))
    expect(shelter.lng).toEqual(expect.any(Number))
    expect(shelter.capacity).toEqual(expect.any(Number))
    expect(shelter.recommendationScore).toEqual(expect.any(Number))
  })

  it('keeps the original demo shelter and adds generated shelter IDs', () => {
    expect(mockShelters.some((shelter) => shelter.id === 'shelter-001')).toBe(true)
    expect(mockShelters.some((shelter) => shelter.id === 'safeway-shelter-001')).toBe(true)
  })

  it('includes climate scenario measurements used by the UI', () => {
    expect(safewayClimateScenarios).toHaveLength(3)

    const [scenario] = safewayClimateScenarios

    expect(scenario.temperature).toEqual(expect.any(Number))
    expect(scenario.pm10).toEqual(expect.any(Number))
    expect(scenario.pm25).toEqual(expect.any(Number))
    expect(scenario.visibilityKm).toEqual(expect.any(Number))
  })

  it('maps user type weights to app user type codes', () => {
    expect(safewayUserTypeWeights).toHaveLength(6)
    expect(safewayUserTypeWeights.some((weight) => weight.userType === 'GENERAL')).toBe(true)
  })

  it('includes route recommendations with final safety scores', () => {
    expect(safewayRouteRecommendations).toHaveLength(54)

    const [route] = safewayRouteRecommendations

    expect(route.routeName).toBeTruthy()
    expect(route.finalSafetyScore).toEqual(expect.any(Number))
  })

  it('records deterministic import metadata for traceability', () => {
    expect(safewayImportMetadata.sourceArchive).toBe('external-data/SafeWay.zip')
    expect(safewayImportMetadata.rowCounts.shelters).toBe(500)
    expect(safewayImportMetadata.rowCounts.routeRecommendations).toBe(54)
    expect(safewayImportMetadata.generatedCounts.userTypeWeights).toBe(6)
  })
})
