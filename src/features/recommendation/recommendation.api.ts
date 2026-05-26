import type { RouteSearchParams, SafeRouteRecommendation } from '@/entities/route/types'
import type { UserType } from '@/entities/user/types'
import { calculateSafetyScore } from '@/features/recommendation/scoring'
import { mockRecommendationResults } from '@/mocks/fixtures/recommendations'
import { apiEndpoints, apiPost } from '@/shared/api/client'
import { withFixtureFallback } from '@/shared/api/fallback'

type BackendRouteRecommendation = {
  id: string
  route_name: string
  distance_km: number
  shelter_within_500m_count: number
  climate_safety_score: number
  final_safety_score: number
  reason: string
}

export function createRecommendations({
  params,
  userType,
}: {
  params: RouteSearchParams
  userType: UserType
}): Promise<SafeRouteRecommendation[]> {
  return withFixtureFallback(
    async () =>
      (await apiPost<BackendRouteRecommendation[]>(apiEndpoints.recommendations, {
        start_place: params.startPlace,
        destination: params.destination,
        user_type: userType,
        transport_mode: params.transportMode,
        preference: params.preference,
      })).map((route, index) => toRecommendation(route, userType, index)),
    () =>
      mockRecommendationResults.map((template) => ({
        ...template,
        userType,
        climateSafetyScore: calculateSafetyScore(template.scoreBreakdown, userType),
      })),
  )
}

function toRecommendation(
  route: BackendRouteRecommendation,
  userType: UserType,
  index: number,
): SafeRouteRecommendation {
  const template = mockRecommendationResults[index] ?? mockRecommendationResults[0]

  return {
    ...template,
    id: index === 0 ? template.id : route.id,
    title: index === 0 ? template.title : route.route_name,
    summary: route.reason,
    distanceMeters: Math.round(route.distance_km * 1000),
    shelterCount: route.shelter_within_500m_count,
    climateSafetyScore: Math.round(route.final_safety_score),
    userType,
    reason: route.reason,
  }
}
