import type { LucideIcon } from 'lucide-react'

export type TemporaryShelterRegion =
  | '전체'
  | '나성동'
  | '어진동'
  | '보람동'
  | '한솔동'
  | '소담동'

export type TemporaryShelterFacilityType =
  | '전체'
  | '공공청사'
  | '청소년시설'
  | '복합커뮤니티'
  | '체육시설'
  | '도서관'
  | '관광안내시설'

export type TemporaryShelterPriority = '전체' | '높음' | '중간' | '낮음'

export type TemporaryShelterFilter = {
  period: string
  region: TemporaryShelterRegion
  facilityType: TemporaryShelterFacilityType
  priority: TemporaryShelterPriority
}

export type TemporaryShelterMetricAccent = 'blue' | 'orange' | 'teal' | 'green'

export type TemporaryShelterSummaryMetric = {
  id: string
  title: string
  value: string
  accent: TemporaryShelterMetricAccent
  icon: LucideIcon
}

export type TemporaryShelterStatus =
  | '검토중'
  | '현장확인 필요'
  | '승인대기'
  | '후보 확정'
  | '현장조사 요청'

export type TemporaryShelterRiskLevel = '높음' | '보통' | '낮음'

export type TemporaryShelterFacilityFlags = {
  coolingAvailable: boolean
  restroom: boolean
  waterDispenser: boolean
  aed: boolean
}

export type TemporaryShelterCandidate = {
  id: string
  rank: number
  name: string
  facilityType: Exclude<TemporaryShelterFacilityType, '전체'>
  benefitArea: string
  accessibilityScore: number
  status: TemporaryShelterStatus
  address: string
  operationTime: string
  capacity: string
  nearbyRiskLevel: TemporaryShelterRiskLevel
  accessibilityImprovementPct: string
  expectedAdditionalBeneficiaries: string
  memo: string
  priority: Exclude<TemporaryShelterPriority, '전체'>
  region: Exclude<TemporaryShelterRegion, '전체'>
  facilities: TemporaryShelterFacilityFlags
  mapPosition: {
    x: number
    y: number
    label?: string
  }
}
