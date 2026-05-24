import { z } from 'zod'
import { routePreferences, transportModes } from '@/entities/route/types'

export const routeSearchSchema = z.object({
  startPlace: z.string().trim().min(1, '출발지를 입력해 주세요.'),
  destination: z.string().trim().min(1, '목적지를 입력해 주세요.'),
  departureAt: z.string().trim().min(1, '출발일시를 선택해 주세요.'),
  transportMode: z.enum(transportModes),
  preference: z.enum(routePreferences),
  lowVisibilitySafety: z.boolean(),
})

export type RouteSearchFormValues = z.infer<typeof routeSearchSchema>
