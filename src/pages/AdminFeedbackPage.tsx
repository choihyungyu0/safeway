import { useState } from 'react'
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  House,
  Info,
  MapPinned,
  MessageSquare,
  Mountain,
  Navigation,
  RefreshCw,
  Route,
  ShieldCheck,
  Star,
  ThumbsUp,
  Umbrella,
  User,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SejongAdminShell as AdminLayout } from '@/shared/ui/SejongAdminShell'
import {
  defaultFeedbackFilter,
  feedbackPageSizeOptions,
  feedbackPeriodOptions,
  feedbackRouteTypeOptions,
  feedbackUserTypeOptions,
} from '@/features/admin/feedback.constants'
import type {
  FeedbackFilter,
  FeedbackMetricIcon,
  FeedbackSummaryMetric,
  RecentFeedbackItem,
  RiskDistributionSegment,
  RouteFeedbackIcon,
  RouteSatisfactionPoint,
} from '@/features/admin/feedback.types'
import {
  feedbackKeywords,
  feedbackSummaryMetrics,
  recentFeedbackItems,
  riskDistributionSegments,
  routeSatisfactionPoints,
  satisfactionTrendPoints,
} from '@/mocks/fixtures/adminFeedback'
import styles from '@/pages/AdminFeedbackPage.module.css'

const metricIconMap = {
  message: MessageSquare,
  star: Star,
  thumbsUp: ThumbsUp,
  shelter: House,
} satisfies Record<FeedbackMetricIcon, LucideIcon>

const routeIconMap = {
  recommended: Navigation,
  shortest: MapPinned,
  safe: ShieldCheck,
  shade: Umbrella,
  slope: Mountain,
} satisfies Record<RouteFeedbackIcon, LucideIcon>

const trendChartPlot = {
  top: 25,
  bottom: 255,
  left: 45,
  right: 590,
  xStart: 68,
  xStep: 36,
  maxResponseCount: 1200,
  minSatisfaction: 1,
  maxSatisfaction: 5,
}

const riskColorClass: Record<RiskDistributionSegment['color'], string> = {
  teal: styles.tealDot,
  blue: styles.blueDot,
  orange: styles.orangeDot,
  red: styles.redDot,
}

export function AdminFeedbackPage() {
  const [filters, setFilters] = useState<FeedbackFilter>(defaultFeedbackFilter)
  const [statusMessage, setStatusMessage] = useState('')
  const [activePage, setActivePage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const updateFilter = <Key extends keyof FeedbackFilter>(
    key: Key,
    value: FeedbackFilter[Key],
  ) => {
    setFilters((current) => ({ ...current, [key]: value }))
    setStatusMessage('')
  }

  const resetFilters = () => {
    setFilters(defaultFeedbackFilter)
    setActivePage(1)
    setStatusMessage('필터가 초기화되었습니다.')
  }

  return (
    <AdminLayout headerSubtitle="세종특별자치시 공공데이터 기반 운영현황">
      <section className={styles.page} aria-labelledby="admin-feedback-title">
        <header className={styles.pageTitle}>
          <h1 id="admin-feedback-title">사용자 피드백 분석</h1>
          <p>시민 의견과 만족도 기반 서비스 개선 현황</p>
        </header>

        <FeedbackFilterBar
          filters={filters}
          onFilterChange={updateFilter}
          onReset={resetFilters}
        />

        {statusMessage ? (
          <p className={styles.statusMessage} role="status">
            {statusMessage}
          </p>
        ) : null}

        <section className={styles.statGrid} aria-label="피드백 요약 지표">
          {feedbackSummaryMetrics.map((metric) => (
            <FeedbackStatCard key={metric.id} metric={metric} />
          ))}
        </section>

        <section className={styles.analysisGrid} aria-label="피드백 분석 차트">
          <SatisfactionTrendChart />
          <RiskDistributionPanel />
          <RouteSatisfactionPanel />
          <FeedbackKeywordPanel
            onShowAll={() =>
              setStatusMessage('전체 키워드 분석 화면은 데모 준비 중입니다.')
            }
          />
        </section>

        <RecentFeedbackTable
          activePage={activePage}
          pageSize={pageSize}
          onPageChange={setActivePage}
          onPageSizeChange={setPageSize}
          onShowAll={() => setStatusMessage('전체 피드백 목록은 데모 준비 중입니다.')}
        />
      </section>
    </AdminLayout>
  )
}

type FilterBarProps = {
  filters: FeedbackFilter
  onFilterChange: <Key extends keyof FeedbackFilter>(
    key: Key,
    value: FeedbackFilter[Key],
  ) => void
  onReset: () => void
}

function FeedbackFilterBar({ filters, onFilterChange, onReset }: FilterBarProps) {
  return (
    <section className={styles.filterPanel} aria-label="피드백 조회 조건">
      <FilterSelect
        id="feedback-period"
        icon={Calendar}
        label="기간"
        value={filters.period}
        options={feedbackPeriodOptions}
        onChange={(value) => onFilterChange('period', value)}
      />

      <FilterSelect
        id="feedback-user-type"
        icon={User}
        label="사용자 유형"
        value={filters.userType}
        options={feedbackUserTypeOptions}
        onChange={(value) => onFilterChange('userType', value)}
      />

      <FilterSelect
        id="feedback-route-type"
        icon={Route}
        label="경로 유형"
        value={filters.routeType}
        options={feedbackRouteTypeOptions}
        onChange={(value) => onFilterChange('routeType', value)}
      />

      <button type="button" className={styles.resetButton} onClick={onReset}>
        <RefreshCw size={17} strokeWidth={2.2} aria-hidden="true" />
        필터 초기화
      </button>
    </section>
  )
}

type FilterSelectProps = {
  id: string
  icon: LucideIcon
  label: string
  value: string
  options: readonly string[]
  onChange: (value: string) => void
}

function FilterSelect({ id, icon: Icon, label, value, options, onChange }: FilterSelectProps) {
  return (
    <label className={styles.filterBox} htmlFor={id}>
      <span className={styles.filterLabel}>
        <Icon size={17} strokeWidth={2.1} aria-hidden="true" />
        <strong>{label}</strong>
      </span>

      <span className={styles.filterDivider} aria-hidden="true" />

      <span className={styles.selectShell}>
        <select
          id={id}
          value={value}
          aria-label={label}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown size={17} strokeWidth={2.1} aria-hidden="true" />
      </span>
    </label>
  )
}

function FeedbackStatCard({ metric }: { metric: FeedbackSummaryMetric }) {
  const Icon = metricIconMap[metric.icon]

  return (
    <article className={styles.statCard}>
      <div>
        <p>{metric.title}</p>
        <strong className={styles[metric.accent]}>{metric.value}</strong>
        <small>
          전일 대비
          <em className={metric.trend === 'up' ? styles.up : styles.down}>
            {metric.trend === 'up' ? '↑' : '↓'} {metric.comparison}
          </em>
        </small>
      </div>

      <div className={`${styles.statIcon} ${styles[metric.accent]}`} aria-hidden="true">
        <Icon size={34} strokeWidth={2.1} />
      </div>
    </article>
  )
}

function SatisfactionTrendChart() {
  const plotHeight = trendChartPlot.bottom - trendChartPlot.top

  const points = satisfactionTrendPoints.map((point, index) => {
    const x = trendChartPlot.xStart + trendChartPlot.xStep * index
    const satisfactionY =
      trendChartPlot.bottom -
      ((point.satisfaction - trendChartPlot.minSatisfaction) /
        (trendChartPlot.maxSatisfaction - trendChartPlot.minSatisfaction)) *
        plotHeight
    const barHeight =
      (point.responseCount / trendChartPlot.maxResponseCount) * plotHeight
    const barY = trendChartPlot.bottom - barHeight

    return { ...point, x, satisfactionY, barHeight, barY }
  })

  return (
    <section className={`${styles.card} ${styles.trendCard}`} aria-labelledby="trend-title">
      <div className={styles.cardTitle}>
        <h2 id="trend-title">만족도 추이</h2>
        <InfoIcon label="만족도 추이 설명" />
      </div>

      <p className={styles.visuallyHidden}>
        최근 30일 동안 평균 만족도는 4.2점에서 4.6점으로 상승했습니다.
      </p>

      <div className={styles.chartLegend} aria-hidden="true">
        <span className={styles.lineMark} />
        평균 만족도(점)
        <span className={styles.barMark} />
        응답 건수(건)
      </div>

      <div className={styles.trendChart}>
        <svg
          viewBox="0 0 660 330"
          className={styles.trendSvg}
          role="img"
          aria-label="최근 30일 평균 만족도는 4.2점에서 4.6점으로 상승했고 응답 건수는 560건에서 820건으로 증가했습니다."
        >
          <line
            x1={trendChartPlot.left}
            y1={trendChartPlot.top}
            x2={trendChartPlot.left}
            y2={trendChartPlot.bottom}
            className={styles.axis}
          />
          <line
            x1={trendChartPlot.left}
            y1={trendChartPlot.bottom}
            x2={trendChartPlot.right}
            y2={trendChartPlot.bottom}
            className={styles.axis}
          />

          {[25, 82, 139, 196, 255].map((y) => (
            <line
              key={y}
              x1={trendChartPlot.left}
              y1={y}
              x2={trendChartPlot.right}
              y2={y}
              className={styles.gridLine}
            />
          ))}

          {points.map((point) => (
            <rect
              key={`${point.date}-bar`}
              x={point.x - 8}
              y={point.barY}
              width="16"
              height={point.barHeight}
              rx="3"
              className={styles.barRect}
            />
          ))}

          <polyline
            points={points.map((point) => `${point.x},${point.satisfactionY}`).join(' ')}
            className={styles.lineGraph}
          />

          {points.map((point) => (
            <g key={`${point.date}-point`}>
              <circle cx={point.x} cy={point.satisfactionY} r="5" className={styles.lineDot} />
              <text x={point.x - 11} y={point.satisfactionY - 14} className={styles.chartText}>
                {point.satisfaction.toFixed(1)}
              </text>
            </g>
          ))}

          {points.map((point) => (
            <text
              key={`${point.date}-label`}
              x={point.x - 8}
              y="292"
              className={styles.xText}
              transform={`rotate(-45 ${point.x - 8} 292)`}
            >
              {point.date}
            </text>
          ))}

          {[5, 4, 3, 2, 1].map((score) => {
            const y =
              trendChartPlot.bottom -
              ((score - trendChartPlot.minSatisfaction) /
                (trendChartPlot.maxSatisfaction - trendChartPlot.minSatisfaction)) *
                plotHeight

            return (
              <text key={score} x="16" y={y + 4} className={styles.yText}>
                {score}
              </text>
            )
          })}

          {[
            { value: 1200, y: 30, x: 604 },
            { value: 900, y: 88, x: 612 },
            { value: 600, y: 146, x: 612 },
            { value: 300, y: 204, x: 612 },
            { value: 0, y: 259, x: 625 },
          ].map((label) => (
            <text key={label.value} x={label.x} y={label.y} className={styles.yText}>
              {label.value.toLocaleString('ko-KR')}
            </text>
          ))}
        </svg>
      </div>
    </section>
  )
}

function RiskDistributionPanel() {
  return (
    <section className={`${styles.card} ${styles.riskCard}`} aria-labelledby="risk-title">
      <div className={styles.cardTitle}>
        <h2 id="risk-title">체감 위험도 분포</h2>
        <InfoIcon label="체감 위험도 분포 설명" />
      </div>

      <p className={styles.visuallyHidden}>
        체감 위험도는 높음 40%, 보통 31%, 매우 높음 19%, 낮음 10%로 분포합니다.
      </p>

      <div className={styles.donutLayout}>
        <div
          className={styles.riskDonut}
          role="img"
          aria-label="낮음 10%, 보통 31%, 높음 40%, 매우 높음 19%"
        />

        <div className={styles.riskLegend}>
          {riskDistributionSegments.map((segment) => (
            <div key={segment.label}>
              <i className={riskColorClass[segment.color]} aria-hidden="true" />
              <p>
                <strong>{segment.label}</strong>
                <span>
                  {segment.percentage}% ({segment.count.toLocaleString('ko-KR')}건)
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.totalBox}>
        합계 <strong>1,248건</strong>
      </div>
    </section>
  )
}

function RouteSatisfactionPanel() {
  return (
    <section className={`${styles.card} ${styles.routeCard}`} aria-labelledby="route-title">
      <div className={`${styles.cardTitle} ${styles.between}`}>
        <div className={styles.titleWithInfo}>
          <h2 id="route-title">경로 유형별 만족도</h2>
          <InfoIcon label="경로 유형별 만족도 설명" />
        </div>

        <button type="button" className={styles.titleSelectButton}>
          평균 만족도
          <ChevronDown size={16} strokeWidth={2.1} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.routeBarChart} aria-label="경로 유형별 평균 만족도">
        {routeSatisfactionPoints.map((point) => (
          <RouteSatisfactionBar key={point.routeType} point={point} />
        ))}
      </div>
    </section>
  )
}

function RouteSatisfactionBar({ point }: { point: RouteSatisfactionPoint }) {
  const Icon = routeIconMap[point.icon]

  return (
    <article className={styles.routeBarItem}>
      <strong>{point.score.toFixed(1)}</strong>
      <div className={styles.routeBar} aria-hidden="true">
        <span style={{ height: `${(point.score / 5) * 150}px` }} />
      </div>
      <Icon size={18} strokeWidth={2.1} aria-hidden="true" />
      <p>{point.routeType}</p>
    </article>
  )
}

function FeedbackKeywordPanel({ onShowAll }: { onShowAll: () => void }) {
  return (
    <section className={`${styles.card} ${styles.keywordCard}`} aria-labelledby="keyword-title">
      <div className={`${styles.cardTitle} ${styles.between}`}>
        <div className={styles.titleWithInfo}>
          <h2 id="keyword-title">자주 언급된 피드백 키워드</h2>
          <InfoIcon label="자주 언급된 피드백 키워드 설명" />
        </div>

        <button type="button" className={styles.textLinkButton} onClick={onShowAll}>
          전체보기
          <ChevronRight size={16} strokeWidth={2.1} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.keywordList}>
        {feedbackKeywords.map((keyword) => (
          <span key={keyword.keyword}>
            {keyword.keyword}
            <strong>{keyword.count}</strong>
          </span>
        ))}
      </div>
    </section>
  )
}

type RecentFeedbackTableProps = {
  activePage: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onShowAll: () => void
}

function RecentFeedbackTable({
  activePage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onShowAll,
}: RecentFeedbackTableProps) {
  return (
    <section className={`${styles.card} ${styles.feedbackTableCard}`} aria-labelledby="recent-title">
      <div className={`${styles.cardTitle} ${styles.between} ${styles.tableTitle}`}>
        <div className={styles.titleWithInfo}>
          <h2 id="recent-title">최근 피드백</h2>
          <InfoIcon label="최근 피드백 설명" />
        </div>

        <button type="button" className={styles.textLinkButton} onClick={onShowAll}>
          전체보기
          <ChevronRight size={16} strokeWidth={2.1} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.tableScroll}>
        <table>
          <thead>
            <tr>
              <th scope="col">접수일시</th>
              <th scope="col">경로 유형</th>
              <th scope="col">만족도</th>
              <th scope="col">체감 위험도</th>
              <th scope="col">의견 요약</th>
              <th scope="col">조치상태</th>
            </tr>
          </thead>

          <tbody>
            {recentFeedbackItems.map((item) => (
              <FeedbackTableRow key={item.id} item={item} />
            ))}
          </tbody>
        </table>
      </div>

      <AdminPagination
        activePage={activePage}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </section>
  )
}

function FeedbackTableRow({ item }: { item: RecentFeedbackItem }) {
  const Icon = routeIconMap[item.routeIcon]

  return (
    <tr>
      <td>{item.receivedAt}</td>
      <td>
        <span className={styles.routeTypeCell}>
          <Icon size={16} strokeWidth={2.1} aria-hidden="true" />
          {item.routeType}
        </span>
      </td>
      <td>
        <span className={styles.satisfactionCell}>
          <Star size={15} fill="currentColor" strokeWidth={2.1} aria-hidden="true" />
          {item.satisfaction}
        </span>
      </td>
      <td>
        <span className={`${styles.riskBadge} ${styles[item.perceivedRiskTone]}`}>
          {item.perceivedRiskLevel} {item.perceivedRiskLabel}
        </span>
      </td>
      <td className={styles.summaryCell}>{item.summary}</td>
      <td>
        <span className={`${styles.statusBadge} ${styles[item.statusTone]}`}>{item.status}</span>
      </td>
    </tr>
  )
}

type AdminPaginationProps = {
  activePage: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

function AdminPagination({
  activePage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: AdminPaginationProps) {
  const pageNumbers = [1, 2, 3, 4, 5]

  return (
    <div className={styles.tableFooter}>
      <p>전체 1,248건</p>

      <div className={styles.pagination} aria-label="피드백 페이지">
        <button
          type="button"
          aria-label="이전 페이지"
          onClick={() => onPageChange(Math.max(1, activePage - 1))}
        >
          <ChevronLeft size={16} strokeWidth={2.2} aria-hidden="true" />
        </button>

        {pageNumbers.map((page) => (
          <button
            key={page}
            type="button"
            className={activePage === page ? styles.activePageButton : undefined}
            aria-current={activePage === page ? 'page' : undefined}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        <span aria-hidden="true">...</span>

        <button
          type="button"
          className={activePage === 125 ? styles.activePageButton : undefined}
          aria-current={activePage === 125 ? 'page' : undefined}
          onClick={() => onPageChange(125)}
        >
          125
        </button>

        <button
          type="button"
          aria-label="다음 페이지"
          onClick={() => onPageChange(Math.min(125, activePage + 1))}
        >
          <ChevronRight size={16} strokeWidth={2.2} aria-hidden="true" />
        </button>
      </div>

      <label className={styles.pageSizeSelect} htmlFor="feedback-page-size">
        <span className={styles.visuallyHidden}>페이지당 표시 개수</span>
        <select
          id="feedback-page-size"
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
        >
          {feedbackPageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}개씩 보기
            </option>
          ))}
        </select>
        <ChevronDown size={16} strokeWidth={2.1} aria-hidden="true" />
      </label>
    </div>
  )
}

function InfoIcon({ label }: { label: string }) {
  return (
    <span className={styles.infoIcon} aria-label={label}>
      <Info size={15} strokeWidth={2.4} aria-hidden="true" />
    </span>
  )
}
