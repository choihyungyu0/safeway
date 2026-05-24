import {
  Clock,
  ClipboardList,
  ShieldCheck,
  Star,
} from 'lucide-react'
import type {
  RecommendationLogFilter,
  RecommendationLogSummaryMetric,
} from '@/features/admin/recommendationLog.types'

export const recommendationLogPeriodOptions = [
  '2025.05.22 ~ 2025.06.21 (최근 30일)',
  '2025.06.15 ~ 2025.06.21 (최근 7일)',
  '2025.06.21 (오늘)',
] as const

export const recommendationLogUserTypeOptions = [
  '전체',
  '일반 성인',
  '고령자',
  '아동/청소년',
  '임산부',
  '장애인',
  '야외근로자',
] as const

export const recommendationLogRouteTypeOptions = [
  '전체',
  '세이프웨이',
  '대중교통 대체경로',
  '야간 안전경로',
] as const

export const recommendationLogStartPlaceOptions = [
  '전체',
  '정부세종청사 1동',
  '보람동 주민센터',
  '나성동 중앙상가',
  '세종특별자치시청',
] as const

export const recommendationLogDestinationOptions = [
  '전체',
  '세종특별자치시청',
  '세종호수공원',
  '세종예술의전당',
  '보람동 주민센터',
] as const

export const recommendationLogPageSizeOptions = [10, 20, 50] as const

export const defaultRecommendationLogFilter: RecommendationLogFilter = {
  period: recommendationLogPeriodOptions[0],
  userType: '전체',
  routeType: '전체',
  startPlace: '전체',
  destination: '전체',
  keyword: '',
}

export const recommendationLogSummaryMetrics: RecommendationLogSummaryMetric[] = [
  {
    id: 'total-recommendations',
    title: '총 추천 건수',
    value: '8,572건',
    comparison: '12.3%',
    trend: 'up',
    accent: 'blue',
    icon: ClipboardList,
  },
  {
    id: 'safeway-selection-rate',
    title: '세이프웨이 선택률',
    value: '68%',
    comparison: '3%p',
    trend: 'up',
    accent: 'teal',
    icon: ShieldCheck,
  },
  {
    id: 'average-safety-score',
    title: '평균 기후안전 점수',
    value: '84.7점',
    comparison: '2.1점',
    trend: 'up',
    accent: 'blue',
    icon: Star,
  },
  {
    id: 'average-duration',
    title: '평균 소요시간',
    value: '34분',
    comparison: '1분',
    trend: 'down',
    accent: 'orange',
    icon: Clock,
  },
]
