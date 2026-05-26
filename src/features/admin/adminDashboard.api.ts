import type { AdminDashboardSummary } from '@/entities/admin/types'
import { mockAdminDashboard } from '@/mocks/fixtures/admin'
import { apiEndpoints, apiGet } from '@/shared/api/client'
import { withFixtureFallback } from '@/shared/api/fallback'

export function getAdminDashboard(): Promise<AdminDashboardSummary> {
  return withFixtureFallback(
    () => apiGet<AdminDashboardSummary>(apiEndpoints.adminDashboard),
    () => mockAdminDashboard,
  )
}
