import type { ReactNode } from 'react'
import type { RoutePreference, TransportMode } from '@/entities/route/types'
import type { UserType } from '@/entities/user/types'

export type HomeSearchValues = {
  startPlace: string
  destination: string
  departureAt: string
  userType: UserType
  userTypeLabel: string
  preference: RoutePreference
  preferenceLabel: string
  transportMode: TransportMode
}

export type TransportSegment = {
  mode: TransportMode
  label: string
}

export type ClimateStatusItem = {
  id: string
  label: string
  status: string
  detail: string
  tone: 'heat' | 'good' | 'fog'
  icon: ReactNode
}

export type FavoritePlaceItem = {
  id: string
  label: string
  address: string
  icon: ReactNode
}

export type QuickActionItem = {
  id: string
  label: string
  description: string
  href: string
  imageSrc: string
  imageAlt: string
}
