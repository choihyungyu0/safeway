import type { SafeRouteRecommendation } from '@/entities/route/types'
import { calculateSafetyScore } from '@/features/recommendation/scoring'
import { recommendationRouteOrder } from '@/features/recommendation/recommendation.constants'
import { routeRecommendationTemplates } from '@/mocks/fixtures/routes'

export const mockRecommendationResults: SafeRouteRecommendation[] =
  routeRecommendationTemplates
    .filter((template) => recommendationRouteOrder.includes(template.type))
    .map((template) => ({
      ...template,
      userType: 'GENERAL',
      climateSafetyScore: calculateSafetyScore(template.scoreBreakdown, 'GENERAL'),
    }))
