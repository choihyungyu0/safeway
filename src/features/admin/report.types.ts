import type { LucideIcon } from 'lucide-react'

export type ReportFilter = {
  period: string
  region: string
  riskType: string
  userType: string
  reportType: string
}

export type ReportAccent = 'blue' | 'teal' | 'green' | 'orange' | 'red'

export type ReportMetric = {
  id: string
  title: string
  value: string
  comparison: string
  accent: ReportAccent
  icon: LucideIcon
}

export type ReportPreviewPage = {
  page: number
  title: string
  thumbnailLabel: string
}

export type ReportChapter = {
  number: string
  title: string
  description: string
  completed: boolean
}

export type ReportSummaryKeyword = {
  keyword: string
  count: number
}

export type ShelterPriorityItem = {
  rank: number
  area: string
  score: number
}

export type PolicyProposal = {
  title: string
  emphasis: string
  description: string
}
