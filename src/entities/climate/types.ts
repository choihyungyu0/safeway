export type ClimateRiskType = 'HEAT' | 'FINE_DUST' | 'FOG' | 'COLD' | 'OZONE'

export type ClimateRisk = {
  type: ClimateRiskType
  label: string
  level: 'LOW' | 'MODERATE' | 'HIGH'
  value: string
  summary: string
}

export type CurrentClimate = {
  observedAt: string
  temperatureCelsius: number
  fineDust: string
  visibility: string
  risks: ClimateRisk[]
}
