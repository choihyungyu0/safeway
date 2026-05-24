import type { LucideIcon } from 'lucide-react'

export type AdminRiskType = 'HEAT' | 'FINE_DUST' | 'FOG'

export type AdminRiskFilter = {
  riskType: AdminRiskType
  baseDateTime: string
  userType: AdminRiskUserType
  displayRange: AdminRiskDisplayRange
}

export type AdminRiskUserType =
  | '일반 성인'
  | '고령자'
  | '아동/청소년'
  | '임산부'
  | '장애인'
  | '야외근로자'

export type AdminRiskDisplayRange = '전체' | '고위험 권역' | '취약 보행축' | '쉼터 사각지대'

export type RiskLevel = 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW' | 'VERY_LOW'

export type ClimateRiskArea = {
  id: string
  rank: number
  district: string
  riskLabel: '매우 높음' | '높음' | '보통'
  riskLevel: Extract<RiskLevel, 'VERY_HIGH' | 'HIGH' | 'MEDIUM'>
  riskIndex: number
  recommendationCount: string
  dailyChangePct: string
  trend: 'up' | 'down'
}

export type RiskSummaryStat = {
  id: string
  title: string
  value: string
  comparison: string
  trend: 'up' | 'down' | 'neutral'
  accent: 'blue' | 'teal' | 'orange'
  icon: LucideIcon
}

export type TimeRiskPoint = {
  time: string
  riskIndex: number
  recommendationCount: number
}

export type RiskRatioSegment = {
  label: '매우 높음' | '높음' | '보통' | '낮음'
  percentage: number
  count: string
  color: 'red' | 'orange' | 'yellow' | 'green'
}

export type MapDistrictLabel = {
  id: string
  label: string
  className: string
}

export type MapRiskLabel = {
  id: string
  district: string
  level: string
  tone: 'danger' | 'warning'
  className: string
}

export type MapHeatZone = {
  id: string
  className: string
}
