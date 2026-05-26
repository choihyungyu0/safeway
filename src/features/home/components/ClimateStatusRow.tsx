import { CloudFog, ThermometerSun, Wind } from 'lucide-react'
import type { ClimateStatusItem } from '@/features/home/home.types'
import { safewayClimateScenarios } from '@/mocks/fixtures/generated/safewayData'
import styles from '@/pages/HomePage.module.css'

const currentScenario =
  safewayClimateScenarios.find((scenario) => scenario.name === '일반 여름날') ??
  safewayClimateScenarios[0]

const climateItems: ClimateStatusItem[] = [
  {
    id: 'heat',
    label: '폭염',
    status: `주의 (${currentScenario.temperature}°C)`,
    detail: `습도 ${currentScenario.humidity}%`,
    tone: 'heat',
    icon: <ThermometerSun size={20} />,
  },
  {
    id: 'dust',
    label: '미세먼지',
    status: `좋음 (${currentScenario.pm25})`,
    detail: `PM10 ${currentScenario.pm10}`,
    tone: 'good',
    icon: <Wind size={20} />,
  },
  {
    id: 'fog',
    label: '안개',
    status: '낮음',
    detail: `시정 ${currentScenario.visibilityKm}km`,
    tone: 'fog',
    icon: <CloudFog size={20} />,
  },
]

export function ClimateStatusRow() {
  return (
    <div className={styles.climateStatusRow} aria-label="현재 기후 상태">
      {climateItems.map((item) => (
        <article key={item.id} className={`${styles.climateCard} ${styles[item.tone]}`}>
          <span className={styles.climateIcon} aria-hidden="true">
            {item.icon}
          </span>
          <div>
            <strong>{item.label}</strong>
            <p>{item.status}</p>
            <small>{item.detail}</small>
          </div>
        </article>
      ))}
    </div>
  )
}
