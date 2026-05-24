export type RiskDistribution = {
  label: string
  value: number
}

export type TopRiskArea = {
  name: string
  reason: string
  score: number
}

export type AdminDashboardSummary = {
  highRiskAreas: number
  shelterGaps: number
  vulnerableWalkingRoutes: number
  temporaryShelterCandidates: number
  recommendationUsage: number
  riskTypeDistribution: RiskDistribution[]
  topRiskAreas: TopRiskArea[]
}

export type ShelterGapArea = {
  id: string
  name: string
  description: string
  vulnerableUsers: string[]
  nearestShelterDistanceMeters: number
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
}

export type TemporaryShelterCandidate = {
  id: string
  name: string
  address: string
  reason: string
  estimatedCapacity: number
}

export type DataCollectionStatus = {
  id: string
  datasetName: string
  provider: string
  collectionCycle: string
  lastCollectedAt: string
  status: 'NORMAL' | 'DELAYED' | 'ERROR'
  errorMessage?: string
}
