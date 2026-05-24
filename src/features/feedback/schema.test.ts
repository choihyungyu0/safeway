import { describe, expect, it } from 'vitest'
import { feedbackSchema } from '@/features/feedback/schema'

describe('feedbackSchema', () => {
  it('enforces comment length', () => {
    const result = feedbackSchema.safeParse({
      routeLogId: 'log-safeway-001',
      satisfaction: 5,
      actualTravelMinutes: 30,
      perceivedRisk: 'LOW',
      shelterUsed: true,
      helpfulness: 5,
      comment: '긴'.repeat(301),
    })

    expect(result.success).toBe(false)
  })
})
