import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  Bell,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Info,
  MapPin,
  RefreshCw,
  Route,
  Search,
  User,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SejongAdminShell as AdminLayout } from '@/shared/ui/SejongAdminShell'
import {
  defaultRecommendationLogFilter,
  recommendationLogDestinationOptions,
  recommendationLogPageSizeOptions,
  recommendationLogPeriodOptions,
  recommendationLogRouteTypeOptions,
  recommendationLogStartPlaceOptions,
  recommendationLogSummaryMetrics,
  recommendationLogUserTypeOptions,
} from '@/features/admin/recommendationLog.constants'
import type {
  AbnormalPatternAlert,
  RecommendationLogFilter,
  RecommendationLogItem,
  RecommendationLogSummaryMetric,
  RecommendationRouteTypeRatio,
} from '@/features/admin/recommendationLog.types'
import {
  abnormalPatternAlerts,
  recommendationLogItems,
  recommendationRouteTypeRatios,
} from '@/mocks/fixtures/adminRecommendationLogs'
import styles from '@/pages/AdminRecommendationLogPage.module.css'

type StatusMessage = {
  id: number
  text: string
}

type FilterKey = keyof RecommendationLogFilter

const totalRecommendationCount = '8,572'
const totalRecommendationLabel = '8,572건'

export function AdminRecommendationLogPage() {
  const [filters, setFilters] = useState<RecommendationLogFilter>(defaultRecommendationLogFilter)
  const [appliedFilters, setAppliedFilters] =
    useState<RecommendationLogFilter>(defaultRecommendationLogFilter)
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null)
  const [selectedLog, setSelectedLog] = useState<RecommendationLogItem | null>(null)
  const [lastAnalyzedLogId, setLastAnalyzedLogId] = useState<string | null>(null)
  const [activePage, setActivePage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filteredLogs = useMemo(
    () => filterRecommendationLogs(recommendationLogItems, appliedFilters),
    [appliedFilters],
  )
  const visibleLogs = filteredLogs.slice(0, pageSize)

  const announce = (text: string) => {
    setStatusMessage({ id: Date.now(), text })
  }

  const updateFilter = <Key extends FilterKey>(key: Key, value: RecommendationLogFilter[Key]) => {
    setFilters((current) => ({ ...current, [key]: value }))
  }

  const applyFilters = () => {
    setAppliedFilters(filters)
    setActivePage(1)
    announce('추천 로그를 조회했습니다.')
  }

  const downloadCsv = () => {
    if (visibleLogs.length === 0 || typeof URL.createObjectURL !== 'function') {
      announce('CSV 다운로드는 데모 준비 중입니다.')
      return
    }

    const csv = createRecommendationLogCsv(visibleLogs)
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'sejong-safeway-recommendation-logs.csv'
    anchor.click()
    URL.revokeObjectURL(url)
    announce('CSV 다운로드 파일을 생성했습니다.')
  }

  const reanalyzeLog = (logId: string) => {
    setLastAnalyzedLogId(logId)
    announce('해당 추천 로그를 재분석했습니다.')
  }

  const updatePageSize = (nextPageSize: number) => {
    setPageSize(nextPageSize)
    setActivePage(1)
  }

  useEffect(() => {
    if (!selectedLog) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedLog(null)
      }
    }

    window.addEventListener('keydown', closeOnEscape)

    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [selectedLog])

  return (
    <AdminLayout headerSubtitle="세종특별자치시 공공데이터 기반 운영현황">
      <section className={styles.page} aria-labelledby="recommendation-log-title">
        <header className={styles.pageTitle}>
          <h1 id="recommendation-log-title">추천 로그 관리</h1>
          <p>시민 경로 추천 이력 및 선택 패턴 조회</p>
        </header>

        <RecommendationLogFilterPanel
          filters={filters}
          onFilterChange={updateFilter}
          onSearch={applyFilters}
          onDownloadCsv={downloadCsv}
        />

        {statusMessage ? (
          <p key={statusMessage.id} className={styles.statusMessage} role="status">
            {statusMessage.text}
          </p>
        ) : null}

        <section className={styles.overviewGrid} aria-label="추천 로그 요약">
          <section className={styles.statGrid} aria-label="추천 로그 주요 지표">
            {recommendationLogSummaryMetrics.map((metric) => (
              <RecommendationLogStatCard key={metric.id} metric={metric} />
            ))}
          </section>

          <RouteTypeRatioPanel ratios={recommendationRouteTypeRatios} />

          <AbnormalPatternAlertPanel
            alerts={abnormalPatternAlerts}
            onAlertDetail={() => announce('이상 패턴 상세 화면은 데모 준비 중입니다.')}
            onShowAll={() => announce('전체 이상 패턴 알림 화면은 데모 준비 중입니다.')}
          />
        </section>

        <RecommendationLogTable
          logs={visibleLogs}
          activePage={activePage}
          pageSize={pageSize}
          lastAnalyzedLogId={lastAnalyzedLogId}
          onPageChange={setActivePage}
          onPageSizeChange={updatePageSize}
          onShowDetail={setSelectedLog}
          onReanalyze={reanalyzeLog}
        />
      </section>

      {selectedLog ? (
        <RecommendationLogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />
      ) : null}
    </AdminLayout>
  )
}

type FilterPanelProps = {
  filters: RecommendationLogFilter
  onFilterChange: <Key extends FilterKey>(key: Key, value: RecommendationLogFilter[Key]) => void
  onSearch: () => void
  onDownloadCsv: () => void
}

function RecommendationLogFilterPanel({
  filters,
  onFilterChange,
  onSearch,
  onDownloadCsv,
}: FilterPanelProps) {
  return (
    <section className={styles.filterPanel} aria-label="추천 로그 조회 조건">
      <FilterSelect
        id="recommendation-log-period"
        icon={Calendar}
        label="기간"
        value={filters.period}
        options={recommendationLogPeriodOptions}
        wide
        onChange={(value) => onFilterChange('period', value)}
      />
      <FilterSelect
        id="recommendation-log-user-type"
        icon={User}
        label="사용자 유형"
        value={filters.userType}
        options={recommendationLogUserTypeOptions}
        onChange={(value) => onFilterChange('userType', value)}
      />
      <FilterSelect
        id="recommendation-log-route-type"
        icon={Route}
        label="경로 유형"
        value={filters.routeType}
        options={recommendationLogRouteTypeOptions}
        wide
        onChange={(value) => onFilterChange('routeType', value)}
      />
      <FilterSelect
        id="recommendation-log-start-place"
        icon={MapPin}
        label="출발지"
        value={filters.startPlace}
        options={recommendationLogStartPlaceOptions}
        onChange={(value) => onFilterChange('startPlace', value)}
      />
      <FilterSelect
        id="recommendation-log-destination"
        icon={MapPin}
        label="목적지"
        value={filters.destination}
        options={recommendationLogDestinationOptions}
        onChange={(value) => onFilterChange('destination', value)}
      />

      <label className={`${styles.controlBox} ${styles.searchBox}`} htmlFor="recommendation-log-search">
        <span className={styles.controlLabel}>
          <Search size={17} strokeWidth={2.2} aria-hidden="true" />
          <strong>검색어</strong>
        </span>
        <span className={styles.controlDivider} aria-hidden="true" />
        <input
          id="recommendation-log-search"
          value={filters.keyword}
          placeholder="출발지, 목적지, 경로명 검색"
          onChange={(event) => onFilterChange('keyword', event.target.value)}
        />
      </label>

      <button type="button" className={styles.searchButton} onClick={onSearch}>
        <Search size={17} strokeWidth={2.4} aria-hidden="true" />
        조회
      </button>
      <button type="button" className={styles.downloadButton} onClick={onDownloadCsv}>
        <Download size={17} strokeWidth={2.2} aria-hidden="true" />
        CSV 다운로드
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
  wide?: boolean
  onChange: (value: string) => void
}

function FilterSelect({
  id,
  icon: Icon,
  label,
  value,
  options,
  wide,
  onChange,
}: FilterSelectProps) {
  return (
    <label className={`${styles.controlBox} ${wide ? styles.wideControl : ''}`} htmlFor={id}>
      <span className={styles.controlLabel}>
        <Icon size={17} strokeWidth={2.2} aria-hidden="true" />
        <strong>{label}</strong>
      </span>
      <span className={styles.controlDivider} aria-hidden="true" />
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

function RecommendationLogStatCard({ metric }: { metric: RecommendationLogSummaryMetric }) {
  const Icon = metric.icon

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

function RouteTypeRatioPanel({ ratios }: { ratios: RecommendationRouteTypeRatio[] }) {
  return (
    <section className={`${styles.card} ${styles.ratioCard}`} aria-labelledby="ratio-title">
      <h2 id="ratio-title">경로 유형별 선택 비율</h2>
      <p className={styles.visuallyHidden}>
        경로 유형별 선택 비율은 세이프웨이 68%, 대중교통 대체경로 19%, 야간 안전경로
        13%입니다.
      </p>

      <div className={styles.ratioContent}>
        <div
          className={styles.donut}
          role="img"
          aria-label="경로 유형별 선택 비율은 세이프웨이 68%, 대중교통 대체경로 19%, 야간 안전경로 13%입니다."
        >
          <div>
            <strong>{totalRecommendationCount}</strong>
            <span>총 추천 건수</span>
          </div>
        </div>

        <div className={styles.ratioLegend}>
          {ratios.map((item) => (
            <article key={item.type}>
              <i className={styles[item.color]} aria-hidden="true" />
              <p>{item.label}</p>
              <strong>
                {item.percentage}%
                <small>{item.count}</small>
              </strong>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

type AlertPanelProps = {
  alerts: AbnormalPatternAlert[]
  onAlertDetail: () => void
  onShowAll: () => void
}

function AbnormalPatternAlertPanel({ alerts, onAlertDetail, onShowAll }: AlertPanelProps) {
  return (
    <aside className={`${styles.card} ${styles.alertPanel}`} aria-labelledby="alerts-title">
      <h2 id="alerts-title">
        <Bell size={18} strokeWidth={2.2} aria-hidden="true" />
        이상 패턴 알림
      </h2>

      <div className={styles.patternList}>
        {alerts.map((alert) => (
          <article className={`${styles.patternItem} ${styles[alert.severity]}`} key={alert.id}>
            <div className={styles.patternTitle}>
              <strong>{alert.title}</strong>
              <span>{alert.badge}</span>
            </div>

            <p>{alert.description}</p>

            <h3>영향 구간</h3>
            <p>{alert.affectedArea}</p>

            <h3>발생 시각</h3>
            <p>{alert.occurredAt}</p>

            <button type="button" onClick={onAlertDetail}>
              상세보기
              <ChevronRight size={15} strokeWidth={2.4} aria-hidden="true" />
            </button>
          </article>
        ))}
      </div>

      <button type="button" className={styles.allAlertButton} onClick={onShowAll}>
        전체 알림 보기
        <ChevronRight size={15} strokeWidth={2.4} aria-hidden="true" />
      </button>
    </aside>
  )
}

type RecommendationLogTableProps = {
  logs: RecommendationLogItem[]
  activePage: number
  pageSize: number
  lastAnalyzedLogId: string | null
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onShowDetail: (log: RecommendationLogItem) => void
  onReanalyze: (logId: string) => void
}

function RecommendationLogTable({
  logs,
  activePage,
  pageSize,
  lastAnalyzedLogId,
  onPageChange,
  onPageSizeChange,
  onShowDetail,
  onReanalyze,
}: RecommendationLogTableProps) {
  return (
    <section className={`${styles.card} ${styles.tableCard}`} aria-labelledby="table-title">
      <div className={styles.tableHeader}>
        <h2 id="table-title">
          추천 로그 목록 <span>총 {totalRecommendationLabel}</span>
        </h2>
      </div>

      <div className={styles.tableScroll}>
        <table>
          <caption>시민 경로 추천 이력 목록</caption>
          <thead>
            <tr>
              <th scope="col">추천일시</th>
              <th scope="col">사용자 유형</th>
              <th scope="col">출발지</th>
              <th scope="col">목적지</th>
              <th scope="col">이동수단</th>
              <th scope="col">추천경로</th>
              <th scope="col">총 소요시간</th>
              <th scope="col">기후안전 점수</th>
              <th scope="col">외부 노출 감소</th>
              <th scope="col">선택 여부</th>
              <th scope="col">상세</th>
            </tr>
          </thead>

          <tbody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr
                  key={log.id}
                  className={lastAnalyzedLogId === log.id ? styles.reanalyzedRow : undefined}
                >
                  <td>{log.recommendedAt}</td>
                  <td>{log.userType}</td>
                  <td>{log.startPlace}</td>
                  <td>{log.destination}</td>
                  <td>{log.transportMode}</td>
                  <td>
                    <span
                      className={`${styles.pathBadge} ${
                        log.routeType === '야간 안전경로' ? styles.night : styles.safe
                      }`}
                    >
                      {log.routeType}
                    </span>
                  </td>
                  <td>{log.durationMin}분</td>
                  <td className={styles.safeScore}>{log.climateSafetyScore}점</td>
                  <td>{log.exposureReductionPct}%</td>
                  <td>
                    <span className={styles.selectBadge}>{log.selected ? '선택' : '미선택'}</span>
                  </td>
                  <td>
                    <div className={styles.tableButtons}>
                      <button type="button" onClick={() => onShowDetail(log)}>
                        <Eye size={13} strokeWidth={2.2} aria-hidden="true" />
                        상세보기
                      </button>
                      <button type="button" onClick={() => onReanalyze(log.id)}>
                        <RefreshCw size={13} strokeWidth={2.2} aria-hidden="true" />
                        재분석
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className={styles.emptyCell} colSpan={11}>
                  검색 결과가 없습니다.
                </td>
              </tr>
            )}
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
      <p>전체 {totalRecommendationLabel}</p>

      <div className={styles.pagination} aria-label="추천 로그 페이지">
        <button
          type="button"
          aria-label="이전 페이지"
          onClick={() => onPageChange(Math.max(1, activePage - 1))}
        >
          <ChevronLeft size={16} strokeWidth={2.3} aria-hidden="true" />
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
          className={activePage === 429 ? styles.activePageButton : undefined}
          aria-current={activePage === 429 ? 'page' : undefined}
          onClick={() => onPageChange(429)}
        >
          429
        </button>

        <button
          type="button"
          aria-label="다음 페이지"
          onClick={() => onPageChange(Math.min(429, activePage + 1))}
        >
          <ChevronRight size={16} strokeWidth={2.3} aria-hidden="true" />
        </button>
      </div>

      <label className={styles.pageSizeSelect} htmlFor="recommendation-log-page-size">
        <span className={styles.visuallyHidden}>페이지당 표시 개수</span>
        <select
          id="recommendation-log-page-size"
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
        >
          {recommendationLogPageSizeOptions.map((size) => (
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

function RecommendationLogDetailModal({
  log,
  onClose,
}: {
  log: RecommendationLogItem
  onClose: () => void
}) {
  const details = [
    ['추천일시', log.recommendedAt],
    ['사용자 유형', log.userType],
    ['출발지', log.startPlace],
    ['목적지', log.destination],
    ['이동수단', log.transportMode],
    ['추천경로', log.routeType],
    ['총 소요시간', `${log.durationMin}분`],
    ['기후안전 점수', `${log.climateSafetyScore}점`],
    ['외부 노출 감소', `${log.exposureReductionPct}%`],
    ['선택 여부', log.selected ? '선택' : '미선택'],
  ] as const

  return (
    <div className={styles.modalBackdrop}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="recommendation-log-detail-title"
      >
        <div className={styles.modalHeader}>
          <div>
            <p>추천 로그 상세</p>
            <h2 id="recommendation-log-detail-title">{log.recommendedAt}</h2>
          </div>
          <button type="button" onClick={onClose}>
            닫기
          </button>
        </div>

        <dl className={styles.detailGrid}>
          {details.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        <article className={styles.reasonBox}>
          <div aria-hidden="true">
            {log.routeType === '야간 안전경로' ? (
              <AlertTriangle size={21} strokeWidth={2.2} />
            ) : (
              <Info size={21} strokeWidth={2.2} />
            )}
          </div>
          <div>
            <h3>추천 사유</h3>
            <p>{log.reason}</p>
          </div>
        </article>
      </section>
    </div>
  )
}

function filterRecommendationLogs(
  logs: RecommendationLogItem[],
  filters: RecommendationLogFilter,
) {
  const keyword = filters.keyword.trim().toLowerCase()

  return logs.filter((log) => {
    const matchesUserType = filters.userType === '전체' || log.userType === filters.userType
    const matchesRouteType = filters.routeType === '전체' || log.routeType === filters.routeType
    const matchesStart = filters.startPlace === '전체' || log.startPlace === filters.startPlace
    const matchesDestination =
      filters.destination === '전체' || log.destination === filters.destination
    const matchesKeyword =
      keyword.length === 0 ||
      [log.startPlace, log.destination, log.routeType].some((value) =>
        value.toLowerCase().includes(keyword),
      )

    return (
      matchesUserType &&
      matchesRouteType &&
      matchesStart &&
      matchesDestination &&
      matchesKeyword
    )
  })
}

function createRecommendationLogCsv(logs: RecommendationLogItem[]) {
  const header = [
    '추천일시',
    '사용자 유형',
    '출발지',
    '목적지',
    '이동수단',
    '추천경로',
    '총 소요시간',
    '기후안전 점수',
    '외부 노출 감소',
    '선택 여부',
  ]

  const rows = logs.map((log) => [
    log.recommendedAt,
    log.userType,
    log.startPlace,
    log.destination,
    log.transportMode,
    log.routeType,
    `${log.durationMin}분`,
    `${log.climateSafetyScore}점`,
    `${log.exposureReductionPct}%`,
    log.selected ? '선택' : '미선택',
  ])

  return [header, ...rows]
    .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(','))
    .join('\r\n')
}
