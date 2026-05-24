import type { LatLng } from '@/entities/route/types'

export const futureMapLayerTypes = [
  'SHELTER',
  'BUS_STOP',
  'CCTV',
  'STREET_LIGHT',
  'RISK_ZONE',
] as const

export type FutureMapLayerType = (typeof futureMapLayerTypes)[number]

export type FutureMapLayerPoint = {
  id: string
  type: FutureMapLayerType
  label: string
  location: LatLng
}
