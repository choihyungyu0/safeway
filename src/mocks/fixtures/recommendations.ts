import type { SafeRouteRecommendation } from '@/entities/route/types'
import { calculateSafetyScore } from '@/features/recommendation/scoring'
import { recommendationRouteOrder } from '@/features/recommendation/recommendation.constants'
import { safewayRouteRecommendations } from '@/mocks/fixtures/generated/safewayData'
import { routeRecommendationTemplates } from '@/mocks/fixtures/routes'

const generatedRouteInsight = safewayRouteRecommendations
  .filter((route) => route.userType === 'GENERAL')
  .sort((left, right) => right.finalSafetyScore - left.finalSafetyScore)[0]

export const mockRecommendationResults: SafeRouteRecommendation[] =
  routeRecommendationTemplates
    .filter((template) => recommendationRouteOrder.includes(template.type))
    .map((template) => ({
      ...template,
      userType: 'GENERAL',
      climateSafetyScore: calculateSafetyScore(template.scoreBreakdown, 'GENERAL'),
      reason: generatedRouteInsight
        ? `${template.reason} SafeWay 분석 데이터에서는 ${generatedRouteInsight.scenario} 기준 '${generatedRouteInsight.routeName}' 경로가 최종 기후안전 ${generatedRouteInsight.finalSafetyScore}점으로 확인되었습니다.`
        : template.reason,
      cautions: generatedRouteInsight
        ? [
            ...template.cautions,
            `500m 이내 쉼터 ${generatedRouteInsight.shelterWithin500mCount}개, 쉼터 접근성 ${generatedRouteInsight.shelterAccessScore}점을 함께 참고하세요.`,
          ]
        : template.cautions,
    }))
