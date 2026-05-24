import { userTypes, type UserTypeOption } from '@/entities/user/types'
import { userTypeLabels } from '@/shared/constants/labels'

export type UserTypeTheme = 'blue' | 'purple' | 'green' | 'pink' | 'orange' | 'teal'

export type UserTypeSelectionOption = UserTypeOption & {
  iconSrc: string
  iconAlt: string
  theme: UserTypeTheme
  fallbackGlyph: string
}

const optionMeta: Record<
  UserTypeSelectionOption['type'],
  Omit<UserTypeSelectionOption, 'type' | 'label'>
> = {
  GENERAL: {
    description: '일반 성인을 위한 기본 안전 경로를 추천합니다.',
    iconSrc: '/assets/user-type/icon-general.png',
    iconAlt: '일반 성인 사용자 아이콘',
    theme: 'blue',
    fallbackGlyph: '일',
  },
  SENIOR: {
    description: '보행 부담이 낮고 쉬어갈 수 있는 곳을 우선합니다.',
    iconSrc: '/assets/user-type/icon-senior.png',
    iconAlt: '고령자 사용자 아이콘',
    theme: 'purple',
    fallbackGlyph: '고',
  },
  CHILD: {
    description: '안전시설과 주요 도로 접근성을 더 크게 반영합니다.',
    iconSrc: '/assets/user-type/icon-child.png',
    iconAlt: '아동 및 청소년 사용자 아이콘',
    theme: 'green',
    fallbackGlyph: '아',
  },
  PREGNANT: {
    description: '야외 노출과 이동 부담을 줄이는 경로를 추천합니다.',
    iconSrc: '/assets/user-type/icon-pregnant.png',
    iconAlt: '임산부 사용자 아이콘',
    theme: 'pink',
    fallbackGlyph: '임',
  },
  DISABLED: {
    description: '접근성과 환승 편의를 고려한 경로를 추천합니다.',
    iconSrc: '/assets/user-type/icon-disabled.png',
    iconAlt: '장애인 사용자 아이콘',
    theme: 'orange',
    fallbackGlyph: '장',
  },
  OUTDOOR_WORKER: {
    description: '폭염 취약 구간을 피하고 휴식 지점을 더 많이 반영합니다.',
    iconSrc: '/assets/user-type/icon-outdoor-worker.png',
    iconAlt: '야외근로자 사용자 아이콘',
    theme: 'teal',
    fallbackGlyph: '야',
  },
}

export const userTypeOptions: UserTypeSelectionOption[] = userTypes.map((type) => ({
  type,
  label: userTypeLabels[type],
  ...optionMeta[type],
}))
