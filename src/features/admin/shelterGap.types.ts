export type ShelterGapRiskType = 'HEAT' | 'FINE_DUST' | 'FOG' | 'COLD_WAVE'

export type ShelterGapUserType =
  | 'GENERAL'
  | 'SENIOR'
  | 'CHILD'
  | 'PREGNANT'
  | 'DISABLED'
  | 'OUTDOOR_WORKER'

export type ShelterGapAnalysisRadius = '300m' | '500m' | '700m' | '1km'

export type ShelterGapBaseTime = '09:00' | '12:00' | '14:00' | '18:00' | '21:00'

export type ShelterGapFilter = {
  riskType: ShelterGapRiskType
  userType: ShelterGapUserType
  analysisRadius: ShelterGapAnalysisRadius
  baseTime: ShelterGapBaseTime
  baseDateTime: string
}

export type MapPosition = {
  x: number
  y: number
}

export type ShelterGapArea = {
  id: string
  rank: number
  name: string
  riskTags: string[]
  beneficiaryPopulation: string
  currentAccessTimeMin: string
  nearbyPublicFacilityCount: string
  position: MapPosition
  heatmapIntensity: number
}

export type TemporaryShelterCandidate = {
  id: string
  name: string
  address: string
  operationTime: string
  accessibilityScore: number
}

export type ShelterGapMapMarker = {
  id: string
  type: 'SHELTER' | 'CANDIDATE'
  position: MapPosition
  label?: string
}

export type ShelterGapDistrictLabel = {
  id: string
  label: string
  position: MapPosition
}

export type ShelterGapMapZone = {
  id: string
  className: string
}
