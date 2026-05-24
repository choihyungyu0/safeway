import type { UserType } from '@/entities/user/types'

export const transportModes = ['WALK', 'BUS_BRT', 'BIKE', 'MIXED'] as const
export const routePreferences = ['SAFE', 'COOL', 'SHORTEST', 'TRANSIT', 'NIGHT_SAFE'] as const
export const recommendationTypes = [
  'SAFEWAY',
  'TRANSIT_ALTERNATIVE',
  'NIGHT_SAFE',
  'SHORTEST',
] as const

export type TransportMode = (typeof transportModes)[number]
export type RoutePreference = (typeof routePreferences)[number]
export type RecommendationType = (typeof recommendationTypes)[number]

export type LatLng = {
  lat: number
  lng: number
}

export type RouteSearchParams = {
  startPlace: string
  destination: string
  departureAt: string
  transportMode: TransportMode
  preference: RoutePreference
  lowVisibilitySafety: boolean
}

export type ScoreBreakdown = {
  climateSafety: number
  outdoorExposureSafety: number
  shelterAccess: number
  greenAccess: number
  transitAccess: number
  nightSafety: number
}

export type SafeRouteRecommendation = {
  id: string
  routeLogId: string
  type: RecommendationType
  title: string
  subtitle: string
  summary: string
  durationMin: number
  totalDurationMinutes: number
  walkingMinutes: number
  distanceMeters: number
  exposureReductionPct: number
  outdoorExposureReductionPercent: number
  shelterCount: number
  climateSafetyScore: number
  scoreBreakdown: ScoreBreakdown
  reason: string
  cautions: string[]
  path: LatLng[]
  nearShelterIds: string[]
  userType: UserType
  iconSrc: string
  accentColor: string
  isRecommended?: boolean
}
