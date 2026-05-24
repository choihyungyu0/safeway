import type { FeedbackFilter } from '@/features/admin/feedback.types'

export const defaultFeedbackFilter: FeedbackFilter = {
  period: '2025.05.22 ~ 2025.06.21 (최근 30일)',
  userType: '전체',
  routeType: '전체',
}

export const feedbackPeriodOptions = [
  defaultFeedbackFilter.period,
  '2025.06.15 ~ 2025.06.21 (최근 7일)',
  '2025.06.01 ~ 2025.06.21 (이번 달)',
] as const

export const feedbackUserTypeOptions = [
  '전체',
  '일반 성인',
  '고령자',
  '아동/청소년',
  '임산부',
  '장애인',
  '야외근로자',
] as const

export const feedbackRouteTypeOptions = [
  '전체',
  '추천 경로',
  '최단 경로',
  '안전 우선',
  '그늘 우선',
  '경사 완만',
] as const

export const feedbackPageSizeOptions = [10, 20, 50] as const
