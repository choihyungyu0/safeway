import { create } from 'zustand'
import type { RouteSearchParams } from '@/entities/route/types'
import type { UserType } from '@/entities/user/types'

type RouteSearchState = {
  searchParams: RouteSearchParams
  userType: UserType
  selectedRecommendationId: string
  setSearchParams: (params: RouteSearchParams) => void
  setUserType: (userType: UserType) => void
  setSelectedRecommendationId: (recommendationId: string) => void
}

const now = new Date()
now.setMinutes(now.getMinutes() - now.getTimezoneOffset())

export const defaultSearchParams: RouteSearchParams = {
  startPlace: '정부세종청사',
  destination: '세종시청',
  departureAt: now.toISOString().slice(0, 16),
  transportMode: 'WALK',
  preference: 'SAFE',
  lowVisibilitySafety: true,
}

export const useRouteSearchStore = create<RouteSearchState>((set) => ({
  searchParams: defaultSearchParams,
  userType: 'GENERAL',
  selectedRecommendationId: 'route-safeway',
  setSearchParams: (searchParams) => set({ searchParams }),
  setUserType: (userType) => set({ userType }),
  setSelectedRecommendationId: (selectedRecommendationId) =>
    set({ selectedRecommendationId }),
}))
