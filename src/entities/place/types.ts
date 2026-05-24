import type { LatLng } from '@/entities/route/types'

export type Place = {
  id: string
  name: string
  district: string
  category: 'GOVERNMENT' | 'PARK' | 'CIVIC' | 'NEIGHBORHOOD' | 'LANDMARK'
  location: LatLng
}
