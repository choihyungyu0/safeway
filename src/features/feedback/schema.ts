import { z } from 'zod'

export const feedbackSchema = z.object({
  routeLogId: z.string().trim().min(1),
  satisfaction: z.coerce.number().int().min(1).max(5),
  actualTravelMinutes: z.coerce.number().int().min(1).max(240),
  perceivedRisk: z.enum(['LOW', 'MODERATE', 'HIGH']),
  shelterUsed: z.boolean(),
  helpfulness: z.coerce.number().int().min(1).max(5),
  comment: z.string().max(300, '의견은 300자 이내로 입력해 주세요.').optional(),
})

export type FeedbackFormValues = z.infer<typeof feedbackSchema>
