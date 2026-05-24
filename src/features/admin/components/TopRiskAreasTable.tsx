import { CloudFog, Sun } from 'lucide-react'
import { topRiskAreas } from '@/mocks/fixtures/adminDashboard'
import styles from '@/pages/AdminDashboardPage.module.css'
import { InfoDot } from './ClimateRiskMapPanel'

export function TopRiskAreasTable() {
  return (
    <section className={`${styles.card} ${styles.tableCard}`} aria-labelledby="top-risk-title">
      <h2 id="top-risk-title">
        위험 권역 TOP 5 <InfoDot />
      </h2>

      <div className={styles.tableScroll}>
        <table>
          <thead>
            <tr>
              <th>순위</th>
              <th>권역</th>
              <th>위험 유형</th>
              <th>위험 지수</th>
              <th>추천 건수</th>
              <th>전일 대비</th>
            </tr>
          </thead>
          <tbody>
            {topRiskAreas.map((area) => {
              const RiskIcon = area.riskType === '폭염' ? Sun : CloudFog

              return (
                <tr key={area.rank}>
                  <td>{area.rank}</td>
                  <td>{area.district}</td>
                  <td>
                    <span className={styles.riskTypeCell}>
                      <RiskIcon size={15} aria-hidden="true" />
                      {area.riskType}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`${styles.scoreBadge} ${
                        area.riskIndex >= 85 ? styles.dangerBadge : ''
                      }`}
                    >
                      {area.riskIndex}
                    </span>
                  </td>
                  <td>{area.recommendationCount}</td>
                  <td className={area.trend === 'up' ? styles.upTrend : styles.downTrend}>
                    {area.trend === 'up' ? '↑' : '↓'} {area.dailyChangePct}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
