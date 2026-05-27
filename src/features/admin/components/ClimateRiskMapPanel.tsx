import { useState } from 'react'
import { CloudFog, RefreshCw, Sun, Waves } from 'lucide-react'
import {
  AdminLeafletMap,
  type AdminLeafletCircle,
  type AdminLeafletPoint,
} from '@/features/admin/components/AdminLeafletMap'
import { climateRiskMarkers } from '@/mocks/fixtures/adminDashboard'
import styles from '@/pages/AdminDashboardPage.module.css'

const climateTabs = [
  { label: '폭염', icon: Sun },
  { label: '미세먼지', icon: CloudFog },
  { label: '안개', icon: Waves },
] as const

const markerPositions: Record<string, { x: number; y: number }> = {
  markerEojin: { x: 43, y: 24 },
  markerNaseong: { x: 47, y: 52 },
  markerHansol: { x: 79, y: 52 },
  markerBoram: { x: 22, y: 74 },
}

const climateHeatCircles: AdminLeafletCircle[] = [
  {
    id: 'dashboard-eojin-heat',
    position: { x: 43, y: 25 },
    radiusMeters: 870,
    tone: 'danger',
    label: '어진동',
    fillOpacity: 0.22,
  },
  {
    id: 'dashboard-naseong-heat',
    position: { x: 48, y: 52 },
    radiusMeters: 980,
    tone: 'danger',
    label: '나성동',
    fillOpacity: 0.24,
  },
  {
    id: 'dashboard-hansol-heat',
    position: { x: 78, y: 55 },
    radiusMeters: 920,
    tone: 'danger',
    label: '한솔동',
    fillOpacity: 0.2,
  },
  {
    id: 'dashboard-boram-heat',
    position: { x: 21, y: 72 },
    radiusMeters: 720,
    tone: 'warning',
    label: '보람동',
    fillOpacity: 0.18,
  },
]

export function ClimateRiskMapPanel() {
  const [activeTab, setActiveTab] = useState<(typeof climateTabs)[number]['label']>('폭염')
  const [message, setMessage] = useState('')
  const riskPoints: AdminLeafletPoint[] = climateRiskMarkers.map((marker) => ({
    id: marker.id,
    label: marker.district,
    detail: marker.level,
    tone: marker.tone,
    shape: 'label',
    position: markerPositions[marker.className] ?? { x: 50, y: 50 },
  }))

  const refreshMap = () => {
    setMessage('기후위험 지도가 새로고침되었습니다.')
  }

  return (
    <section className={`${styles.card} ${styles.mapCard}`} aria-labelledby="climate-map-title">
      <div className={styles.cardTitleRow}>
        <h2 id="climate-map-title">
          기후위험 지도 <InfoDot />
        </h2>
      </div>

      <div className={styles.tabRow} role="tablist" aria-label="기후위험 유형">
        {climateTabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.label

          return (
            <button
              key={tab.label}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={isActive ? styles.activeTab : undefined}
              onClick={() => setActiveTab(tab.label)}
            >
              <Icon size={17} aria-hidden="true" />
              {tab.label}
            </button>
          )
        })}

        <div className={styles.riskLegend} aria-label="위험도 낮음에서 높음">
          <span>위험도</span>
          <em>낮음</em>
          <i aria-hidden="true" />
          <strong>높음</strong>
        </div>
      </div>

      <AdminLeafletMap
        className={styles.fakeMap}
        ariaLabel="어진동, 나성동, 한솔동, 보람동의 기후위험 현황을 보여주는 Leaflet 지도"
        points={riskPoints}
        circles={climateHeatCircles.map((circle) => ({
          ...circle,
          label: `${activeTab} ${circle.label}`,
        }))}
        center={{ x: 50, y: 52 }}
        zoom={12}
        maxFitZoom={12}
      >
        <div className={styles.mapBottom}>
          <p>데이터 기준: 2025.06.21 14:00</p>
          <button type="button" onClick={refreshMap}>
            <RefreshCw size={14} aria-hidden="true" />
            새로고침
          </button>
        </div>
      </AdminLeafletMap>

      {message ? (
        <p className={styles.inlineToast} role="status">
          {message}
        </p>
      ) : null}
    </section>
  )
}

export function InfoDot() {
  return (
    <span className={styles.infoDot} aria-label="안내">
      ?
    </span>
  )
}
