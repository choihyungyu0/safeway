import type { CurrentClimate } from '@/entities/climate/types'
import { mockCurrentClimate } from '@/mocks/fixtures/climate'
import { safewayClimateScenarios } from '@/mocks/fixtures/generated/safewayData'
import type { SafewayClimateScenario } from '@/mocks/fixtures/generated/safewayData.types'
import { apiEndpoints, apiGet } from '@/shared/api/client'
import { withFixtureFallback } from '@/shared/api/fallback'

type BackendCurrentClimate = {
  scenario: string
  temperature: number
  humidity: number
  pm10: number
  pm25: number
  ozone: number
  visibility_km: number
  observed_at: string
  heat_status: string
  dust_status: string
  fog_status: string
}

type BackendClimateScenario = {
  name: string
  temperature: number
  humidity: number
  pm10: number
  pm25: number
  ozone: number
  visibility_km: number
}

export function getCurrentClimate() {
  return withFixtureFallback(
    async () => toCurrentClimate(await apiGet<BackendCurrentClimate>(apiEndpoints.currentClimate)),
    () => mockCurrentClimate,
  )
}

export function getClimateScenarios() {
  return withFixtureFallback(
    async () =>
      (await apiGet<BackendClimateScenario[]>(apiEndpoints.climateScenarios)).map(
        toClimateScenario,
      ),
    () => safewayClimateScenarios,
  )
}

function toCurrentClimate(climate: BackendCurrentClimate): CurrentClimate {
  return {
    observedAt: climate.observed_at,
    temperatureCelsius: climate.temperature,
    fineDust: `${climate.pm25}`,
    visibility: `${climate.visibility_km}km`,
    risks: [
      {
        type: 'HEAT',
        label: '폭염',
        level: climate.heat_status === '주의' ? 'MODERATE' : 'LOW',
        value: `${climate.temperature}°C`,
        summary: `습도 ${climate.humidity}%`,
      },
      {
        type: 'FINE_DUST',
        label: '미세먼지',
        level: climate.dust_status === '좋음' ? 'LOW' : 'MODERATE',
        value: `${climate.pm25}`,
        summary: `PM10 ${climate.pm10}`,
      },
      {
        type: 'FOG',
        label: '안개',
        level: climate.fog_status === '낮음' ? 'LOW' : 'MODERATE',
        value: `${climate.visibility_km}km`,
        summary: climate.scenario,
      },
    ],
  }
}

function toClimateScenario(scenario: BackendClimateScenario): SafewayClimateScenario {
  return {
    name: scenario.name,
    temperature: scenario.temperature,
    humidity: scenario.humidity,
    pm10: scenario.pm10,
    pm25: scenario.pm25,
    ozone: scenario.ozone,
    visibilityKm: scenario.visibility_km,
  }
}
