import { safewayUserTypeWeights } from '@/mocks/fixtures/generated/safewayData'
import { apiEndpoints, apiGet, apiPut } from '@/shared/api/client'
import { withFixtureFallback } from '@/shared/api/fallback'

export type AdminSettingsPayload = {
  scoringWeights: Record<string, number>
  notificationSettings: Record<string, boolean>
  userTypeWeights: typeof safewayUserTypeWeights
}

const fixtureSettings: AdminSettingsPayload = {
  scoringWeights: {
    heat: 30,
    dust: 25,
    fog: 15,
    shelter: 20,
    walking: 10,
  },
  notificationSettings: {
    risk: true,
    data: true,
    shelter: true,
  },
  userTypeWeights: safewayUserTypeWeights,
}

export function getAdminSettings(): Promise<AdminSettingsPayload> {
  return withFixtureFallback(
    () => apiGet<AdminSettingsPayload>(apiEndpoints.adminSettings),
    () => fixtureSettings,
  )
}

export function saveAdminSettings(settings: AdminSettingsPayload): Promise<AdminSettingsPayload> {
  return withFixtureFallback(
    () => apiPut<AdminSettingsPayload>(apiEndpoints.adminSettings, settings),
    () => settings,
  )
}
