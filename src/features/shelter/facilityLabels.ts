import type { ShelterFacility } from '@/entities/shelter/types'

export const shelterFacilityLabels: Record<keyof ShelterFacility, string> = {
  cooling: '냉방',
  seating: '의자',
  water: '정수기',
  restroom: '화장실',
  wifi: '와이파이',
  aed: 'AED',
}
