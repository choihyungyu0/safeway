import {
  AlertTriangle,
  Building2,
  Check,
  Info,
  ShieldCheck,
  TriangleAlert,
  UserCheck,
} from 'lucide-react'
import type {
  AdminAlert,
  AdminSummaryMetric,
  ClimateRiskMarker,
  RiskArea,
  RiskTypeRatio,
  TimeRiskPoint,
} from '@/features/admin/admin.types'

export const adminSummaryMetrics: AdminSummaryMetric[] = [
  {
    id: 'recommendations-today',
    title: '오늘 추천건수',
    value: '1,284건',
    comparison: '전일 대비 ↑ 12.4%',
    trend: 'up',
    accent: 'blue',
    icon: UserCheck,
  },
  {
    id: 'average-climate-score',
    title: '평균 기후안전 점수',
    value: '86점',
    comparison: '전일 대비 ↑ 3점',
    trend: 'up',
    accent: 'teal',
    icon: ShieldCheck,
  },
  {
    id: 'high-risk-areas',
    title: '고위험 권역',
    value: '4개',
    comparison: '전일 대비 -',
    trend: 'neutral',
    accent: 'orange',
    icon: TriangleAlert,
  },
  {
    id: 'active-shelters',
    title: '운영 중 쉼터',
    value: '128개',
    comparison: '총 쉼터 143개',
    trend: 'neutral',
    accent: 'teal',
    icon: Building2,
  },
]

export const climateRiskMarkers: ClimateRiskMarker[] = [
  {
    id: 'marker-eojin',
    district: '어진동',
    level: '위험도 높음',
    tone: 'danger',
    className: 'markerEojin',
  },
  {
    id: 'marker-naseong',
    district: '나성동',
    level: '위험도 매우 높음',
    tone: 'danger',
    className: 'markerNaseong',
  },
  {
    id: 'marker-hansol',
    district: '한솔동',
    level: '위험도 높음',
    tone: 'danger',
    className: 'markerHansol',
  },
  {
    id: 'marker-boram',
    district: '보람동',
    level: '위험도 중간',
    tone: 'warning',
    className: 'markerBoram',
  },
]

export const timeRiskPoints: TimeRiskPoint[] = [
  { time: '00시', riskIndex: 45, recommendationCount: 240 },
  { time: '03시', riskIndex: 52, recommendationCount: 360 },
  { time: '06시', riskIndex: 68, recommendationCount: 520 },
  { time: '09시', riskIndex: 82, recommendationCount: 720 },
  { time: '12시', riskIndex: 94, recommendationCount: 860 },
  { time: '15시', riskIndex: 88, recommendationCount: 740 },
  { time: '18시', riskIndex: 72, recommendationCount: 620 },
  { time: '21시', riskIndex: 56, recommendationCount: 430 },
]

export const riskTypeRatios: RiskTypeRatio[] = [
  { type: '폭염', percentage: 58, count: '1,124건', color: 'orange' },
  { type: '미세먼지', percentage: 27, count: '521건', color: 'teal' },
  { type: '안개', percentage: 15, count: '289건', color: 'blue' },
]

export const topRiskAreas: RiskArea[] = [
  {
    rank: 1,
    district: '나성동',
    riskType: '폭염',
    riskIndex: 94,
    recommendationCount: '326건',
    dailyChangePct: '18%',
    trend: 'up',
  },
  {
    rank: 2,
    district: '어진동',
    riskType: '폭염',
    riskIndex: 88,
    recommendationCount: '274건',
    dailyChangePct: '12%',
    trend: 'up',
  },
  {
    rank: 3,
    district: '한솔동',
    riskType: '폭염',
    riskIndex: 73,
    recommendationCount: '198건',
    dailyChangePct: '8%',
    trend: 'up',
  },
  {
    rank: 4,
    district: '보람동',
    riskType: '미세먼지',
    riskIndex: 69,
    recommendationCount: '186건',
    dailyChangePct: '5%',
    trend: 'up',
  },
  {
    rank: 5,
    district: '소담동',
    riskType: '폭염',
    riskIndex: 61,
    recommendationCount: '142건',
    dailyChangePct: '3%',
    trend: 'down',
  },
]

export const adminAlerts: AdminAlert[] = [
  {
    id: 'risk-level-up',
    level: 'danger',
    title: '위험 단계 상승',
    description: '나성동 폭염 위험 단계가 ‘높음’으로 상향되었습니다.',
    time: '2025.06.21 13:50',
    color: 'red',
    icon: AlertTriangle,
  },
  {
    id: 'shelter-added',
    level: 'warning',
    title: '쉼터 운영 알림',
    description: '나성동 복합커뮤니티센터가 쉼터로 등록되었습니다.',
    time: '2025.06.21 11:32',
    color: 'orange',
    icon: Info,
  },
  {
    id: 'data-refreshed',
    level: 'system',
    title: '데이터 갱신 완료',
    description: '기상청·환경부 데이터가 갱신되었습니다.',
    time: '2025.06.21 10:10',
    color: 'blue',
    icon: ShieldCheck,
  },
  {
    id: 'recommendation-ready',
    level: 'success',
    title: '추천 완료',
    description: '오늘의 AI 추천 경로가 생성 및 배포되었습니다.',
    time: '2025.06.21 09:00',
    color: 'teal',
    icon: Check,
  },
]
