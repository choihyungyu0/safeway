import { riskTypeRatios } from '@/mocks/fixtures/adminDashboard'
import styles from '@/pages/AdminDashboardPage.module.css'
import { InfoDot } from './ClimateRiskMapPanel'

export function RiskTypeRatioPanel() {
  return (
    <section className={`${styles.card} ${styles.ratioCard}`} aria-labelledby="risk-ratio-title">
      <h2 id="risk-ratio-title">
        위험 유형 비율 <InfoDot />
      </h2>

      <div className={styles.ratioContent}>
        <div
          className={styles.donutChart}
          role="img"
          aria-label="위험 유형 비율: 폭염 58%, 미세먼지 27%, 안개 15%"
        />

        <div className={styles.ratioLegend}>
          {riskTypeRatios.map((ratio) => (
            <div key={ratio.type}>
              <i className={styles[ratio.color]} aria-hidden="true" />
              <p>
                <strong>{ratio.type}</strong>
                <span>
                  {ratio.percentage}% ({ratio.count})
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.totalBox}>
        합계 <strong>1,934건</strong>
      </div>
    </section>
  )
}
