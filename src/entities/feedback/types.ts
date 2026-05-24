export type Feedback = {
  routeLogId: string
  satisfaction: number
  actualTravelMinutes: number
  perceivedRisk: 'LOW' | 'MODERATE' | 'HIGH'
  shelterUsed: boolean
  helpfulness: number
  comment?: string
}
