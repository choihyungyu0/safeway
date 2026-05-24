import { useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Search,
} from 'lucide-react'
import { SejongAdminShell as AdminLayout } from '@/shared/ui/SejongAdminShell'
import {
  defaultPublicDataFilter,
  publicDataCycleFilterOptions,
  publicDataPageSizeOptions,
  publicDataStatusFilterOptions,
  publicDataStatusLabels,
  publicDataTypeFilterOptions,
} from '@/features/admin/publicData.constants'
import type {
  DataAlertLog,
  DataQualityMetric,
  PublicDataFilterState,
  PublicDataStatus,
  PublicDataSummaryMetric,
  PublicDataset,
} from '@/features/admin/publicData.types'
import {
  publicDataAlertLogs,
  publicDataQualityMetrics,
  publicDataSummaryMetrics,
  publicDatasets,
} from '@/mocks/fixtures/adminPublicData'
import styles from '@/pages/AdminPublicDataPage.module.css'

type SortDirection = 'none' | 'asc' | 'desc'

type StatusMessage = {
  id: number
  text: string
}

const statusClassName: Record<PublicDataStatus, string> = {
  NORMAL: 'normal',
  DELAYED: 'delay',
  NEEDS_CHECK: 'check',
  ERROR: 'error',
}

export function AdminPublicDataPage() {
  const [filters, setFilters] = useState<PublicDataFilterState>(defaultPublicDataFilter)
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('none')
  const [activePage, setActivePage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filteredDatasets = useMemo(() => {
    const searchTerm = filters.searchTerm.trim().toLowerCase()

    const rows = publicDatasets.filter((dataset) => {
      const matchesType =
        filters.datasetType === 'ALL' || dataset.type === filters.datasetType
      const matchesStatus = filters.status === 'ALL' || dataset.status === filters.status
      const matchesCycle =
        filters.collectionCycle === 'ALL' ||
        dataset.collectionCycle === filters.collectionCycle
      const matchesSearch =
        searchTerm.length === 0 || dataset.name.toLowerCase().includes(searchTerm)

      return matchesType && matchesStatus && matchesCycle && matchesSearch
    })

    if (sortDirection === 'none') {
      return rows
    }

    return [...rows].sort((a, b) =>
      sortDirection === 'asc'
        ? a.lastCollectedAt.localeCompare(b.lastCollectedAt)
        : b.lastCollectedAt.localeCompare(a.lastCollectedAt),
    )
  }, [filters, sortDirection])

  const totalPages = Math.max(1, Math.ceil(filteredDatasets.length / pageSize))
  const normalizedActivePage = Math.min(activePage, totalPages)
  const firstIndex = (normalizedActivePage - 1) * pageSize
  const visibleDatasets = filteredDatasets.slice(firstIndex, firstIndex + pageSize)

  const announce = (text: string) => {
    setStatusMessage({ id: Date.now(), text })
  }

  const updateFilter = <Key extends keyof PublicDataFilterState>(
    key: Key,
    value: PublicDataFilterState[Key],
  ) => {
    setFilters((current) => ({ ...current, [key]: value }))
    setActivePage(1)
  }

  const updatePageSize = (nextPageSize: number) => {
    setPageSize(nextPageSize)
    setActivePage(1)
  }

  const toggleCollectionSort = () => {
    setSortDirection((current) => {
      if (current === 'none') return 'desc'
      if (current === 'desc') return 'asc'
      return 'desc'
    })
    setActivePage(1)
  }

  return (
    <AdminLayout>
      <section className={styles.page} aria-labelledby="public-data-title">
        <header className={styles.pageTop}>
          <div>
            <h1 id="public-data-title">공공데이터 관리</h1>
            <p>연계 데이터 수집·갱신·품질 상태 관리</p>
          </div>

          <div className={styles.topActions}>
            <button
              type="button"
              className={styles.outlineActionButton}
              onClick={() => announce('공공데이터 수집 점검을 시작했습니다.')}
            >
              <Activity size={22} strokeWidth={2.2} aria-hidden="true" />
              수집 점검
            </button>
            <button
              type="button"
              className={styles.outlineActionButton}
              onClick={() => announce('오류 로그 화면은 데모 준비 중입니다.')}
            >
              <AlertTriangle size={22} strokeWidth={2.2} aria-hidden="true" />
              오류 로그 보기
            </button>
            <button
              type="button"
              className={styles.primaryActionButton}
              onClick={() => announce('공공데이터 상태가 새로고침되었습니다.')}
            >
              <RefreshCw size={23} strokeWidth={2.2} aria-hidden="true" />
              데이터 새로고침
            </button>
          </div>
        </header>

        {statusMessage ? (
          <p key={statusMessage.id} className={styles.statusMessage} role="status">
            {statusMessage.text}
          </p>
        ) : null}

        <section className={styles.statGrid} aria-label="공공데이터 요약 지표">
          {publicDataSummaryMetrics.map((metric) => (
            <PublicDataStatCard key={metric.id} metric={metric} />
          ))}
        </section>

        <PublicDataFilterBar filters={filters} onFilterChange={updateFilter} />

        <section className={styles.mainGrid} aria-label="공공데이터 연계 현황">
          <PublicDatasetTable
            datasets={visibleDatasets}
            totalCount={filteredDatasets.length}
            activePage={normalizedActivePage}
            totalPages={totalPages}
            pageSize={pageSize}
            sortDirection={sortDirection}
            onSort={toggleCollectionSort}
            onPageChange={setActivePage}
            onPageSizeChange={updatePageSize}
          />

          <aside className={styles.rightPanel} aria-label="품질 요약 및 최근 알림">
            <PublicDataQualityPanel metrics={publicDataQualityMetrics} />
            <PublicDataAlertLogPanel
              logs={publicDataAlertLogs}
              onShowAll={() => announce('전체 알림 로그 화면은 데모 준비 중입니다.')}
            />
          </aside>
        </section>

        <p className={styles.notice}>
          ※ 데이터 수집 상태는 출처 기관 및 네트워크 상황에 따라 달라질 수 있습니다.
        </p>
      </section>
    </AdminLayout>
  )
}

function PublicDataStatCard({ metric }: { metric: PublicDataSummaryMetric }) {
  const Icon = metric.icon

  return (
    <article className={styles.statCard}>
      <div className={`${styles.statIcon} ${styles[metric.accent]}`} aria-hidden="true">
        <Icon size={39} strokeWidth={2.1} />
      </div>

      <div>
        <p>{metric.title}</p>
        <strong className={styles[metric.accent]}>{metric.value}</strong>
        <small>{metric.subtext}</small>
      </div>
    </article>
  )
}

type FilterBarProps = {
  filters: PublicDataFilterState
  onFilterChange: <Key extends keyof PublicDataFilterState>(
    key: Key,
    value: PublicDataFilterState[Key],
  ) => void
}

function PublicDataFilterBar({ filters, onFilterChange }: FilterBarProps) {
  return (
    <section className={styles.filterPanel} aria-label="공공데이터 조회 조건">
      <FilterSelect
        id="public-data-type"
        label="데이터 유형"
        value={filters.datasetType}
        options={publicDataTypeFilterOptions}
        onChange={(value) =>
          onFilterChange('datasetType', value as PublicDataFilterState['datasetType'])
        }
      />

      <FilterSelect
        id="public-data-status"
        label="상태"
        value={filters.status}
        options={publicDataStatusFilterOptions}
        onChange={(value) =>
          onFilterChange('status', value as PublicDataFilterState['status'])
        }
      />

      <FilterSelect
        id="public-data-cycle"
        label="갱신주기"
        value={filters.collectionCycle}
        options={publicDataCycleFilterOptions}
        onChange={(value) =>
          onFilterChange(
            'collectionCycle',
            value as PublicDataFilterState['collectionCycle'],
          )
        }
      />

      <label className={styles.searchBox} htmlFor="public-data-search">
        <span className={styles.visuallyHidden}>데이터명 검색</span>
        <input
          id="public-data-search"
          value={filters.searchTerm}
          placeholder="데이터명 검색"
          onChange={(event) => onFilterChange('searchTerm', event.target.value)}
        />
        <Search size={22} strokeWidth={2.1} aria-hidden="true" />
      </label>
    </section>
  )
}

type FilterSelectProps = {
  id: string
  label: string
  value: string
  options: Array<{ value: string; label: string }>
  onChange: (value: string) => void
}

function FilterSelect({ id, label, value, options, onChange }: FilterSelectProps) {
  return (
    <label className={styles.filterBox} htmlFor={id}>
      <span>{label}</span>
      <span className={styles.selectShell}>
        <select
          id={id}
          value={value}
          aria-label={label}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown size={17} strokeWidth={2.2} aria-hidden="true" />
      </span>
    </label>
  )
}

type DatasetTableProps = {
  datasets: PublicDataset[]
  totalCount: number
  activePage: number
  totalPages: number
  pageSize: number
  sortDirection: SortDirection
  onSort: () => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

function PublicDatasetTable({
  datasets,
  totalCount,
  activePage,
  totalPages,
  pageSize,
  sortDirection,
  onSort,
  onPageChange,
  onPageSizeChange,
}: DatasetTableProps) {
  return (
    <section className={`${styles.card} ${styles.tableCard}`} aria-labelledby="dataset-table-title">
      <h2 id="dataset-table-title" className={styles.visuallyHidden}>
        공공데이터 연계 데이터셋 수집 상태 목록
      </h2>

      <div className={styles.tableScroll}>
        <table>
          <caption>공공데이터 연계 데이터셋 수집 상태 목록</caption>
          <thead>
            <tr>
              <th scope="col">데이터명</th>
              <th scope="col">출처기관</th>
              <th scope="col">
                <button
                  type="button"
                  className={styles.sortButton}
                  aria-label="최근 수집시각 정렬"
                  onClick={onSort}
                >
                  최근 수집시각
                  <ChevronDown
                    className={sortDirection === 'asc' ? styles.sortAscending : undefined}
                    size={15}
                    strokeWidth={2.3}
                    aria-hidden="true"
                  />
                </button>
              </th>
              <th scope="col">상태</th>
              <th scope="col">비고</th>
            </tr>
          </thead>

          <tbody>
            {datasets.length > 0 ? (
              datasets.map((dataset) => <PublicDatasetRow key={dataset.id} dataset={dataset} />)
            ) : (
              <tr>
                <td className={styles.emptyCell} colSpan={5}>
                  검색 결과가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AdminPagination
        totalCount={totalCount}
        activePage={activePage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </section>
  )
}

function PublicDatasetRow({ dataset }: { dataset: PublicDataset }) {
  const Icon = dataset.icon

  return (
    <tr>
      <td className={styles.datasetName}>
        <Icon size={23} strokeWidth={2.1} aria-hidden="true" />
        <span>{dataset.name}</span>
      </td>
      <td>{dataset.provider}</td>
      <td>{dataset.lastCollectedAt}</td>
      <td>
        <span className={`${styles.statusBadge} ${styles[statusClassName[dataset.status]]}`}>
          {publicDataStatusLabels[dataset.status]}
        </span>
      </td>
      <td>{dataset.note}</td>
    </tr>
  )
}

type PaginationProps = {
  totalCount: number
  activePage: number
  totalPages: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

function AdminPagination({
  totalCount,
  activePage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <div className={styles.tableFooter}>
      <p>전체 {totalCount}건</p>

      <div className={styles.pagination} aria-label="공공데이터 페이지">
        <button
          type="button"
          aria-label="이전 페이지"
          disabled={activePage <= 1}
          onClick={() => onPageChange(Math.max(1, activePage - 1))}
        >
          <ChevronLeft size={17} strokeWidth={2.3} aria-hidden="true" />
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

        <button
          type="button"
          aria-label="다음 페이지"
          disabled={activePage >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, activePage + 1))}
        >
          <ChevronRight size={17} strokeWidth={2.3} aria-hidden="true" />
        </button>
      </div>

      <label className={styles.pageSizeSelect} htmlFor="public-data-page-size">
        <span className={styles.visuallyHidden}>페이지당 표시 개수</span>
        <select
          id="public-data-page-size"
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
        >
          {publicDataPageSizeOptions.map((size) => (
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

function PublicDataQualityPanel({ metrics }: { metrics: DataQualityMetric[] }) {
  return (
    <section
      className={`${styles.card} ${styles.qualityCard}`}
      aria-labelledby="quality-summary-title"
      aria-describedby="quality-summary-description"
    >
      <h2 id="quality-summary-title">
        품질 요약 <span>(전체 평균)</span>
      </h2>
      <p id="quality-summary-description" className={styles.visuallyHidden}>
        전체 공공데이터 품질은 완전성 95%, 정확성 91%, 적시성 90%입니다.
      </p>

      <div className={styles.qualityList}>
        {metrics.map((metric) => (
          <QualityMetricItem key={metric.id} metric={metric} />
        ))}
      </div>

      <p className={styles.qualityDate}>기준일시: 2025.06.21 14:00</p>
    </section>
  )
}

function QualityMetricItem({ metric }: { metric: DataQualityMetric }) {
  const label = `${metric.label} (${metric.englishLabel})`

  return (
    <article className={styles.qualityItem}>
      <div className={styles.qualityTop}>
        <p>{label}</p>
        <strong className={styles[metric.accent]}>{metric.value}%</strong>
      </div>

      <div
        className={styles.qualityTrack}
        role="progressbar"
        aria-label={`${label} ${metric.value}%`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={metric.value}
      >
        <span className={styles[metric.accent]} style={{ width: `${metric.value}%` }} />
      </div>

      <small>{metric.description}</small>
    </article>
  )
}

type AlertLogPanelProps = {
  logs: DataAlertLog[]
  onShowAll: () => void
}

function PublicDataAlertLogPanel({ logs, onShowAll }: AlertLogPanelProps) {
  return (
    <section className={`${styles.card} ${styles.logCard}`} aria-labelledby="alert-log-title">
      <div className={styles.cardTitleBetween}>
        <h2 id="alert-log-title">최근 알림 로그</h2>
        <button type="button" className={styles.textLinkButton} onClick={onShowAll}>
          전체보기
          <ChevronRight size={16} strokeWidth={2.2} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.logList}>
        {logs.map((log) => (
          <AlertLogItem key={log.id} log={log} />
        ))}
      </div>
    </section>
  )
}

function AlertLogItem({ log }: { log: DataAlertLog }) {
  const Icon = log.icon

  return (
    <article className={styles.logItem}>
      <div className={`${styles.logIcon} ${styles[log.accent]}`} aria-hidden="true">
        <Icon size={19} strokeWidth={2.4} />
      </div>
      <div>
        <strong>{log.title}</strong>
        <p>{log.description}</p>
      </div>
      <time>{log.time}</time>
    </article>
  )
}
