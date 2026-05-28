import type { LatLng } from '@/entities/route/types'

export type Place = {
  id: string
  name: string
  district: string
  category:
    | 'GOVERNMENT'
    | 'PARK'
    | 'CIVIC'
    | 'NEIGHBORHOOD'
    | 'LANDMARK'
    | 'TRANSIT'
    | 'COMMUNITY'
    | 'CULTURE'
    | 'LIBRARY'
  roadAddress: string
  lotAddress?: string
  description: string
  aliases: string[]
  location: LatLng
}
