import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { adminAlerts } from '@/mocks/fixtures/adminDashboard'
import styles from '@/pages/AdminDashboardPage.module.css'

export function RecentAlertsPanel() {
  const [message, setMessage] = useState('')

  return (
    <section className={`${styles.card} ${styles.alertCard}`} aria-labelledby="recent-alert-title">
      <div className={styles.cardTitleBetween}>
        <h2 id="recent-alert-title">최근 알림</h2>
        <button
          type="button"
          className={styles.textLinkButton}
          onClick={() => setMessage('전체 알림 화면은 데모 준비 중입니다.')}
        >
          전체보기
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>

      {message ? (
        <p className={styles.inlineToast} role="status">
          {message}
        </p>
      ) : null}

      <div className={styles.alertList}>
        {adminAlerts.map((alert) => {
          const Icon = alert.icon

          return (
            <article className={styles.alertItem} key={alert.id}>
              <div className={`${styles.alertIcon} ${styles[alert.color]}`} aria-hidden="true">
                <Icon size={22} />
              </div>

              <div>
                <strong className={styles[alert.color]}>{alert.title}</strong>
                <p>{alert.description}</p>
              </div>

              <time>{alert.time}</time>
            </article>
          )
        })}
      </div>
    </section>
  )
}
