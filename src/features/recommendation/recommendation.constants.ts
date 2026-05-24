import type { RecommendationType } from '@/entities/route/types'

export const recommendationRouteOrder: RecommendationType[] = [
  'SAFEWAY',
  'TRANSIT_ALTERNATIVE',
  'NIGHT_SAFE',
]

export const scoreCriteria = [
  '기온 및 체감온도',
  '미세먼지와 대기질',
  '안개 및 시정거리',
  '그늘과 녹지 접근성',
  '쉼터 접근성',
  '보행 안전성',
  '야간 안전성',
]
