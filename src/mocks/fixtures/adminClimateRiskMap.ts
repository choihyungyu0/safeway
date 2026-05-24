import { AlertTriangle, Footprints, ShieldCheck } from 'lucide-react'
import type {
  ClimateRiskArea,
  MapDistrictLabel,
  MapHeatZone,
  MapRiskLabel,
  RiskRatioSegment,
  RiskSummaryStat,
  TimeRiskPoint,
} from '@/features/admin/climateRisk.types'

export const climateRiskSummaryStats: RiskSummaryStat[] = [
  {
    id: 'average-risk-index',
    title: '평균 위험지수',
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
    icon: AlertTriangle,
  },
  {
    id: 'vulnerable-walking-axis',
    title: '취약 보행축',
    value: '5개',
    comparison: '전일 대비 ↓ 1개',
    trend: 'down',
    accent: 'blue',
    icon: Footprints,
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

export const riskRatioSegments: RiskRatioSegment[] = [
  { label: '매우 높음', percentage: 32, count: '1,124건', color: 'red' },
  { label: '높음', percentage: 36, count: '1,266건', color: 'orange' },
  { label: '보통', percentage: 22, count: '774건', color: 'yellow' },
  { label: '낮음', percentage: 10, count: '350건', color: 'green' },
]

export const climateRiskAreas: ClimateRiskArea[] = [
  {
    id: 'naseong',
    rank: 1,
    district: '나성동',
    riskLabel: '매우 높음',
    riskLevel: 'VERY_HIGH',
    riskIndex: 94,
    recommendationCount: '326건',
    dailyChangePct: '18%',
    trend: 'up',
  },
  {
    id: 'eojin',
    rank: 2,
    district: '어진동',
    riskLabel: '높음',
    riskLevel: 'HIGH',
    riskIndex: 88,
    recommendationCount: '274건',
    dailyChangePct: '12%',
    trend: 'up',
  },
  {
    id: 'hansol',
    rank: 3,
    district: '한솔동',
    riskLabel: '높음',
    riskLevel: 'HIGH',
    riskIndex: 73,
    recommendationCount: '198건',
    dailyChangePct: '8%',
    trend: 'up',
  },
  {
    id: 'boram',
    rank: 4,
    district: '보람동',
    riskLabel: '보통',
    riskLevel: 'MEDIUM',
    riskIndex: 69,
    recommendationCount: '186건',
    dailyChangePct: '5%',
    trend: 'up',
  },
  {
    id: 'sodam',
    rank: 5,
    district: '소담동',
    riskLabel: '보통',
    riskLevel: 'MEDIUM',
    riskIndex: 61,
    recommendationCount: '142건',
    dailyChangePct: '3%',
    trend: 'down',
  },
]

export const mapDistrictLabels: MapDistrictLabel[] = [
  { id: 'eojin', label: '어진동', className: 'districtEojin' },
  { id: 'naseong', label: '나성동', className: 'districtNaseong' },
  { id: 'boram', label: '보람동', className: 'districtBoram' },
  { id: 'sodam', label: '소담동', className: 'districtSodam' },
  { id: 'dodam', label: '도담동', className: 'districtDodam' },
  { id: 'hansol', label: '한솔동', className: 'districtHansol' },
  { id: 'daepyeong', label: '대평동', className: 'districtDaepyeong' },
  { id: 'lake', label: '세종호수공원', className: 'districtLake' },
  { id: 'complex', label: '정부세종청사', className: 'districtComplex' },
]

export const mapRiskLabels: MapRiskLabel[] = [
  {
    id: 'eojin-risk',
    district: '어진동',
    level: '위험 높음',
    tone: 'danger',
    className: 'riskEojin',
  },
  {
    id: 'naseong-risk',
    district: '나성동',
    level: '위험 매우 높음',
    tone: 'danger',
    className: 'riskNaseong',
  },
  {
    id: 'boram-risk',
    district: '보람동',
    level: '위험 보통',
    tone: 'warning',
    className: 'riskBoram',
  },
]

export const mapHeatZones: MapHeatZone[] = [
  { id: 'eojin-heat', className: 'heatEojin' },
  { id: 'naseong-heat', className: 'heatNaseong' },
  { id: 'boram-heat', className: 'heatBoram' },
  { id: 'sodam-heat', className: 'heatSodam' },
]
