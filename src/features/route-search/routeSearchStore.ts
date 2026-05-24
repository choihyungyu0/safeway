import { create } from 'zustand'
import type { RouteSearchParams } from '@/entities/route/types'
import { userTypes, type UserType } from '@/entities/user/types'

type RouteSearchState = {
  searchParams: RouteSearchParams
  userType: UserType
  selectedRecommendationId: string
  setSearchParams: (params: RouteSearchParams) => void
  setUserType: (userType: UserType) => void
  setSelectedRecommendationId: (recommendationId: string) => void
}

export const USER_TYPE_SESSION_KEY = 'safeway:selected-user-type'

export const isUserType = (value: string | null): value is UserType =>
  userTypes.includes(value as UserType)

export const getStoredUserType = (): UserType | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const storedUserType = window.sessionStorage.getItem(USER_TYPE_SESSION_KEY)
  return isUserType(storedUserType) ? storedUserType : null
}

const persistUserType = (userType: UserType) => {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.setItem(USER_TYPE_SESSION_KEY, userType)
}

export const defaultSearchParams: RouteSearchParams = {
  startPlace: '정부세종청사 1동',
  destination: '세종특별자치시청',
  departureAt: '2025.06.21 (토) 14:00',
  transportMode: 'WALK',
  preference: 'SAFE',
  lowVisibilitySafety: true,
}

export const useRouteSearchStore = create<RouteSearchState>((set) => ({
  searchParams: defaultSearchParams,
  userType: getStoredUserType() ?? 'GENERAL',
  selectedRecommendationId: 'route-safeway',
  setSearchParams: (searchParams) => set({ searchParams }),
  setUserType: (userType) => {
    persistUserType(userType)
    set({ userType })
  },
  setSelectedRecommendationId: (selectedRecommendationId) =>
    set({ selectedRecommendationId }),
}))
