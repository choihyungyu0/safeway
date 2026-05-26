import { useState } from 'react'
import {
  Calendar,
  ChevronDown,
  CloudFog,
  Download,
  Info,
  Maximize,
  Minus,
  Plus,
  Sun,
  User,
  Wind,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SejongAdminShell as AdminLayout } from '@/shared/ui/SejongAdminShell'
import {
  defaultClimateRiskFilter,
  displayRangeOptions,
  riskLevelLabels,
  riskTypeLabels,
  riskTypeOptions,
  userTypeOptions,
} from '@/features/admin/climateRisk.constants'
import type {
  AdminRiskDisplayRange,
  AdminRiskFilter,
  AdminRiskType,
  AdminRiskUserType,
  ClimateRiskArea,
  RiskLevel,
  RiskRatioSegment,
  RiskSummaryStat,
} from '@/features/admin/climateRisk.types'
import {
  climateRiskAreas,
  climateRiskSummaryStats,
  mapDistrictLabels,
  mapHeatZones,
  mapRiskLabels,
  riskRatioSegments,
  timeRiskPoints,
} from '@/mocks/fixtures/adminClimateRiskMap'
import { safewayClimateScenarios } from '@/mocks/fixtures/generated/safewayData'
import styles from '@/pages/AdminClimateRiskMapPage.module.css'

const riskTypeIcons: Record<AdminRiskType, LucideIcon> = {
  HEAT: Sun,
  FINE_DUST: Wind,
  FOG: CloudFog,
}

const riskToneClass: Record<ClimateRiskArea['riskLevel'], string> = {
  VERY_HIGH: styles.redTone,
  HIGH: styles.orangeTone,
  MEDIUM: styles.yellowTone,
}

const legendToneClass: Record<RiskLevel, string> = {
  VERY_HIGH: styles.redTone,
  HIGH: styles.orangeTone,
  MEDIUM: styles.yellowTone,
  LOW: styles.lightGreenTone,
  VERY_LOW: styles.greenTone,
}

const chartPlot = {
  top: 30,
  bottom: 225,
  left: 45,
  right: 390,
  xStart: 60,
  xStep: 43,
  maxCount: 1200,
}

const baselineSafewayScenario = safewayClimateScenarios[0]

export function AdminClimateRiskMapPage() {
  const [filters, setFilters] = useState<AdminRiskFilter>(defaultClimateRiskFilter)
  const [downloadMessage, setDownloadMessage] = useState('')

  const selectedRiskLabel = riskTypeLabels[filters.riskType]

  const updateRiskType = (riskType: AdminRiskType) => {
    setFilters((current) => ({ ...current, riskType }))
    setDownloadMessage('')
  }

  const updateUserType = (userType: AdminRiskUserType) => {
    setFilters((current) => ({ ...current, userType }))
  }

  const updateDisplayRange = (displayRange: AdminRiskDisplayRange) => {
    setFilters((current) => ({ ...current, displayRange }))
  }

  return (
    <AdminLayout>
      <section className={styles.page} aria-labelledby="climate-risk-title">
        <header className={styles.pageTitle}>
          <h1 id="climate-risk-title">기후위험 지도</h1>
          <p>폭염·미세먼지·안개 위험 권역 모니터링</p>
          {baselineSafewayScenario ? (
            <p>
              SafeWay 처리 시나리오 {baselineSafewayScenario.name}: {baselineSafewayScenario.temperature}
              °C · PM10 {baselineSafewayScenario.pm10} · PM2.5 {baselineSafewayScenario.pm25} ·
              시정 {baselineSafewayScenario.visibilityKm}km
            </p>
          ) : null}
        </header>

        <ClimateRiskFilterBar
          filters={filters}
          onRiskTypeChange={updateRiskType}
          onUserTypeChange={updateUserType}
          onDisplayRangeChange={updateDisplayRange}
        />

        <section className={styles.dashboardGrid} aria-label="기후위험 지도 분석">
          <ClimateRiskMapPanel riskTypeLabel={selectedRiskLabel} />

          <aside className={styles.sideStats} aria-label="기후위험 요약과 차트">
            <div className={styles.summaryGrid}>
              {climateRiskSummaryStats.map((stat) => (
                <SummaryStatCard key={stat.id} stat={stat} />
              ))}
            </div>

            <TimeRiskChartPanel />
            <RiskRatioPanel riskTypeLabel={selectedRiskLabel} />
          </aside>
        </section>

        <TopRiskAreasTable
          riskTypeLabel={selectedRiskLabel}
          downloadMessage={downloadMessage}
          onDownload={() => setDownloadMessage('위험 권역 데이터 다운로드를 준비 중입니다.')}
        />
      </section>
    </AdminLayout>
  )
}

type FilterBarProps = {
  filters: AdminRiskFilter
  onRiskTypeChange: (riskType: AdminRiskType) => void
  onUserTypeChange: (userType: AdminRiskUserType) => void
  onDisplayRangeChange: (displayRange: AdminRiskDisplayRange) => void
}

function ClimateRiskFilterBar({
  filters,
  onRiskTypeChange,
  onUserTypeChange,
  onDisplayRangeChange,
}: FilterBarProps) {
  return (
    <section className={styles.filterPanel} aria-label="기후위험 조회 조건">
      <div className={styles.riskTypeBox}>
        <p className={styles.filterLabel}>위험 유형</p>
        <div className={styles.riskTabs} role="group" aria-label="위험 유형">
          {riskTypeOptions.map((riskType) => {
            const Icon = riskTypeIcons[riskType]
            const isActive = filters.riskType === riskType

            return (
              <button
                key={riskType}
                type="button"
                className={isActive ? styles.activeRiskTab : undefined}
                aria-pressed={isActive}
                onClick={() => onRiskTypeChange(riskType)}
              >
                <Icon size={18} strokeWidth={2.2} aria-hidden="true" />
                {riskTypeLabels[riskType]}
              </button>
            )
          })}
        </div>
      </div>

      <div className={styles.selectBoxWrap}>
        <p id="base-date-label" className={styles.filterLabel}>
          기준일시
        </p>
        <button type="button" className={styles.selectBox} aria-labelledby="base-date-label">
          <Calendar size={18} aria-hidden="true" />
          <span>{filters.baseDateTime}</span>
          <ChevronDown size={17} aria-hidden="true" />
        </button>
      </div>

      <label className={styles.selectBoxWrap} htmlFor="admin-risk-user-type">
        <span className={styles.filterLabel}>사용자 유형</span>
        <span className={styles.selectBox}>
          <User size={18} aria-hidden="true" />
          <select
            id="admin-risk-user-type"
            value={filters.userType}
            onChange={(event) => onUserTypeChange(event.target.value as AdminRiskUserType)}
          >
            {userTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown size={17} aria-hidden="true" />
        </span>
      </label>

      <label className={styles.selectBoxWrap} htmlFor="admin-risk-display-range">
        <span className={styles.filterLabel}>표시 범위</span>
        <span className={styles.selectBox}>
          <span className={styles.rangeIcon} aria-hidden="true" />
          <select
            id="admin-risk-display-range"
            value={filters.displayRange}
            onChange={(event) => onDisplayRangeChange(event.target.value as AdminRiskDisplayRange)}
          >
            {displayRangeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown size={17} aria-hidden="true" />
        </span>
      </label>
    </section>
  )
}

function ClimateRiskMapPanel({ riskTypeLabel }: { riskTypeLabel: string }) {
  return (
    <section className={`${styles.card} ${styles.mapCard}`} aria-labelledby="risk-map-title">
      <div className={styles.sectionTitle}>
        <h2 id="risk-map-title">위험 지도 ({riskTypeLabel})</h2>
        <InfoIcon label="위험 지도 설명" />
      </div>

      <div
        className={styles.mapView}
        role="img"
        aria-label={`${riskTypeLabel} 기준 위험 권역은 나성동, 어진동, 보람동, 소담동을 중심으로 표시됩니다.`}
      >
        <div className={styles.mapBase} aria-hidden="true" />

        <RiskLegend />

        {mapHeatZones.map((zone) => (
          <div key={zone.id} className={`${styles.heat} ${styles[zone.className]}`} />
        ))}

        {mapDistrictLabels.map((district) => (
          <span
            key={district.id}
            className={`${styles.mapText} ${styles[district.className]}`}
          >
            {district.label}
          </span>
        ))}

        {mapRiskLabels.map((riskLabel) => (
          <div
            key={riskLabel.id}
            className={`${styles.riskLabel} ${styles[riskLabel.className]} ${
              riskLabel.tone === 'warning' ? styles.warningRiskLabel : ''
            }`}
          >
            <strong>{riskLabel.district}</strong>
            <span>{riskLabel.level}</span>
          </div>
        ))}

        <div className={styles.mapControl} aria-label="지도 확대 축소">
          <button type="button" aria-label="확대">
            <Plus size={20} aria-hidden="true" />
          </button>
          <button type="button" aria-label="축소">
            <Minus size={20} aria-hidden="true" />
          </button>
          <button type="button" aria-label="전체 화면">
            <Maximize size={18} aria-hidden="true" />
          </button>
        </div>

        <div className={styles.scale} aria-hidden="true">
          <span />
          <p>0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;250&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;500&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;750m</p>
        </div>
      </div>
    </section>
  )
}

function RiskLegend() {
  const legendLevels: RiskLevel[] = ['VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW', 'VERY_LOW']

  return (
    <div className={styles.levelLegend}>
      <p>위험 수준</p>
      {legendLevels.map((level) => (
        <div key={level}>
          <i className={legendToneClass[level]} aria-hidden="true" />
          {riskLevelLabels[level]}
        </div>
      ))}
    </div>
  )
}

function SummaryStatCard({ stat }: { stat: RiskSummaryStat }) {
  const Icon = stat.icon

  return (
    <article className={`${styles.summaryCard} ${styles.card}`}>
      <div>
        <p>
          {stat.title}
          <InfoIcon label={`${stat.title} 설명`} />
        </p>
        <strong className={styles[stat.accent]}>{stat.value}</strong>
        <small>
          {stat.trend === 'up' ? (
            <>
              전일 대비 <em className={styles.upTrend}>↑ 3점</em>
            </>
          ) : (
            stat.comparison
          )}
        </small>
      </div>

      <div className={`${styles.summaryIcon} ${styles[stat.accent]}`} aria-hidden="true">
        <Icon size={34} strokeWidth={2.1} />
      </div>
    </article>
  )
}

function TimeRiskChartPanel() {
  const plotHeight = chartPlot.bottom - chartPlot.top
  const chartPoints = timeRiskPoints.map((point, index) => {
    const x = chartPlot.xStart + index * chartPlot.xStep
    const riskY = chartPlot.bottom - (point.riskIndex / 100) * plotHeight
    const barHeight = (point.recommendationCount / chartPlot.maxCount) * plotHeight
    const barY = chartPlot.bottom - barHeight

    return { ...point, x, riskY, barHeight, barY }
  })

  return (
    <section className={`${styles.chartCard} ${styles.card}`} aria-labelledby="time-risk-title">
      <div className={styles.sectionTitle}>
        <h2 id="time-risk-title">시간대별 위험지수</h2>
        <InfoIcon label="시간대별 위험지수 설명" />
      </div>

      <div className={styles.chartLegend}>
        <span className={styles.lineLegend} aria-hidden="true" />
        위험지수(0~100)
        <span className={styles.barLegend} aria-hidden="true" />
        추천 건수(건)
      </div>

      <div className={styles.chartBox}>
        <svg
          viewBox="0 0 430 280"
          className={styles.chartSvg}
          role="img"
          aria-label="시간대별 위험지수는 00시 45, 03시 52, 06시 68, 09시 82, 12시 94, 15시 88, 18시 72, 21시 56입니다."
        >
          <line
            x1={chartPlot.left}
            y1={chartPlot.top}
            x2={chartPlot.left}
            y2={chartPlot.bottom}
            className={styles.axis}
          />
          <line
            x1={chartPlot.left}
            y1={chartPlot.bottom}
            x2={chartPlot.right}
            y2={chartPlot.bottom}
            className={styles.axis}
          />

          {[30, 79, 128, 177, 225].map((y) => (
            <line key={y} x1="45" y1={y} x2="390" y2={y} className={styles.gridLine} />
          ))}

          {chartPoints.map((point) => (
            <rect
              key={point.time}
              x={point.x - 8}
              y={point.barY}
              width="17"
              height={point.barHeight}
              rx="3"
              className={styles.bar}
            />
          ))}

          <polyline
            points={chartPoints.map((point) => `${point.x},${point.riskY}`).join(' ')}
            className={styles.lineGraph}
          />

          {chartPoints.map((point) => (
            <g key={`${point.time}-point`}>
              <circle cx={point.x} cy={point.riskY} r="5" className={styles.dot} />
              <text
                x={point.x - 9}
                y={point.riskY - 13}
                className={point.riskIndex === 94 ? styles.dangerText : styles.chartText}
              >
                {point.riskIndex}
              </text>
            </g>
          ))}

          {chartPoints.map((point) => (
            <text key={`${point.time}-label`} x={point.x - 10} y="253" className={styles.xText}>
              {point.time}
            </text>
          ))}

          <text x="12" y="34" className={styles.yText}>
            100
          </text>
          <text x="20" y="84" className={styles.yText}>
            75
          </text>
          <text x="20" y="133" className={styles.yText}>
            50
          </text>
          <text x="20" y="182" className={styles.yText}>
            25
          </text>
          <text x="28" y="229" className={styles.yText}>
            0
          </text>

          <text x="393" y="34" className={styles.yText}>
            1,200
          </text>
          <text x="402" y="97" className={styles.yText}>
            900
          </text>
          <text x="402" y="160" className={styles.yText}>
            600
          </text>
          <text x="410" y="229" className={styles.yText}>
            0
          </text>
        </svg>
      </div>
    </section>
  )
}

function RiskRatioPanel({ riskTypeLabel }: { riskTypeLabel: string }) {
  return (
    <section className={`${styles.donutCard} ${styles.card}`} aria-labelledby="risk-ratio-title">
      <div className={styles.sectionTitle}>
        <h2 id="risk-ratio-title">위험 유형 비율 ({riskTypeLabel} 기준)</h2>
        <InfoIcon label="위험 유형 비율 설명" />
      </div>

      <div className={styles.donutLayout}>
        <div
          className={styles.donutChart}
          role="img"
          aria-label="위험 유형 비율은 매우 높음 32%, 높음 36%, 보통 22%, 낮음 10%입니다."
        />

        <div className={styles.donutLegend}>
          {riskRatioSegments.map((segment) => (
            <RatioLegendItem key={segment.label} segment={segment} />
          ))}
        </div>
      </div>

      <div className={styles.totalBox}>
        합계 <strong>3,514건</strong>
      </div>
    </section>
  )
}

function RatioLegendItem({ segment }: { segment: RiskRatioSegment }) {
  return (
    <div>
      <i className={styles[`${segment.color}Dot`]} aria-hidden="true" />
      <p>
        <strong>{segment.label}</strong>
        <span>
          {segment.percentage}% ({segment.count})
        </span>
      </p>
    </div>
  )
}

type TopRiskAreasTableProps = {
  riskTypeLabel: string
  downloadMessage: string
  onDownload: () => void
}

function TopRiskAreasTable({
  riskTypeLabel,
  downloadMessage,
  onDownload,
}: TopRiskAreasTableProps) {
  return (
    <section className={`${styles.riskTableCard} ${styles.card}`} aria-labelledby="risk-top-title">
      <div className={styles.tableHeader}>
        <div>
          <div className={styles.sectionTitle}>
            <h2 id="risk-top-title">위험 권역 TOP 5 ({riskTypeLabel} 기준)</h2>
            <InfoIcon label="위험 권역 TOP 5 설명" />
          </div>
          {downloadMessage ? (
            <p className={styles.downloadMessage} role="status">
              {downloadMessage}
            </p>
          ) : null}
        </div>

        <button type="button" className={styles.downloadButton} onClick={onDownload}>
          <Download size={17} aria-hidden="true" />
          전체 다운로드
        </button>
      </div>

      <div className={styles.tableScroll}>
        <table>
          <thead>
            <tr>
              <th scope="col">순위</th>
              <th scope="col">권역</th>
              <th scope="col">위험 유형</th>
              <th scope="col">위험 지수</th>
              <th scope="col">추천 건수</th>
              <th scope="col">전일 대비</th>
            </tr>
          </thead>

          <tbody>
            {climateRiskAreas.map((area) => (
              <tr key={area.id}>
                <td>{area.rank}</td>
                <td>{area.district}</td>
                <td>
                  <span className={styles.riskTypeCell}>
                    <span className={`${styles.riskDot} ${riskToneClass[area.riskLevel]}`} />
                    {area.riskLabel}
                  </span>
                </td>
                <td>
                  <strong
                    className={`${styles.scoreBadge} ${
                      area.riskIndex >= 85 ? styles.dangerScore : ''
                    }`}
                  >
                    {area.riskIndex}
                  </strong>
                </td>
                <td>{area.recommendationCount}</td>
                <td className={area.trend === 'up' ? styles.up : styles.down}>
                  {area.trend === 'up' ? '↑' : '↓'} {area.dailyChangePct}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function InfoIcon({ label }: { label: string }) {
  return (
    <span className={styles.infoIcon} aria-label={label}>
      <Info size={15} strokeWidth={2.4} aria-hidden="true" />
    </span>
  )
}
