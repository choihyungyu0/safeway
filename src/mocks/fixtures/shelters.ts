import type { Shelter } from '@/entities/shelter/types'
import { safewayShelters } from '@/mocks/fixtures/generated/safewayData'
import type { SafewayShelter } from '@/mocks/fixtures/generated/safewayData.types'

const demoShelters: Shelter[] = [
  {
    id: 'shelter-001',
    name: '나성동 복합커뮤니티센터 쉼터',
    type: 'PUBLIC_FACILITY',
    status: 'OPEN',
    address: '세종특별자치시 나성로 33',
    operationTime: '09:00 ~ 18:00',
    capacity: 120,
    distanceFromRouteMeters: 450,
    walkingTimeMin: 6,
    crowdingLevel: '여유로움',
    imageSrc: '/assets/shelters/shelter-naseong-community-center.png',
    location: { lat: 36.4879, lng: 127.2576 },
    facilities: {
      cooling: true,
      seating: true,
      water: true,
      restroom: true,
      wifi: true,
      aed: true,
    },
  },
  {
    id: 'shelter-lake-park-center',
    name: '세종호수공원 방문자센터',
    type: 'PARK_REST',
    status: 'OPEN',
    address: '세종특별자치시 호수공원길 155',
    operationTime: '10:00-20:00',
    capacity: 54,
    distanceFromRouteMeters: 95,
    walkingTimeMin: 2,
    crowdingLevel: '보통',
    imageSrc: '/assets/shelters/shelter-naseong-community-center.png',
    location: { lat: 36.4961, lng: 127.2702 },
    facilities: {
      cooling: true,
      seating: true,
      water: true,
      restroom: true,
      wifi: false,
      aed: true,
    },
  },
  {
    id: 'shelter-government-library',
    name: '정부세종청사 공공도서관 쉼터',
    type: 'PUBLIC_FACILITY',
    status: 'LIMITED',
    address: '세종특별자치시 도움6로 42',
    operationTime: '09:00-21:00',
    capacity: 120,
    distanceFromRouteMeters: 260,
    walkingTimeMin: 4,
    crowdingLevel: '여유로움',
    imageSrc: '/assets/shelters/shelter-naseong-community-center.png',
    location: { lat: 36.5052, lng: 127.2671 },
    facilities: {
      cooling: true,
      seating: true,
      water: true,
      restroom: true,
      wifi: true,
      aed: true,
    },
  },
  {
    id: 'shelter-naseong-brt',
    name: '나성동 BRT 환승쉼터',
    type: 'TRANSIT_SHELTER',
    status: 'OPEN',
    address: '세종특별자치시 나성북로 30',
    operationTime: '05:30-24:00',
    capacity: 38,
    distanceFromRouteMeters: 70,
    walkingTimeMin: 1,
    crowdingLevel: '혼잡',
    imageSrc: '/assets/shelters/shelter-naseong-community-center.png',
    location: { lat: 36.4868, lng: 127.2571 },
    facilities: {
      cooling: false,
      seating: true,
      water: false,
      restroom: false,
      wifi: true,
      aed: false,
    },
  },
]

const generatedShelters: Shelter[] = safewayShelters.map((shelter, index) =>
  toAppShelter(shelter, index),
)

export const mockShelters: Shelter[] = [...demoShelters, ...generatedShelters]

function toAppShelter(shelter: SafewayShelter, index: number): Shelter {
  const distanceFromRouteMeters = 80 + ((index * 37) % 470)

  return {
    id: shelter.id,
    name: shelter.name,
    type: getShelterType(shelter),
    status: shelter.isOpen ? 'OPEN' : 'CLOSED',
    address: shelter.roadAddress || shelter.lotAddress,
    operationTime: shelter.operationTime,
    capacity: shelter.capacity,
    distanceFromRouteMeters,
    walkingTimeMin: Math.max(1, Math.ceil(distanceFromRouteMeters / 80)),
    crowdingLevel: getCrowdingLevel(shelter.recommendationScore),
    imageSrc: '/assets/shelters/shelter-naseong-community-center.png',
    location: { lat: shelter.lat, lng: shelter.lng },
    facilities: {
      cooling: shelter.airConditionerCount > 0 || shelter.facilities.includes('냉방'),
      seating: true,
      water: false,
      restroom: shelter.facilities.includes('화장실'),
      wifi: false,
      aed: false,
    },
  }
}

function getShelterType(shelter: SafewayShelter): Shelter['type'] {
  if (shelter.type.includes('정류') || shelter.name.includes('BRT')) {
    return 'TRANSIT_SHELTER'
  }

  if (shelter.name.includes('공원') || shelter.name.includes('교량')) {
    return 'PARK_REST'
  }

  return shelter.airConditionerCount > 0 ? 'COOLING_CENTER' : 'PUBLIC_FACILITY'
}

function getCrowdingLevel(score: number): Shelter['crowdingLevel'] {
  if (score >= 70) {
    return '여유로움'
  }

  if (score >= 45) {
    return '보통'
  }

  return '혼잡'
}
