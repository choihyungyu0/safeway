import type { UserType } from '@/entities/user/types'

export type SafewayShelterFacility =
  | '냉방'
  | '선풍기'
  | '야간개방'
  | '휴일개방'
  | '화장실'
  | '좌석'

export type SafewayShelter = {
  id: string
  name: string
  roadAddress: string
  lotAddress: string
  type: string
  area: number
  capacity: number
  operationStartDate: string
  operationEndDate: string
  fanCount: number
  airConditionerCount: number
  nightOpen: boolean
  holidayOpen: boolean
  stayAvailable: boolean
  managingAgency: string
  phone: string
  lat: number
  lng: number
  dataBaseDate: string
  capacityScore: number
  areaScore: number
  coolingScore: number
  nightOpenScore: number
  holidayOpenScore: number
  recommendationScore: number
  grade: string
  isOpen: boolean
  operationTime: string
  facilities: SafewayShelterFacility[]
}

export type SafewayClimateScenario = {
  name: string
  temperature: number
  humidity: number
  pm10: number
  pm25: number
  ozone: number
  visibilityKm: number
}

export type SafewayUserTypeWeight = {
  userTypeLabel: string
  userType: UserType
  climateSafetyWeight: number
  shelterAccessWeight: number
  nightSafetyWeight: number
  exposureTimeWeight: number
}

export type SafewayRouteRecommendation = {
  id: string
  scenario: string
  userTypeLabel: string
  userType: UserType
  routeId: string
  routeName: string
  distanceKm: number
  shelterWithin500mCount: number
  climateRiskScore: number
  climateSafetyScore: number
  shelterAccessScore: number
  nightSafetyScore: number
  exposureScore: number
  finalSafetyScore: number
}

export type SafewayScenarioSummary = {
  scenario: string
  recommendationCount: number
  averageFinalSafetyScore: number
  maxScore: number
  minScore: number
}

export type SafewayAnalysisSummary = {
  totalShelterCount: number
  nightOpenShelterCount: number
  holidayOpenShelterCount: number
  averageCapacity: number
  averageAirConditionerCount: number
  maxCapacity: number
  maxAirConditionerCount: number
  topFindings: string[]
  shortReportTextSnippets: string[]
  sourceFiles: string[]
}

export type SafewayImportMetadata = {
  sourceArchive: string
  sourceRoot: string
  sourceFiles: Record<string, string>
  rowCounts: Record<string, number>
  generatedCounts: Record<string, number>
}
