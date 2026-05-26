import type { Feedback } from '@/entities/feedback/types'
import { mockFeedback } from '@/mocks/fixtures/feedback'
import { apiEndpoints, apiPost } from '@/shared/api/client'
import { withFixtureFallback } from '@/shared/api/fallback'

type BackendFeedbackResponse = {
  id: string
  status: string
}

export function submitFeedback(feedback: Feedback): Promise<Feedback> {
  return withFixtureFallback(
    async () => {
      await apiPost<BackendFeedbackResponse>(apiEndpoints.feedback, {
        route_log_id: feedback.routeLogId,
        rating: feedback.satisfaction,
        comment: feedback.comment,
        tags: [
          feedback.perceivedRisk,
          feedback.shelterUsed ? 'SHELTER_USED' : 'NO_SHELTER_USED',
        ],
      })

      return feedback
    },
    () => {
      mockFeedback.push(feedback)

      return feedback
    },
  )
}
