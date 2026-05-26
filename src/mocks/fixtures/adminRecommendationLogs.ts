import type {
  AbnormalPatternAlert,
  RecommendationLogItem,
  RecommendationRouteTypeRatio,
} from '@/features/admin/recommendationLog.types'
import { safewayRouteRecommendations } from '@/mocks/fixtures/generated/safewayData'
import type { SafewayRouteRecommendation } from '@/mocks/fixtures/generated/safewayData.types'

export const recommendationRouteTypeRatios: RecommendationRouteTypeRatio[] = [
  {
    type: 'SAFEWAY',
    label: '세이프웨이',
    percentage: 68,
    count: '5,828건',
    color: 'blue',
  },
  {
    type: 'TRANSIT_ALTERNATIVE',
    label: '대중교통 대체경로',
    percentage: 19,
    count: '1,628건',
    color: 'teal',
  },
  {
    type: 'NIGHT_SAFE',
    label: '야간 안전경로',
    percentage: 13,
    count: '1,116건',
    color: 'orange',
  },
]

export const abnormalPatternAlerts: AbnormalPatternAlert[] = [
  {
    id: 'outdoor-worker-spike',
    title: '야외근로자 경로 요청 급증',
    severity: 'warning',
    badge: '주의',
    description: '최근 3일 간 야외근로자 사용자의 경로 요청이 28% 증가했습니다.',
    affectedArea: '보람동, 대평동, 한솔동 일대',
    occurredAt: '06.20 18:00 ~ 06.21 09:00',
    color: 'orange',
  },
  {
    id: 'night-safe-growth',
    title: '야간 안전경로 사용률 증가',
    severity: 'info',
    badge: '정보',
    description: '야간(20시~06시) 야간 안전경로 사용률이 23% 증가했습니다.',
    affectedArea: '나성동, 어진동, 반곡동 일대',
    occurredAt: '06.20 20:00 ~ 06.21 06:00',
    color: 'blue',
  },
  {
    id: 'boram-score-drop',
    title: '보람동 구간 점수 하락',
    severity: 'danger',
    badge: '경고',
    description: '보람동 일부 구간의 기후안전 점수가 평균 7.6점 하락했습니다.',
    affectedArea: '보람동 (보람로, 한누리대로 일대)',
    occurredAt: '06.20 00:00 ~ 06.21 09:00',
    color: 'red',
  },
]

const recommendationReason =
  '폭염 노출을 줄이고 쉼터 접근성이 높은 경로로 추천되었습니다.'

const demoRecommendationLogItems: RecommendationLogItem[] = [
  {
    id: 'log-20250621-0945',
    recommendedAt: '2025.06.21 09:45',
    userType: '일반 성인',
    startPlace: '정부세종청사 1동',
    destination: '세종특별자치시청',
    transportMode: '도보',
    routeType: '세이프웨이',
    durationMin: 32,
    climateSafetyScore: 92,
    exposureReductionPct: 62,
    selected: true,
    reason: recommendationReason,
  },
  {
    id: 'log-20250621-0832',
    recommendedAt: '2025.06.21 08:32',
    userType: '고령자',
    startPlace: '보람동 주민센터',
    destination: '세종호수공원',
    transportMode: '도보',
    routeType: '세이프웨이',
    durationMin: 28,
    climateSafetyScore: 88,
    exposureReductionPct: 58,
    selected: true,
    reason: recommendationReason,
  },
  {
    id: 'log-20250621-0758',
    recommendedAt: '2025.06.21 07:58',
    userType: '아동/청소년',
    startPlace: '나성동 중앙상가',
    destination: '세종예술의전당',
    transportMode: '도보',
    routeType: '세이프웨이',
    durationMin: 26,
    climateSafetyScore: 90,
    exposureReductionPct: 60,
    selected: true,
    reason: recommendationReason,
  },
  {
    id: 'log-20250621-0715',
    recommendedAt: '2025.06.21 07:15',
    userType: '임산부',
    startPlace: '정부세종청사 1동',
    destination: '보람동 주민센터',
    transportMode: '도보',
    routeType: '세이프웨이',
    durationMin: 35,
    climateSafetyScore: 85,
    exposureReductionPct: 55,
    selected: true,
    reason: recommendationReason,
  },
  {
    id: 'log-20250620-2247',
    recommendedAt: '2025.06.20 22:47',
    userType: '장애인',
    startPlace: '나성동 중앙상가',
    destination: '세종특별자치시청',
    transportMode: '도보',
    routeType: '세이프웨이',
    durationMin: 38,
    climateSafetyScore: 87,
    exposureReductionPct: 57,
    selected: true,
    reason: recommendationReason,
  },
  {
    id: 'log-20250620-2136',
    recommendedAt: '2025.06.20 21:36',
    userType: '야외근로자',
    startPlace: '보람동 주민센터',
    destination: '정부세종청사 1동',
    transportMode: '도보',
    routeType: '야간 안전경로',
    durationMin: 42,
    climateSafetyScore: 79,
    exposureReductionPct: 52,
    selected: true,
    reason: recommendationReason,
  },
  {
    id: 'log-20250620-1822',
    recommendedAt: '2025.06.20 18:22',
    userType: '일반 성인',
    startPlace: '세종특별자치시청',
    destination: '세종호수공원',
    transportMode: '도보',
    routeType: '세이프웨이',
    durationMin: 31,
    climateSafetyScore: 91,
    exposureReductionPct: 61,
    selected: true,
    reason: recommendationReason,
  },
  {
    id: 'log-20250620-1705',
    recommendedAt: '2025.06.20 17:05',
    userType: '고령자',
    startPlace: '나성동 중앙상가',
    destination: '보람동 주민센터',
    transportMode: '도보',
    routeType: '세이프웨이',
    durationMin: 29,
    climateSafetyScore: 86,
    exposureReductionPct: 57,
    selected: true,
    reason: recommendationReason,
  },
  {
    id: 'log-20250620-1233',
    recommendedAt: '2025.06.20 12:33',
    userType: '아동/청소년',
    startPlace: '정부세종청사 1동',
    destination: '세종예술의전당',
    transportMode: '도보',
    routeType: '세이프웨이',
    durationMin: 27,
    climateSafetyScore: 89,
    exposureReductionPct: 59,
    selected: true,
    reason: recommendationReason,
  },
  {
    id: 'log-20250620-0911',
    recommendedAt: '2025.06.20 09:11',
    userType: '임산부',
    startPlace: '보람동 주민센터',
    destination: '세종특별자치시청',
    transportMode: '도보',
    routeType: '세이프웨이',
    durationMin: 33,
    climateSafetyScore: 88,
    exposureReductionPct: 56,
    selected: true,
    reason: recommendationReason,
  },
]

const generatedRecommendationLogItems: RecommendationLogItem[] = safewayRouteRecommendations.map(
  (route, index) => toRecommendationLogItem(route, index),
)

export const recommendationLogItems: RecommendationLogItem[] = [
  ...demoRecommendationLogItems,
  ...generatedRecommendationLogItems,
]

function toRecommendationLogItem(
  route: SafewayRouteRecommendation,
  index: number,
): RecommendationLogItem {
  const [startPlace = route.routeName, destination = '세종시 목적지'] =
    route.routeName.split(' → ')
  const recommendedHour = 14 - (index % 8)
  const recommendedMinute = (index * 7) % 60

  return {
    id: `generated-${route.id}`,
    recommendedAt: `2025.06.${String(21 - Math.floor(index / 18)).padStart(2, '0')} ${String(
      recommendedHour,
    ).padStart(2, '0')}:${String(recommendedMinute).padStart(2, '0')}`,
    userType: getUserTypeLabel(route.userTypeLabel),
    startPlace,
    destination,
    transportMode: '도보',
    routeType: getRouteType(route),
    durationMin: Math.round(20 + route.distanceKm * 4 + (100 - route.finalSafetyScore) / 4),
    climateSafetyScore: Math.round(route.finalSafetyScore),
    exposureReductionPct: Math.max(30, Math.min(72, Math.round(route.exposureScore))),
    selected: index % 5 !== 0,
    reason: `${route.scenario} 시나리오에서 쉼터 ${route.shelterWithin500mCount}개 접근성과 야간안전 ${route.nightSafetyScore}점을 반영한 추천입니다.`,
  }
}

function getUserTypeLabel(label: string) {
  return label === '일반' ? '일반 성인' : label
}

function getRouteType(route: SafewayRouteRecommendation): RecommendationLogItem['routeType'] {
  if (route.scenario.includes('안개')) {
    return '야간 안전경로'
  }

  if (route.shelterWithin500mCount <= 2) {
    return '대중교통 대체경로'
  }

  return '세이프웨이'
}
