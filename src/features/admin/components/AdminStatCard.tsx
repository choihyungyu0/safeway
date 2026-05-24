import type { AdminSummaryMetric } from '@/features/admin/admin.types'
import styles from '@/pages/AdminDashboardPage.module.css'

type AdminStatCardProps = {
  metric: AdminSummaryMetric
}

export function AdminStatCard({ metric }: AdminStatCardProps) {
  const Icon = metric.icon

  return (
    <article className={styles.statCard}>
      <div>
        <p className={styles.statTitle}>
          {metric.title}
          {metric.id === 'recommendations-today' ? (
            <span className={styles.infoDot} aria-label="오늘 추천 건수 도움말">
              ?
            </span>
          ) : null}
        </p>
        <strong className={`${styles.statValue} ${styles[metric.accent]}`}>{metric.value}</strong>
        <p className={styles.statSub}>
          {metric.trend === 'up' ? (
            <>
              전일 대비 <em>↑ {metric.comparison.replace('전일 대비 ↑ ', '')}</em>
            </>
          ) : (
            metric.comparison
          )}
        </p>
      </div>

      <div className={`${styles.statIcon} ${styles[metric.accent]}`} aria-hidden="true">
        <Icon size={42} strokeWidth={2.1} />
      </div>
    </article>
  )
}
