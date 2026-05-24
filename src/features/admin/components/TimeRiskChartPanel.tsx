import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { timeRiskPoints } from '@/mocks/fixtures/adminDashboard'
import styles from '@/pages/AdminDashboardPage.module.css'
import { InfoDot } from './ClimateRiskMapPanel'

const riskTypeOptions = ['폭염', '미세먼지', '안개'] as const
const plotTop = 28
const plotBottom = 216
const plotHeight = plotBottom - plotTop
const xStart = 66
const xStep = 42

export function TimeRiskChartPanel() {
  const [selectedRiskType, setSelectedRiskType] = useState<(typeof riskTypeOptions)[number]>('폭염')

  const chartPoints = useMemo(
    () =>
      timeRiskPoints.map((point, index) => {
        const x = xStart + index * xStep
        const riskY = plotBottom - (point.riskIndex / 100) * plotHeight
        const barHeight = (point.recommendationCount / 1200) * plotHeight
        const barY = plotBottom - barHeight

        return {
          ...point,
          x,
          riskY,
          barHeight,
          barY,
        }
      }),
    [],
  )

  return (
    <section className={`${styles.card} ${styles.chartCard}`} aria-labelledby="time-risk-title">
      <div className={styles.cardTitleBetween}>
        <h2 id="time-risk-title">
          시간대별 기후위험 현황 <InfoDot />
        </h2>

        <label className={styles.selectLabel}>
          <span className={styles.visuallyHidden}>위험 유형 선택</span>
          <select
            value={selectedRiskType}
            onChange={(event) =>
              setSelectedRiskType(event.target.value as (typeof riskTypeOptions)[number])
            }
          >
            {riskTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown size={16} aria-hidden="true" />
        </label>
      </div>

      <div className={styles.chartLegend}>
        <span className={styles.blueLine} aria-hidden="true" />
        위험 지수(0~100)
        <span className={styles.tealBox} aria-hidden="true" />
        추천 건수(건)
      </div>

      <div className={styles.chartBox}>
        <svg
          viewBox="0 0 430 260"
          className={styles.chartSvg}
          role="img"
          aria-label={`${selectedRiskType} 시간대별 위험 지수는 45, 52, 68, 82, 94, 88, 72, 56이며 추천 건수는 240건에서 860건 사이입니다.`}
        >
          <line x1="46" y1={plotTop} x2="46" y2={plotBottom} className={styles.axis} />
          <line x1="46" y1={plotBottom} x2="388" y2={plotBottom} className={styles.axis} />

          {[28, 75, 122, 169, 216].map((y) => (
            <line key={y} x1="46" y1={y} x2="388" y2={y} className={styles.gridLine} />
          ))}

          {chartPoints.map((point) => (
            <rect
              key={point.time}
              x={point.x - 9}
              y={point.barY}
              width="18"
              height={point.barHeight}
              rx="3"
              className={styles.barRect}
            />
          ))}

          <polyline
            points={chartPoints.map((point) => `${point.x},${point.riskY}`).join(' ')}
            className={styles.lineGraph}
          />

          {chartPoints.map((point) => (
            <g key={point.time}>
              <circle cx={point.x} cy={point.riskY} r="5" className={styles.lineDot} />
              <text
                x={point.x - 10}
                y={point.riskY - 13}
                className={point.riskIndex === 94 ? styles.hotText : styles.chartText}
              >
                {point.riskIndex}
              </text>
            </g>
          ))}

          {chartPoints.map((point) => (
            <text key={point.time} x={point.x - 12} y="242" className={styles.xLabel}>
              {point.time}
            </text>
          ))}

          <text x="13" y="33" className={styles.yLabel}>
            100
          </text>
          <text x="20" y="80" className={styles.yLabel}>
            75
          </text>
          <text x="20" y="128" className={styles.yLabel}>
            50
          </text>
          <text x="20" y="176" className={styles.yLabel}>
            25
          </text>
          <text x="28" y="221" className={styles.yLabel}>
            0
          </text>

          <text x="392" y="33" className={styles.yLabel}>
            1,200
          </text>
          <text x="398" y="95" className={styles.yLabel}>
            900
          </text>
          <text x="398" y="158" className={styles.yLabel}>
            600
          </text>
          <text x="406" y="221" className={styles.yLabel}>
            0
          </text>
        </svg>
      </div>
    </section>
  )
}
