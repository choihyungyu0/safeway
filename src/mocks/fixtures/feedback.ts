import type { Feedback } from '@/entities/feedback/types'

export const mockFeedback: Feedback[] = [
  {
    routeLogId: 'log-safeway-001',
    satisfaction: 5,
    actualTravelMinutes: 32,
    perceivedRisk: 'LOW',
    shelterUsed: true,
    helpfulness: 5,
    comment: '호수공원 방문자센터를 안내받아 쉬어갈 수 있었습니다.',
  },
]
