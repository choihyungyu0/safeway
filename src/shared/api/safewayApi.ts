import type {
  DataCollectionStatus,
  ShelterGapArea,
  TemporaryShelterCandidate,
} from '@/entities/admin/types'
import type { CurrentClimate } from '@/entities/climate/types'
import type { Feedback } from '@/entities/feedback/types'
import type { Place } from '@/entities/place/types'
import type { RouteSearchParams, SafeRouteRecommendation } from '@/entities/route/types'
import type { Shelter } from '@/entities/shelter/types'
import type { UserType } from '@/entities/user/types'
import { calculateSafetyScore } from '@/features/recommendation/scoring'
import {
  mockDataCollectionStatuses,
  mockAdminDashboard,
  mockShelterGapAreas,
  mockTemporaryShelterCandidates,
} from '@/mocks/fixtures/admin'
import { mockCurrentClimate } from '@/mocks/fixtures/climate'
import { mockFeedback } from '@/mocks/fixtures/feedback'
import { mockPlaces } from '@/mocks/fixtures/places'
import { routeRecommendationTemplates } from '@/mocks/fixtures/routes'
import { mockShelters } from '@/mocks/fixtures/shelters'

const withMockLatency = <T,>(value: T) =>
  new Promise<T>((resolve) => {
    window.setTimeout(() => resolve(value), 80)
  })

export const getCurrentClimate = (): Promise<CurrentClimate> =>
  withMockLatency(mockCurrentClimate)

export const searchPlaces = (keyword: string): Promise<Place[]> => {
  const normalizedKeyword = keyword.trim().toLowerCase()
  const results = normalizedKeyword
    ? mockPlaces.filter(
        (place) =>
          place.name.toLowerCase().includes(normalizedKeyword) ||
          place.district.includes(keyword),
      )
    : mockPlaces

  return withMockLatency(results)
}

export const getShelters = (): Promise<Shelter[]> => withMockLatency(mockShelters)

export const getShelterById = (shelterId: string): Promise<Shelter | undefined> =>
  withMockLatency(mockShelters.find((shelter) => shelter.id === shelterId))

export const createRecommendations = ({
  userType,
}: {
  params: RouteSearchParams
  userType: UserType
}): Promise<SafeRouteRecommendation[]> => {
  const recommendations = routeRecommendationTemplates.map((template) => ({
    ...template,
    userType,
    climateSafetyScore: calculateSafetyScore(template.scoreBreakdown, userType),
  }))

  return withMockLatency(recommendations)
}

export const submitFeedback = (feedback: Feedback): Promise<Feedback> => {
  mockFeedback.push(feedback)
  return withMockLatency(feedback)
}

export const getAdminDashboard = () => withMockLatency(mockAdminDashboard)

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
