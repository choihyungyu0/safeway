import type { CurrentClimate } from '@/entities/climate/types'

export const mockCurrentClimate: CurrentClimate = {
  observedAt: '2026-05-24T15:00:00+09:00',
  temperatureCelsius: 31.8,
  fineDust: '나쁨',
  visibility: '7.2km',
  risks: [
    {
      type: 'HEAT',
      label: '폭염',
      level: 'HIGH',
      value: '31.8°C',
      summary: '직사광선 구간을 줄이고 쉬어갈 수 있는 곳을 우선합니다.',
    },
    {
      type: 'FINE_DUST',
      label: '미세먼지',
      level: 'MODERATE',
      value: 'PM10 72',
      summary: '공원길과 실내 환승 지점을 함께 비교합니다.',
    },
    {
      type: 'FOG',
      label: '안개',
      level: 'LOW',
      value: '시정 7.2km',
      summary: '저시정 위험은 낮지만 야간 이동 시 조명 구간을 반영합니다.',
    },
  ],
}
