import type { Place } from '@/entities/place/types'

export const mockPlaces: Place[] = [
  {
    id: 'place-government-complex',
    name: 'Government Complex Sejong',
    district: '어진동',
    category: 'GOVERNMENT',
    location: { lat: 36.5044, lng: 127.2654 },
  },
  {
    id: 'place-lake-park',
    name: 'Sejong Lake Park',
    district: '세종동',
    category: 'PARK',
    location: { lat: 36.4951, lng: 127.2696 },
  },
  {
    id: 'place-city-hall',
    name: 'Sejong City Hall',
    district: '보람동',
    category: 'CIVIC',
    location: { lat: 36.4801, lng: 127.2891 },
  },
  {
    id: 'place-naseong',
    name: 'Naseong-dong',
    district: '나성동',
    category: 'NEIGHBORHOOD',
    location: { lat: 36.4864, lng: 127.2564 },
  },
  {
    id: 'place-dodam',
    name: 'Dodam-dong',
    district: '도담동',
    category: 'NEIGHBORHOOD',
    location: { lat: 36.5144, lng: 127.2583 },
  },
  {
    id: 'place-geumgang-bridge',
    name: 'Geumgang Pedestrian Bridge',
    district: '세종동',
    category: 'LANDMARK',
    location: { lat: 36.4837, lng: 127.2836 },
  },
]

export const favoritePlaces = mockPlaces.slice(0, 3)
