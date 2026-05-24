import type {
  ShelterGapAnalysisRadius,
  ShelterGapBaseTime,
  ShelterGapFilter,
  ShelterGapRiskType,
  ShelterGapUserType,
} from '@/features/admin/shelterGap.types'

export const shelterGapRiskTypeLabels: Record<ShelterGapRiskType, string> = {
  HEAT: '폭염',
  FINE_DUST: '미세먼지',
  FOG: '안개',
  COLD_WAVE: '한파',
}

export const shelterGapUserTypeLabels: Record<ShelterGapUserType, string> = {
  GENERAL: '일반 성인',
  SENIOR: '고령자',
  CHILD: '아동/청소년',
  PREGNANT: '임산부',
  DISABLED: '장애인',
  OUTDOOR_WORKER: '야외근로자',
}

export const shelterGapRiskTypeOptions: ShelterGapRiskType[] = [
  'HEAT',
  'FINE_DUST',
  'FOG',
  'COLD_WAVE',
]

export const shelterGapUserTypeOptions: ShelterGapUserType[] = [
  'GENERAL',
  'SENIOR',
  'CHILD',
  'PREGNANT',
  'DISABLED',
  'OUTDOOR_WORKER',
]

export const shelterGapAnalysisRadiusOptions: ShelterGapAnalysisRadius[] = [
  '300m',
  '500m',
  '700m',
  '1km',
]

export const shelterGapBaseTimeOptions: ShelterGapBaseTime[] = [
  '09:00',
  '12:00',
  '14:00',
  '18:00',
  '21:00',
]

export const defaultShelterGapFilter: ShelterGapFilter = {
  riskType: 'HEAT',
  userType: 'GENERAL',
  analysisRadius: '500m',
  baseTime: '14:00',
  baseDateTime: '2025.06.21 (토) 14:00',
}
