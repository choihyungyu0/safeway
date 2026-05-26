import {
  policyProposal,
  reportChapters,
  reportFeedbackKeywords,
  reportMetrics,
  reportPreviewPages,
  shelterPriorityItems,
} from '@/mocks/fixtures/adminReports'
import { apiEndpoints, apiGet } from '@/shared/api/client'
import { withFixtureFallback } from '@/shared/api/fallback'

export type AdminReportsPayload = {
  metrics: typeof reportMetrics
  previewPages: typeof reportPreviewPages
  chapters: typeof reportChapters
  feedbackKeywords: typeof reportFeedbackKeywords
  shelterPriorityItems: typeof shelterPriorityItems
  policyProposal: typeof policyProposal
}

export function getAdminReports(): Promise<AdminReportsPayload> {
  return withFixtureFallback(
    async () => {
      await apiGet<unknown>(apiEndpoints.adminReports)

      return fixtureReports()
    },
    fixtureReports,
  )
}

function fixtureReports(): AdminReportsPayload {
  return {
    metrics: reportMetrics,
    previewPages: reportPreviewPages,
    chapters: reportChapters,
    feedbackKeywords: reportFeedbackKeywords,
    shelterPriorityItems,
    policyProposal,
  }
}
