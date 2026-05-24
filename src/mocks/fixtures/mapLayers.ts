import type { LatLng } from '@/entities/route/types'

export type MapLayerKey =
  | 'climateRisk'
  | 'shelters'
  | 'busStops'
  | 'cctv'
  | 'streetlights'
  | 'riskSegments'

export type SafetyLayerPoint = {
  id: string
  label: string
  layer: MapLayerKey
  location: LatLng
}

export const mapLayerOptions: Array<{ key: MapLayerKey; label: string }> = [
  { key: 'climateRisk', label: '기후위험' },
  { key: 'shelters', label: '쉼터' },
  { key: 'busStops', label: '버스정류장' },
  { key: 'cctv', label: 'CCTV' },
  { key: 'streetlights', label: '가로등' },
  { key: 'riskSegments', label: '위험구간' },
]

export const mockSafetyLayerPoints: SafetyLayerPoint[] = [
  {
    id: 'risk-lake-sun',
    label: '호수공원 남측 직사광선 구간',
    layer: 'climateRisk',
    location: { lat: 36.4918, lng: 127.274 },
  },
  {
    id: 'bus-naseong',
    label: '나성동 BRT 정류장',
    layer: 'busStops',
    location: { lat: 36.4868, lng: 127.2571 },
  },
  {
    id: 'cctv-boram',
    label: '보람동 대로변 CCTV',
    layer: 'cctv',
    location: { lat: 36.4824, lng: 127.2863 },
  },
  {
    id: 'light-bridge',
    label: '금강보행교 진입부 가로등',
    layer: 'streetlights',
    location: { lat: 36.4842, lng: 127.2822 },
  },
  {
    id: 'risk-bridge-wind',
    label: '강변 저시정 주의 구간',
    layer: 'riskSegments',
    location: { lat: 36.4837, lng: 127.2836 },
  },
]
