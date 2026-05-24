import { AlertTriangle, Building2, TrendingUp, Users } from 'lucide-react'
import type {
  TemporaryShelterFacilityType,
  TemporaryShelterFilter,
  TemporaryShelterPriority,
  TemporaryShelterRegion,
  TemporaryShelterSummaryMetric,
} from '@/features/admin/temporaryShelter.types'

export const temporaryShelterPeriod = '2025.05.22 ~ 2025.06.21 (최근 30일)'

export const temporaryShelterRegionOptions: TemporaryShelterRegion[] = [
  '전체',
  '나성동',
  '어진동',
  '보람동',
  '한솔동',
  '소담동',
]

export const temporaryShelterFacilityTypeOptions: TemporaryShelterFacilityType[] = [
  '전체',
  '공공청사',
  '청소년시설',
  '복합커뮤니티',
  '체육시설',
  '도서관',
]

export const temporaryShelterPriorityOptions: TemporaryShelterPriority[] = [
  '전체',
  '높음',
  '중간',
  '낮음',
]

export const defaultTemporaryShelterFilter: TemporaryShelterFilter = {
  period: temporaryShelterPeriod,
  region: '전체',
  facilityType: '전체',
  priority: '전체',
}

export const temporaryShelterSummaryMetrics: TemporaryShelterSummaryMetric[] = [
  {
    id: 'candidate-facilities',
    title: '후보 시설',
    value: '24개',
    accent: 'blue',
    icon: Building2,
  },
  {
    id: 'urgent-review',
    title: '즉시 검토 필요',
    value: '7개',
    accent: 'orange',
    icon: AlertTriangle,
  },
  {
    id: 'expected-beneficiaries',
    title: '예상 수혜 인구',
    value: '18,420명',
    accent: 'teal',
    icon: Users,
  },
  {
    id: 'accessibility-improvement',
    title: '평균 접근성 개선',
    value: '+21%',
    accent: 'green',
    icon: TrendingUp,
  },
]
