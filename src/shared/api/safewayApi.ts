import type {
  DataCollectionStatus,
  ShelterGapArea,
  TemporaryShelterCandidate,
} from '@/entities/admin/types'
import type { Place } from '@/entities/place/types'
import type { RouteSearchParams } from '@/entities/route/types'
import type { UserType } from '@/entities/user/types'
import { getAdminDashboard } from '@/features/admin/adminDashboard.api'
import { getCurrentClimate } from '@/features/climate/climate.api'
import { submitFeedback } from '@/features/feedback/feedback.api'
import { createRecommendations } from '@/features/recommendation/recommendation.api'
import { getShelterById, getShelters } from '@/features/shelter/shelter.api'
import {
  mockDataCollectionStatuses,
  mockShelterGapAreas,
  mockTemporaryShelterCandidates,
} from '@/mocks/fixtures/admin'
import { mockPlaces } from '@/mocks/fixtures/places'

const withMockLatency = <T,>(value: T) =>
  new Promise<T>((resolve) => {
    window.setTimeout(() => resolve(value), 80)
  })

export const searchPlaces = (keyword: string): Promise<Place[]> => {
  const normalizedKeyword = normalizePlaceSearchText(keyword)
  const results = normalizedKeyword
    ? mockPlaces.filter((place) =>
        [
          place.name,
          place.district,
          place.roadAddress,
          place.lotAddress,
          place.description,
          ...place.aliases,
        ]
          .filter(Boolean)
          .some((value) =>
            normalizePlaceSearchText(String(value)).includes(normalizedKeyword),
          ),
      )
    : mockPlaces

  return withMockLatency(results)
}

function normalizePlaceSearchText(value: string) {
  return value.trim().toLocaleLowerCase('ko-KR').replace(/\s+/g, '')
}

export const getShelterGaps = (): Promise<{
  gaps: ShelterGapArea[]
  candidates: TemporaryShelterCandidate[]
}> =>
  withMockLatency({
    gaps: mockShelterGapAreas,
    candidates: mockTemporaryShelterCandidates,
  })

export const getDataStatus = (): Promise<DataCollectionStatus[]> =>
  withMockLatency(mockDataCollectionStatuses)

export {
  createRecommendations,
  getAdminDashboard,
  getCurrentClimate,
  getShelterById,
  getShelters,
  submitFeedback,
}

export type RecommendationRequest = {
  params: RouteSearchParams
  userType: UserType
}
