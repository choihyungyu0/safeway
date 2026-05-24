import type {
  AdminRiskDisplayRange,
  AdminRiskFilter,
  AdminRiskType,
  AdminRiskUserType,
  RiskLevel,
} from '@/features/admin/climateRisk.types'

export const riskTypeLabels: Record<AdminRiskType, string> = {
  HEAT: '폭염',
  FINE_DUST: '미세먼지',
  FOG: '안개',
}

export const riskTypeOptions: AdminRiskType[] = ['HEAT', 'FINE_DUST', 'FOG']

export const userTypeOptions: AdminRiskUserType[] = [
  '일반 성인',
  '고령자',
  '아동/청소년',
  '임산부',
  '장애인',
  '야외근로자',
]

export const displayRangeOptions: AdminRiskDisplayRange[] = [
  '전체',
  '고위험 권역',
  '취약 보행축',
  '쉼터 사각지대',
]

export const defaultClimateRiskFilter: AdminRiskFilter = {
  riskType: 'HEAT',
  baseDateTime: '2025.06.21 14:00',
  userType: '일반 성인',
  displayRange: '전체',
}

export const riskLevelLabels: Record<RiskLevel, string> = {
  VERY_HIGH: '매우 높음',
  HIGH: '높음',
  MEDIUM: '보통',
  LOW: '낮음',
  VERY_LOW: '매우 낮음',
}
