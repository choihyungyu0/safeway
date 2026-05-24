import { useState } from 'react'
import { CloudFog, Maximize2, RefreshCw, Sun, Waves } from 'lucide-react'
import { climateRiskMarkers } from '@/mocks/fixtures/adminDashboard'
import styles from '@/pages/AdminDashboardPage.module.css'

const climateTabs = [
  { label: '폭염', icon: Sun },
  { label: '미세먼지', icon: CloudFog },
  { label: '안개', icon: Waves },
] as const

export function ClimateRiskMapPanel() {
  const [activeTab, setActiveTab] = useState<(typeof climateTabs)[number]['label']>('폭염')
  const [message, setMessage] = useState('')

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

      <div
        className={styles.fakeMap}
        role="img"
        aria-label="어진동, 나성동, 한솔동, 보람동 기후위험 현황을 보여주는 모의 지도"
      >
        <div className={styles.mapTexture} aria-hidden="true" />
        <div className={`${styles.heat} ${styles.heatEojin}`} aria-hidden="true" />
        <div className={`${styles.heat} ${styles.heatNaseong}`} aria-hidden="true" />
        <div className={`${styles.heat} ${styles.heatHansol}`} aria-hidden="true" />
        <div className={`${styles.heat} ${styles.heatBoram}`} aria-hidden="true" />

        {climateRiskMarkers.map((marker) => (
          <div
            key={marker.id}
            className={`${styles.mapLabel} ${styles[marker.className]} ${styles[marker.tone]}`}
          >
            <strong>{marker.district}</strong>
            <span>{marker.level}</span>
          </div>
        ))}

        <div className={styles.mapControls} aria-label="모의 지도 확대 축소">
          <button type="button" aria-label="확대">
            +
          </button>
          <button type="button" aria-label="축소">
            -
          </button>
          <button type="button" aria-label="전체 화면">
            <Maximize2 size={18} aria-hidden="true" />
          </button>
        </div>

        <div className={styles.mapBottom}>
          <p>데이터 기준: 2025.06.21 14:00</p>
          <button type="button" onClick={refreshMap}>
            <RefreshCw size={14} aria-hidden="true" />
            새로고침
          </button>
        </div>
      </div>

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
    <span className={styles.infoDot} aria-label="도움말">
      ?
    </span>
  )
}
