import type { LucideIcon } from 'lucide-react'

export type AdminMetricAccent = 'blue' | 'teal' | 'orange'

export type AdminSummaryMetric = {
  id: string
  title: string
  value: string
  comparison: string
  trend: 'up' | 'down' | 'neutral'
  accent: AdminMetricAccent
  icon: LucideIcon
}

export type RiskArea = {
  rank: number
  district: string
  riskType: '폭염' | '미세먼지'
  riskIndex: number
  recommendationCount: string
  dailyChangePct: string
  trend: 'up' | 'down'
}

export type TimeRiskPoint = {
  time: string
  riskIndex: number
  recommendationCount: number
}

export type RiskTypeRatio = {
  type: '폭염' | '미세먼지' | '안개'
  percentage: number
  count: string
  color: 'orange' | 'teal' | 'blue'
}

export type AdminAlert = {
  id: string
  level: 'danger' | 'warning' | 'system' | 'success'
  title: string
  description: string
  time: string
  color: 'red' | 'orange' | 'blue' | 'teal'
  icon: LucideIcon
}

export type ClimateRiskMarker = {
  id: string
  district: string
  level: string
  tone: 'danger' | 'warning'
  className: string
}
