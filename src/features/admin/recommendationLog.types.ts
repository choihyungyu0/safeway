import type { LucideIcon } from 'lucide-react'

export type RecommendationLogFilter = {
  period: string
  userType: string
  routeType: string
  startPlace: string
  destination: string
  keyword: string
}

export type RecommendationLogSummaryMetric = {
  id: string
  title: string
  value: string
  comparison: string
  trend: 'up' | 'down'
  accent: 'blue' | 'teal' | 'orange'
  icon: LucideIcon
}

export type RecommendationRouteTypeRatio = {
  type: 'SAFEWAY' | 'TRANSIT_ALTERNATIVE' | 'NIGHT_SAFE'
  label: string
  percentage: number
  count: string
  color: 'blue' | 'teal' | 'orange'
}

export type RecommendationLogItem = {
  id: string
  recommendedAt: string
  userType: string
  startPlace: string
  destination: string
  transportMode: string
  routeType: '세이프웨이' | '대중교통 대체경로' | '야간 안전경로'
  durationMin: number
  climateSafetyScore: number
  exposureReductionPct: number
  selected: boolean
  reason: string
}

export type AbnormalPatternAlert = {
  id: string
  title: string
  severity: 'warning' | 'info' | 'danger'
  badge: string
  description: string
  affectedArea: string
  occurredAt: string
  color: 'orange' | 'blue' | 'red'
}
