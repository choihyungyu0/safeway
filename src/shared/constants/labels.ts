import type {
  RecommendationType,
  RoutePreference,
  TransportMode,
} from '@/entities/route/types'
import type { UserType } from '@/entities/user/types'

export const userTypeLabels: Record<UserType, string> = {
  GENERAL: '일반 성인',
  SENIOR: '고령자',
  CHILD: '아동/청소년',
  PREGNANT: '임산부',
  DISABLED: '장애인',
  OUTDOOR_WORKER: '야외근로자',
}

export const userTypeDescriptions: Record<UserType, string> = {
  GENERAL: '기후위험과 이동 시간을 균형 있게 반영합니다.',
  SENIOR: '쉬어갈 수 있는 곳과 짧은 야외 보행을 더 중요하게 봅니다.',
  CHILD: '안전시설, 주요 도로 접근성, 대중교통 접근성을 더 반영합니다.',
  PREGNANT: '쉼터 접근과 야외 노출 부담을 줄이는 경로를 우선합니다.',
  DISABLED: '접근성, 환승 편의, 이동 부담을 더 세밀하게 반영합니다.',
  OUTDOOR_WORKER: '폭염과 한파 위험, 휴식 지점 접근성을 더 크게 봅니다.',
}

export const transportModeLabels: Record<TransportMode, string> = {
  WALK: '도보',
  BUS_BRT: '버스/BRT',
  BIKE: '자전거',
  MIXED: '복합 이동',
}

export const routePreferenceLabels: Record<RoutePreference, string> = {
  SAFE: '기후위험 낮음',
  COOL: '시원하고 안전한 길 우선',
  SHORTEST: '최단 시간',
  TRANSIT: '대중교통 연계',
  NIGHT_SAFE: '야간 안전',
}

export const recommendationTypeLabels: Record<RecommendationType, string> = {
  SAFEWAY: '세이프웨이',
  TRANSIT_ALTERNATIVE: '대중교통 대체경로',
  NIGHT_SAFE: '야간 안전경로',
  SHORTEST: '최단경로 비교',
}
