import type { Shelter, ShelterFacility } from '@/entities/shelter/types'
import { mockShelters } from '@/mocks/fixtures/shelters'
import { apiEndpoints, apiGet } from '@/shared/api/client'
import { withFixtureFallback } from '@/shared/api/fallback'

type BackendShelter = {
  id: string
  name: string
  road_address: string
  lot_address: string
  type: string
  capacity: number
  operation_time: string
  night_open: boolean
  holiday_open: boolean
  recommendation_score: number
  grade: string
  location: { lat: number; lng: number }
  facilities: string[]
}

export function getShelters(): Promise<Shelter[]> {
  return withFixtureFallback(
    async () => (await apiGet<BackendShelter[]>(apiEndpoints.shelters)).map(toShelter),
    () => mockShelters,
  )
}

export function getShelterById(shelterId: string): Promise<Shelter | undefined> {
  return withFixtureFallback(
    async () => toShelter(await apiGet<BackendShelter>(`${apiEndpoints.shelters}/${shelterId}`)),
    () => mockShelters.find((shelter) => shelter.id === shelterId),
  )
}

export function getNearbyShelters(limit = 10): Promise<Shelter[]> {
  return withFixtureFallback(
    async () =>
      (await apiGet<BackendShelter[]>(apiEndpoints.nearbyShelters, { limit })).map(toShelter),
    () => mockShelters.slice(0, limit),
  )
}

function toShelter(shelter: BackendShelter): Shelter {
  return {
    id: shelter.id,
    name: shelter.name,
    type: getShelterType(shelter.type),
    status: 'OPEN',
    address: shelter.road_address || shelter.lot_address,
    operationTime: shelter.operation_time,
    capacity: shelter.capacity,
    distanceFromRouteMeters: 300,
    walkingTimeMin: 4,
    crowdingLevel: shelter.recommendation_score >= 70 ? '여유로움' : '보통',
    imageSrc: '/assets/shelters/shelter-naseong-community-center.png',
    location: shelter.location,
    facilities: toFacilities(shelter.facilities),
  }
}

function getShelterType(type: string): Shelter['type'] {
  if (type.includes('정류')) return 'TRANSIT_SHELTER'
  if (type.includes('공원') || type.includes('기타')) return 'PARK_REST'
  if (type.includes('공공')) return 'PUBLIC_FACILITY'

  return 'COOLING_CENTER'
}

function toFacilities(facilities: string[]): ShelterFacility {
  return {
    cooling: facilities.includes('냉방'),
    seating: facilities.includes('좌석'),
    water: facilities.includes('정수기'),
    restroom: facilities.includes('화장실'),
    wifi: facilities.includes('와이파이'),
    aed: facilities.includes('AED'),
  }
}
