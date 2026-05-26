import type { DataCollectionStatus } from '@/entities/admin/types'
import { mockDataCollectionStatuses } from '@/mocks/fixtures/admin'
import {
  publicDataAlertLogs,
  publicDataQualityMetrics,
  publicDataSummaryMetrics,
  publicDatasets,
} from '@/mocks/fixtures/adminPublicData'
import { apiEndpoints, apiGet } from '@/shared/api/client'
import { withFixtureFallback } from '@/shared/api/fallback'

export type AdminDataStatusPayload = {
  collectionStatuses: DataCollectionStatus[]
  summaryMetrics: typeof publicDataSummaryMetrics
  datasets: typeof publicDatasets
  qualityMetrics: typeof publicDataQualityMetrics
  alertLogs: typeof publicDataAlertLogs
}

export function getAdminDataStatus(): Promise<AdminDataStatusPayload> {
  return withFixtureFallback(
    async () => ({
      collectionStatuses: await apiGet<DataCollectionStatus[]>(apiEndpoints.adminDataStatus),
      summaryMetrics: publicDataSummaryMetrics,
      datasets: publicDatasets,
      qualityMetrics: publicDataQualityMetrics,
      alertLogs: publicDataAlertLogs,
    }),
    () => ({
      collectionStatuses: mockDataCollectionStatuses,
      summaryMetrics: publicDataSummaryMetrics,
      datasets: publicDatasets,
      qualityMetrics: publicDataQualityMetrics,
      alertLogs: publicDataAlertLogs,
    }),
  )
}
