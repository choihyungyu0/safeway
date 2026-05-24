import { AdminLayout } from '@/features/admin/components/AdminLayout'
import { AdminStatCard } from '@/features/admin/components/AdminStatCard'
import { ClimateRiskMapPanel } from '@/features/admin/components/ClimateRiskMapPanel'
import { RecentAlertsPanel } from '@/features/admin/components/RecentAlertsPanel'
import { RiskTypeRatioPanel } from '@/features/admin/components/RiskTypeRatioPanel'
import { TimeRiskChartPanel } from '@/features/admin/components/TimeRiskChartPanel'
import { TopRiskAreasTable } from '@/features/admin/components/TopRiskAreasTable'
import { adminSummaryMetrics } from '@/mocks/fixtures/adminDashboard'
import styles from '@/pages/AdminDashboardPage.module.css'

export function AdminDashboardPage() {
  return (
    <AdminLayout>
      <section className={styles.dashboardArea} aria-label="관리자 대시보드 본문">
        <section className={styles.statGrid} aria-label="운영 요약 지표">
          {adminSummaryMetrics.map((metric) => (
            <AdminStatCard key={metric.id} metric={metric} />
          ))}
        </section>

        <section className={styles.mainGrid} aria-label="기후위험 운영 현황">
          <div className={styles.leftColumn}>
            <ClimateRiskMapPanel />
            <TopRiskAreasTable />
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.topRightGrid}>
              <TimeRiskChartPanel />
              <RiskTypeRatioPanel />
            </div>
            <RecentAlertsPanel />
          </div>
        </section>
      </section>
    </AdminLayout>
  )
}
