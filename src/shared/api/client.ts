import axios from 'axios'
import { API_BASE_URL, API_TIMEOUT_MS } from '@/shared/api/config'
import { ApiClientError, toApiClientError } from '@/shared/api/errors'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
})

export const apiEndpoints = {
  currentClimate: '/climate/current',
  climateScenarios: '/climate/scenarios',
  placesSearch: '/places/search',
  shelters: '/shelters',
  nearbyShelters: '/shelters/nearby',
  recommendations: '/routes/recommend',
  feedback: '/feedback',
  adminDashboard: '/admin/dashboard',
  adminClimateRiskMap: '/admin/climate-risk-map',
  adminShelterGaps: '/admin/shelter-gaps',
  adminTemporaryShelters: '/admin/temporary-shelters',
  adminRecommendationLogs: '/admin/recommendation-logs',
  adminFeedback: '/admin/feedback',
  adminDataStatus: '/admin/data-status',
  adminReports: '/admin/reports',
  adminSettings: '/admin/settings',
} as const

const shouldSkipNetworkInTests =
  import.meta.env.MODE === 'test' && import.meta.env.VITE_ENABLE_API_IN_TESTS !== 'true'

export async function apiGet<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  ensureNetworkAllowed()

  try {
    const response = await apiClient.get<T>(url, { params })

    return response.data
  } catch (error) {
    throw toApiClientError(error)
  }
}

export async function apiPost<TResponse, TBody = unknown>(
  url: string,
  body: TBody,
): Promise<TResponse> {
  ensureNetworkAllowed()

  try {
    const response = await apiClient.post<TResponse>(url, body)

    return response.data
  } catch (error) {
    throw toApiClientError(error)
  }
}

export async function apiPut<TResponse, TBody = unknown>(
  url: string,
  body: TBody,
): Promise<TResponse> {
  ensureNetworkAllowed()

  try {
    const response = await apiClient.put<TResponse>(url, body)

    return response.data
  } catch (error) {
    throw toApiClientError(error)
  }
}

function ensureNetworkAllowed() {
  if (shouldSkipNetworkInTests) {
    throw new ApiClientError('API calls are disabled in test mode')
  }
}
