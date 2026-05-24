import type { LatLng } from '@/entities/route/types'

export type ShelterFacility = {
  cooling: boolean
  seating: boolean
  water: boolean
  restroom: boolean
  wifi: boolean
  aed: boolean
}

export type Shelter = {
  id: string
  name: string
  type: 'COOLING_CENTER' | 'PUBLIC_FACILITY' | 'TRANSIT_SHELTER' | 'PARK_REST'
  status: 'OPEN' | 'LIMITED' | 'CLOSED'
  address: string
  operationTime: string
  capacity: number
  distanceFromRouteMeters: number
  location: LatLng
  facilities: ShelterFacility
}
