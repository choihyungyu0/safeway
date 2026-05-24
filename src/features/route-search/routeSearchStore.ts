import { create } from 'zustand'
import type { RouteSearchParams } from '@/entities/route/types'
import { userTypes, type UserType } from '@/entities/user/types'
import { routeSearchSchema } from '@/features/route-search/schema'

type RouteSearchState = {
  searchParams: RouteSearchParams
  userType: UserType
  selectedRecommendationId: string
  setSearchParams: (params: RouteSearchParams) => void
  setUserType: (userType: UserType) => void
  setSelectedRecommendationId: (recommendationId: string) => void
}

export const USER_TYPE_SESSION_KEY = 'safeway:selected-user-type'
export const ROUTE_SEARCH_SESSION_KEY = 'safeway:route-search-params'
export const SELECTED_RECOMMENDATION_SESSION_KEY = 'safeway:selected-recommendation-id'

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
  preference: 'COOL',
  lowVisibilitySafety: true,
}

export const getStoredSearchParams = (): RouteSearchParams | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const storedSearchParams = window.sessionStorage.getItem(ROUTE_SEARCH_SESSION_KEY)
  if (!storedSearchParams) {
    return null
  }

  try {
    const parsedSearchParams: unknown = JSON.parse(storedSearchParams)
    const result = routeSearchSchema.safeParse(parsedSearchParams)
    return result.success ? result.data : null
  } catch {
    return null
  }
}

const persistSearchParams = (searchParams: RouteSearchParams) => {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.setItem(ROUTE_SEARCH_SESSION_KEY, JSON.stringify(searchParams))
}

export const getStoredRecommendationId = (): string | null => {
  if (typeof window === 'undefined') {
    return null
  }

  return window.sessionStorage.getItem(SELECTED_RECOMMENDATION_SESSION_KEY)
}

const persistRecommendationId = (recommendationId: string) => {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.setItem(SELECTED_RECOMMENDATION_SESSION_KEY, recommendationId)
}

export const useRouteSearchStore = create<RouteSearchState>((set) => ({
  searchParams: getStoredSearchParams() ?? defaultSearchParams,
  userType: getStoredUserType() ?? 'GENERAL',
  selectedRecommendationId: getStoredRecommendationId() ?? 'safeway-route',
  setSearchParams: (searchParams) => {
    persistSearchParams(searchParams)
    set({ searchParams })
  },
  setUserType: (userType) => {
    persistUserType(userType)
    set({ userType })
  },
  setSelectedRecommendationId: (selectedRecommendationId) => {
    persistRecommendationId(selectedRecommendationId)
    set({ selectedRecommendationId })
  },
}))
