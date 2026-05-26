import safewayAnalysisSummaryJson from '@/mocks/fixtures/generated/safewayAnalysisSummary.json'
import safewayClimateScenariosJson from '@/mocks/fixtures/generated/safewayClimateScenarios.json'
import safewayImportMetadataJson from '@/mocks/fixtures/generated/safewayImportMetadata.json'
import safewayRouteRecommendationsJson from '@/mocks/fixtures/generated/safewayRouteRecommendations.json'
import safewayScenarioSummaryJson from '@/mocks/fixtures/generated/safewayScenarioSummary.json'
import safewaySheltersJson from '@/mocks/fixtures/generated/safewayShelters.json'
import safewayUserTypeWeightsJson from '@/mocks/fixtures/generated/safewayUserTypeWeights.json'
import type {
  SafewayAnalysisSummary,
  SafewayClimateScenario,
  SafewayImportMetadata,
  SafewayRouteRecommendation,
  SafewayScenarioSummary,
  SafewayShelter,
  SafewayUserTypeWeight,
} from '@/mocks/fixtures/generated/safewayData.types'

export const safewayShelters = safewaySheltersJson as SafewayShelter[]
export const safewayClimateScenarios =
  safewayClimateScenariosJson as SafewayClimateScenario[]
export const safewayUserTypeWeights =
  safewayUserTypeWeightsJson as SafewayUserTypeWeight[]
export const safewayRouteRecommendations =
  safewayRouteRecommendationsJson as SafewayRouteRecommendation[]
export const safewayScenarioSummary =
  safewayScenarioSummaryJson as SafewayScenarioSummary[]
export const safewayAnalysisSummary =
  safewayAnalysisSummaryJson as SafewayAnalysisSummary
export const safewayImportMetadata =
  safewayImportMetadataJson as SafewayImportMetadata

export const topSafewayShelters = [...safewayShelters].sort(
  (left, right) => right.recommendationScore - left.recommendationScore,
)

export const bestSafewayRouteRecommendation = [...safewayRouteRecommendations].sort(
  (left, right) => right.finalSafetyScore - left.finalSafetyScore,
)[0]

export const safestSafewayScenario = [...safewayScenarioSummary].sort(
  (left, right) => right.averageFinalSafetyScore - left.averageFinalSafetyScore,
)[0]
