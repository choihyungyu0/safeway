import { useMemo, useState } from 'react'
import type { KeyboardEvent } from 'react'
import {
  AlertTriangle,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Droplets,
  FileText,
  HeartPulse,
  ListChecks,
  MapPin,
  RefreshCw,
  Snowflake,
  Toilet,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { SejongAdminShell as AdminLayout } from '@/shared/ui/SejongAdminShell'
import {
  AdminLeafletMap,
  type AdminLeafletCircle,
  type AdminLeafletPoint,
} from '@/features/admin/components/AdminLeafletMap'
import {
  defaultTemporaryShelterFilter,
  temporaryShelterFacilityTypeOptions,
  temporaryShelterPeriod,
  temporaryShelterPriorityOptions,
  temporaryShelterRegionOptions,
  temporaryShelterSummaryMetrics,
} from '@/features/admin/temporaryShelter.constants'
import type {
  TemporaryShelterCandidate,
  TemporaryShelterFacilityType,
  TemporaryShelterFilter,
  TemporaryShelterPriority,
  TemporaryShelterRegion,
  TemporaryShelterStatus,
  TemporaryShelterSummaryMetric,
} from '@/features/admin/temporaryShelter.types'
import { adminTemporaryShelterCandidates } from '@/mocks/fixtures/adminTemporaryShelters'
import { safewayAnalysisSummary, topSafewayShelters } from '@/mocks/fixtures/generated/safewayData'
import styles from '@/pages/AdminTemporaryShelterPage.module.css'

type StatusMessage = {
  id: number
  text: string
}

type FilterKey = keyof TemporaryShelterFilter

const confirmedStorageKey = 'safeway-confirmed-temporary-shelters'
const topGeneratedShelter = topSafewayShelters[0]

const temporaryShelterHeatCircles: AdminLeafletCircle[] = [
  {
    id: 'temporary-naseong-risk',
    position: { x: 18, y: 20 },
    radiusMeters: 650,
    tone: 'danger',
    label: '쉼터 사각지대',
    fillOpacity: 0.18,
  },
  {
    id: 'temporary-eojin-risk',
    position: { x: 56, y: 26 },
    radiusMeters: 760,
    tone: 'danger',
    label: '쉼터 사각지대',
    fillOpacity: 0.18,
  },
  {
    id: 'temporary-hansol-risk',
    position: { x: 73, y: 52 },
    radiusMeters: 720,
    tone: 'warning',
    label: '주의 권역',
    fillOpacity: 0.16,
  },
  {
    id: 'temporary-boram-risk',
    position: { x: 25, y: 80 },
    radiusMeters: 690,
    tone: 'warning',
    label: '주의 권역',
    fillOpacity: 0.16,
  },
]

export function AdminTemporaryShelterPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<TemporaryShelterFilter>(defaultTemporaryShelterFilter)
  const [candidates, setCandidates] = useState<TemporaryShelterCandidate[]>(
    adminTemporaryShelterCandidates,
  )
  const [selectedCandidateId, setSelectedCandidateId] = useState(
    adminTemporaryShelterCandidates[0].id,
  )
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null)

  const selectedCandidate = useMemo(
    () => candidates.find((candidate) => candidate.id === selectedCandidateId) ?? candidates[0],
    [candidates, selectedCandidateId],
  )

  const priorityCandidates = candidates.filter((candidate) => candidate.rank <= 5)

  const announce = (text: string) => {
    setStatusMessage({ id: Date.now(), text })
  }

  const updateFilter = <Key extends FilterKey>(key: Key, value: TemporaryShelterFilter[Key]) => {
    setFilters((current) => ({ ...current, [key]: value }))
  }

  const resetFilters = () => {
    setFilters(defaultTemporaryShelterFilter)
    announce('필터가 초기화되었습니다.')
  }

  const updateSelectedStatus = (status: TemporaryShelterStatus) => {
    setCandidates((current) =>
      current.map((candidate) =>
        candidate.id === selectedCandidate.id ? { ...candidate, status } : candidate,
      ),
    )
  }

  const confirmCandidate = () => {
    updateSelectedStatus('후보 확정')

    try {
      const stored = sessionStorage.getItem(confirmedStorageKey)
      const confirmedIds = stored ? (JSON.parse(stored) as string[]) : []
      const nextConfirmedIds = confirmedIds.includes(selectedCandidate.id)
        ? confirmedIds
        : [...confirmedIds, selectedCandidate.id]

      sessionStorage.setItem(confirmedStorageKey, JSON.stringify(nextConfirmedIds))
    } catch {
      // Session storage can be unavailable in restricted browser contexts.
    }

    announce('임시쉼터 후보가 확정되었습니다.')
  }

  const requestFieldInspection = () => {
    updateSelectedStatus('현장조사 요청')
    announce('현장 조사 요청이 등록되었습니다.')
  }

  const createReport = () => {
    navigate('/admin/reports')
  }

  return (
    <AdminLayout>
      <section className={styles.page} aria-labelledby="temporary-shelter-title">
        <header className={styles.pageTitle}>
          <h1 id="temporary-shelter-title">임시쉼터 후보 관리</h1>
          <p>쉼터 사각지대 해소를 위한 후보 시설 검토 현황</p>
          {topGeneratedShelter ? (
            <p>
              SafeWay 기존 쉼터 {safewayAnalysisSummary.totalShelterCount}개 기준 · 추천점수 상위{' '}
              {topGeneratedShelter.name}
            </p>
          ) : null}
        </header>

        <TemporaryShelterFilterBar
          filters={filters}
          onFilterChange={updateFilter}
          onReset={resetFilters}
        />

        {statusMessage ? (
          <p key={statusMessage.id} className={styles.statusMessage} role="status">
            {statusMessage.text}
          </p>
        ) : null}

        <section className={styles.statGrid} aria-label="임시쉼터 후보 요약 지표">
          {temporaryShelterSummaryMetrics.map((metric) => (
            <TemporaryShelterStatCard key={metric.id} metric={metric} />
          ))}
        </section>

        <section className={styles.mainGrid} aria-label="임시쉼터 후보 검토 현황">
          <TemporaryShelterMapPanel
            candidates={candidates}
            selectedCandidateId={selectedCandidate.id}
            onSelectCandidate={setSelectedCandidateId}
          />

          <TemporaryShelterCandidateTable
            candidates={priorityCandidates}
            selectedCandidateId={selectedCandidate.id}
            onSelectCandidate={setSelectedCandidateId}
            onShowAll={() => announce('전체 임시쉼터 후보 목록은 데모 준비 중입니다.')}
          />
        </section>

        <TemporaryShelterDetailPanel
          candidate={selectedCandidate}
          onConfirm={confirmCandidate}
          onRequestInspection={requestFieldInspection}
          onCreateReport={createReport}
        />
      </section>
    </AdminLayout>
  )
}

type FilterBarProps = {
  filters: TemporaryShelterFilter
  onFilterChange: <Key extends FilterKey>(
    key: Key,
    value: TemporaryShelterFilter[Key],
  ) => void
  onReset: () => void
}

function TemporaryShelterFilterBar({ filters, onFilterChange, onReset }: FilterBarProps) {
  return (
    <section className={styles.filterPanel} aria-label="임시쉼터 후보 조회 조건">
      <FilterSelect
        id="temporary-shelter-period"
        icon={Calendar}
        label="기간"
        value={filters.period}
        options={[temporaryShelterPeriod]}
        onChange={(value) => onFilterChange('period', value)}
      />

      <FilterSelect
        id="temporary-shelter-region"
        icon={MapPin}
        label="지역"
        value={filters.region}
        options={temporaryShelterRegionOptions}
        onChange={(value) => onFilterChange('region', value as TemporaryShelterRegion)}
      />

      <FilterSelect
        id="temporary-shelter-facility-type"
        icon={Building2}
        label="시설유형"
        value={filters.facilityType}
        options={temporaryShelterFacilityTypeOptions}
        onChange={(value) =>
          onFilterChange('facilityType', value as TemporaryShelterFacilityType)
        }
      />

      <FilterSelect
        id="temporary-shelter-priority"
        icon={ListChecks}
        label="우선순위"
        value={filters.priority}
        options={temporaryShelterPriorityOptions}
        onChange={(value) => onFilterChange('priority', value as TemporaryShelterPriority)}
      />

      <button type="button" className={styles.resetButton} onClick={onReset}>
        <RefreshCw size={17} strokeWidth={2.2} aria-hidden="true" />
        초기화
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

function TemporaryShelterStatCard({ metric }: { metric: TemporaryShelterSummaryMetric }) {
  const Icon = metric.icon

  return (
    <article className={styles.statCard}>
      <div>
        <p>{metric.title}</p>
        <strong className={styles[metric.accent]}>{metric.value}</strong>
      </div>

      <div className={`${styles.statIcon} ${styles[metric.accent]}`} aria-hidden="true">
        <Icon size={35} strokeWidth={2.1} />
      </div>
    </article>
  )
}

type MapPanelProps = {
  candidates: TemporaryShelterCandidate[]
  selectedCandidateId: string
  onSelectCandidate: (candidateId: string) => void
}

function TemporaryShelterMapPanel({
  candidates,
  selectedCandidateId,
  onSelectCandidate,
}: MapPanelProps) {
  const candidatePoints: AdminLeafletPoint[] = candidates.map((candidate) => ({
    id: candidate.id,
    label: candidate.mapPosition.label ?? candidate.name,
    position: candidate.mapPosition,
    tone: 'candidate',
    shape: 'pin',
    rank: candidate.rank,
    selected: candidate.id === selectedCandidateId,
    ariaLabel: `${candidate.rank}순위 ${candidate.name} 후보 선택`,
    onClick: () => onSelectCandidate(candidate.id),
  }))

  return (
    <section className={`${styles.card} ${styles.mapCard}`} aria-labelledby="candidate-map-title">
      <div className={styles.cardHeader}>
        <h2 id="candidate-map-title">세종시 후보 위치 지도</h2>

        <div className={styles.mapLegend} aria-label="지도 범례">
          <LegendDot tone="danger" label="쉼터 사각지대(위험)" />
          <LegendDot tone="warning" label="쉼터 사각지대(주의)" />
          <LegendDot tone="blue" label="후보 시설" />
        </div>
      </div>

      <p id="temporary-shelter-map-summary" className={styles.srOnly}>
        나성동, 보람동, 한솔동, 어진동 일대의 임시쉼터 후보 시설 위치와 쉼터
        사각지대가 표시됩니다.
      </p>

      <AdminLeafletMap
        className={styles.mapView}
        ariaLabel="임시쉼터 후보 시설 위치와 쉼터 사각지대를 표시하는 Leaflet 지도"
        points={candidatePoints}
        circles={temporaryShelterHeatCircles}
        center={{ x: 52, y: 52 }}
        zoom={12}
        maxFitZoom={12}
      />
    </section>
  )
}

function LegendDot({ tone, label }: { tone: 'danger' | 'warning' | 'blue'; label: string }) {
  const toneClass = {
    danger: styles.dangerDot,
    warning: styles.warningDot,
    blue: styles.blueDot,
  }[tone]

  return (
    <span className={styles.legendItem}>
      <i className={toneClass} aria-hidden="true" />
      {label}
    </span>
  )
}

type CandidateTableProps = {
  candidates: TemporaryShelterCandidate[]
  selectedCandidateId: string
  onSelectCandidate: (candidateId: string) => void
  onShowAll: () => void
}

function TemporaryShelterCandidateTable({
  candidates,
  selectedCandidateId,
  onSelectCandidate,
  onShowAll,
}: CandidateTableProps) {
  const handleRowKeyDown = (
    event: KeyboardEvent<HTMLTableRowElement>,
    candidateId: string,
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelectCandidate(candidateId)
    }
  }

  return (
    <section className={`${styles.card} ${styles.tableCard}`} aria-labelledby="candidate-table-title">
      <h2 id="candidate-table-title">우선 검토 후보</h2>

      <div className={styles.tableScroll}>
        <table>
          <thead>
            <tr>
              <th scope="col">순위</th>
              <th scope="col">시설명</th>
              <th scope="col">유형</th>
              <th scope="col">예상 수혜권역</th>
              <th scope="col">접근성 점수</th>
              <th scope="col">상태</th>
            </tr>
          </thead>

          <tbody>
            {candidates.map((candidate) => {
              const isSelected = candidate.id === selectedCandidateId

              return (
                <tr
                  key={candidate.id}
                  className={isSelected ? styles.selectedRow : undefined}
                  tabIndex={0}
                  aria-selected={isSelected}
                  onClick={() => onSelectCandidate(candidate.id)}
                  onKeyDown={(event) => handleRowKeyDown(event, candidate.id)}
                >
                  <td>
                    <span className={styles.rankBadge}>{candidate.rank}</span>
                  </td>
                  <td>{candidate.name}</td>
                  <td>{candidate.facilityType}</td>
                  <td>{candidate.benefitArea}</td>
                  <td>{candidate.accessibilityScore}</td>
                  <td>
                    <StatusBadge status={candidate.status} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <button type="button" className={styles.viewAllButton} onClick={onShowAll}>
        전체 후보 보기
        <ChevronRight size={17} strokeWidth={2.2} aria-hidden="true" />
      </button>
    </section>
  )
}

function TemporaryShelterDetailPanel({
  candidate,
  onConfirm,
  onRequestInspection,
  onCreateReport,
}: {
  candidate: TemporaryShelterCandidate
  onConfirm: () => void
  onRequestInspection: () => void
  onCreateReport: () => void
}) {
  const detailRows = [
    { icon: MapPin, label: '주소', value: candidate.address },
    { icon: Clock, label: '운영 가능 시간', value: candidate.operationTime },
    { icon: Users, label: '수용 가능 인원', value: candidate.capacity },
    { icon: AlertTriangle, label: '인근 위험도', value: candidate.nearbyRiskLevel },
  ]

  const facilityRows = [
    {
      icon: Snowflake,
      label: '냉방 가능 여부',
      value: candidate.facilities.coolingAvailable ? '가능' : '불가',
    },
    { icon: Toilet, label: '화장실', value: candidate.facilities.restroom ? '있음' : '없음' },
    {
      icon: Droplets,
      label: '정수기',
      value: candidate.facilities.waterDispenser ? '있음' : '없음',
    },
    { icon: HeartPulse, label: 'AED', value: candidate.facilities.aed ? '있음' : '없음' },
  ]

  return (
    <section className={`${styles.card} ${styles.detailCard}`} aria-labelledby="candidate-detail-title">
      <h2 id="candidate-detail-title">선택 후보 상세</h2>

      <div className={styles.detailContent}>
        <div className={styles.candidateInfo}>
          <div className={styles.candidateTitle}>
            <span className={styles.rankBadge}>{candidate.rank}</span>
            <h3>{candidate.name}</h3>
            <StatusBadge status={candidate.status} />
          </div>

          <div className={styles.infoList}>
            {detailRows.map(({ icon: Icon, label, value }) => (
              <article key={label}>
                <Icon size={18} strokeWidth={2.2} aria-hidden="true" />
                <div>
                  <p>{label}</p>
                  {label === '인근 위험도' ? (
                    <strong className={styles.riskValue}>
                      {value}
                      <span aria-hidden="true" />
                    </strong>
                  ) : (
                    <strong>{value}</strong>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.facilityCheck}>
          {facilityRows.map(({ icon: Icon, label, value }) => (
            <article key={label}>
              <Icon size={18} strokeWidth={2.2} aria-hidden="true" />
              <p>{label}</p>
              <strong>{value}</strong>
            </article>
          ))}
        </div>

        <div className={styles.effectBox}>
          <p className={styles.effectTitle}>예상 개선 효과</p>

          <div className={styles.effectMetric}>
            <span>접근성 개선 </span>
            <strong>{candidate.accessibilityImprovementPct}</strong>
          </div>

          <div className={styles.effectMetric}>
            <span>예상 추가 수혜 인구</span>
            <strong>{candidate.expectedAdditionalBeneficiaries}</strong>
          </div>

          <p className={styles.memoTitle}>메모</p>
          <p className={styles.memo}>{candidate.memo}</p>
        </div>
      </div>

      <div className={styles.actionRow}>
        <button type="button" className={styles.primaryButton} onClick={onConfirm}>
          <Check size={22} strokeWidth={2.4} aria-hidden="true" />
          후보 확정
        </button>
        <button type="button" className={styles.outlineButton} onClick={onRequestInspection}>
          <ClipboardCheck size={22} strokeWidth={2.3} aria-hidden="true" />
          현장 조사 요청
        </button>
        <button type="button" className={styles.outlineButton} onClick={onCreateReport}>
          <FileText size={22} strokeWidth={2.3} aria-hidden="true" />
          리포트 생성
        </button>
      </div>
    </section>
  )
}

function StatusBadge({ status }: { status: TemporaryShelterStatus }) {
  return <span className={`${styles.status} ${styles[statusClass(status)]}`}>{status}</span>
}

function statusClass(status: TemporaryShelterStatus) {
  if (status === '현장확인 필요' || status === '현장조사 요청') return 'orangeStatus'
  if (status === '승인대기' || status === '후보 확정') return 'greenStatus'
  return 'blueStatus'
}
