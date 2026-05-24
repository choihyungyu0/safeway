import { useState } from 'react'
import { List, Navigation } from 'lucide-react'
import { routeDetailSteps } from '@/features/map/map.constants'
import styles from '@/pages/MapPage.module.css'

const NAVIGATION_STARTED_SESSION_KEY = 'safeway:navigation-started'

export function MapBottomActions() {
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const startNavigation = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(NAVIGATION_STARTED_SESSION_KEY, 'true')
    }

    setStatusMessage('경로 안내를 시작합니다.')
  }

  return (
    <section className={styles.bottomSection} aria-label="지도 보기 작업">
      <div className={styles.bottomActions}>
        <button
          type="button"
          className={styles.outlineAction}
          aria-expanded={isDetailOpen}
          aria-controls="route-detail-panel"
          onClick={() => setIsDetailOpen((current) => !current)}
        >
          <List size={28} aria-hidden="true" />
          상세 경로 정보
        </button>

        <button type="button" className={styles.primaryAction} onClick={startNavigation}>
          <Navigation size={28} aria-hidden="true" />
          경로 안내 시작
        </button>
      </div>

      {statusMessage && (
        <p className={styles.actionStatus} role="status">
          {statusMessage}
        </p>
      )}

      {isDetailOpen && (
        <div id="route-detail-panel" className={styles.routeDetailPanel}>
          <h2>상세 경로 정보</h2>
          <ol>
            {routeDetailSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </section>
  )
}
