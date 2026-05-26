import { useMemo, useState } from 'react'
import {
  Building2,
  Calendar,
  ChevronDown,
  ChevronRight,
  CircleDot,
  Clock,
  Crosshair,
  FileText,
  Home,
  Info,
  MapPin,
  Minus,
  Plus,
  RefreshCw,
  ShieldAlert,
  Target,
  ThermometerSun,
  User,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { SejongAdminShell as AdminLayout } from '@/shared/ui/SejongAdminShell'
import {
  defaultShelterGapFilter,
  shelterGapAnalysisRadiusOptions,
  shelterGapBaseTimeOptions,
  shelterGapRiskTypeLabels,
  shelterGapRiskTypeOptions,
  shelterGapUserTypeLabels,
  shelterGapUserTypeOptions,
} from '@/features/admin/shelterGap.constants'
import type {
  ShelterGapAnalysisRadius,
  ShelterGapBaseTime,
  ShelterGapFilter,
  ShelterGapRiskType,
  ShelterGapUserType,
} from '@/features/admin/shelterGap.types'
import {
  shelterGapAreas,
  shelterGapBlindZones,
  shelterGapDistrictLabels,
  shelterGapMarkers,
  shelterGapRadiusZones,
  temporaryShelterCandidates,
  vulnerableWalkingCorridors,
} from '@/mocks/fixtures/adminShelterGaps'
import { safewayAnalysisSummary, topSafewayShelters } from '@/mocks/fixtures/generated/safewayData'
import styles from '@/pages/AdminShelterGapPage.module.css'

type StatusMessage = {
  id: number
  text: string
}

const topPriorityAreas = shelterGapAreas.slice(0, 3)
const topGeneratedShelter = topSafewayShelters[0]

export function AdminShelterGapPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<ShelterGapFilter>(defaultShelterGapFilter)
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null)

  const selectedRiskLabel = shelterGapRiskTypeLabels[filters.riskType]
  const selectedUserTypeLabel = shelterGapUserTypeLabels[filters.userType]

  const announce = (text: string) => {
    setStatusMessage({ id: Date.now(), text })
  }

  const resetFilters = () => {
    setFilters(defaultShelterGapFilter)
    announce('분석 조건이 초기화되었습니다.')
  }

  const showCandidates = () => {
    navigate('/admin/temporary-shelters')
  }

  const createReport = () => {
    try {
      sessionStorage.setItem(
        'safeway:lastShelterGapReport',
        JSON.stringify({
          createdAt: new Date().toISOString(),
          filter: filters,
          candidateCount: temporaryShelterCandidates.length,
        }),
      )
    } catch {
      // Storage can be unavailable in private browsing or restricted test environments.
    }

    navigate('/admin/reports')
  }

  return (
    <AdminLayout>
      <section className={styles.page} aria-labelledby="shelter-gap-title">
        <header className={styles.pageTop}>
          <div>
            <h1 id="shelter-gap-title">쉼터 사각지대 분석</h1>
            <p>폭염·미세먼지 취약 보행축과 쉼터 접근성 분석</p>
            {topGeneratedShelter ? (
              <p>
                SafeWay 쉼터 {safewayAnalysisSummary.totalShelterCount}개 기준 · 추천점수 상위{' '}
                {topGeneratedShelter.name}
              </p>
            ) : null}
          </div>

          <div className={styles.dateControl}>
            <span>분석 기준일시</span>
            <button type="button" className={styles.dateButton}>
              <Calendar size={18} aria-hidden="true" />
              {filters.baseDateTime}
              <ChevronDown size={17} aria-hidden="true" />
            </button>
            <button type="button" className={styles.resetButton} onClick={resetFilters}>
              <RefreshCw size={17} aria-hidden="true" />
              분석 조건 초기화
            </button>
          </div>
        </header>

        {statusMessage ? (
          <p key={statusMessage.id} className={styles.statusMessage} role="status">
            {statusMessage.text}
          </p>
        ) : null}

        <ShelterGapFilterBar filters={filters} onFiltersChange={setFilters} />

        <section className={styles.mainGrid} aria-label="쉼터 사각지대 분석 결과">
          <section className={styles.mapSection}>
            <ShelterGapMapPanel
              analysisRadius={filters.analysisRadius}
              riskLabel={selectedRiskLabel}
              userTypeLabel={selectedUserTypeLabel}
            />
            <p className={styles.mapNote}>
              ※ 본 분석 결과는 참고용이며, 현장 상황에 따라 달라질 수 있습니다.
            </p>
          </section>

          <aside className={styles.rightPanel} aria-label="개선 권역 및 임시쉼터 후보">
            <PriorityImprovementPanel />
            <TemporaryShelterCandidatesTable
              onMore={() => announce('임시쉼터 후보 전체 목록은 데모 준비 중입니다.')}
            />
            <ShelterGapActions onShowCandidates={showCandidates} onCreateReport={createReport} />
          </aside>
        </section>
      </section>
    </AdminLayout>
  )
}

type FilterBarProps = {
  filters: ShelterGapFilter
  onFiltersChange: (filters: ShelterGapFilter) => void
}

function ShelterGapFilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const updateFilter = <Key extends keyof ShelterGapFilter>(
    key: Key,
    value: ShelterGapFilter[Key],
  ) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  return (
    <section className={styles.filterPanel} aria-label="쉼터 사각지대 분석 조건">
      <SelectFilter
        id="shelter-gap-risk-type"
        icon={ThermometerSun}
        label="위험 유형"
        value={filters.riskType}
        options={shelterGapRiskTypeOptions.map((option) => ({
          value: option,
          label: shelterGapRiskTypeLabels[option],
        }))}
        onChange={(value) => updateFilter('riskType', value as ShelterGapRiskType)}
      />

      <SelectFilter
        id="shelter-gap-user-type"
        icon={User}
        label="사용자 유형"
        value={filters.userType}
        options={shelterGapUserTypeOptions.map((option) => ({
          value: option,
          label: shelterGapUserTypeLabels[option],
        }))}
        onChange={(value) => updateFilter('userType', value as ShelterGapUserType)}
      />

      <SelectFilter
        id="shelter-gap-radius"
        icon={Target}
        label="분석 반경"
        value={filters.analysisRadius}
        options={shelterGapAnalysisRadiusOptions.map((option) => ({
          value: option,
          label: option,
        }))}
        onChange={(value) => updateFilter('analysisRadius', value as ShelterGapAnalysisRadius)}
      />

      <SelectFilter
        id="shelter-gap-base-time"
        icon={Clock}
        label="기준 시간대"
        value={filters.baseTime}
        options={shelterGapBaseTimeOptions.map((option) => ({
          value: option,
          label: option,
        }))}
        onChange={(value) => updateFilter('baseTime', value as ShelterGapBaseTime)}
      />
    </section>
  )
}

type SelectFilterProps = {
  id: string
  icon: LucideIcon
  label: string
  value: string
  options: Array<{ value: string; label: string }>
  onChange: (value: string) => void
}

function SelectFilter({ id, icon: Icon, label, value, options, onChange }: SelectFilterProps) {
  return (
    <label className={styles.filterBox} htmlFor={id}>
      <Icon size={29} strokeWidth={2.2} aria-hidden="true" />
      <span className={styles.filterLabel}>{label}</span>
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
        <ChevronDown size={17} aria-hidden="true" />
      </span>
    </label>
  )
}

type ShelterGapMapPanelProps = {
  analysisRadius: ShelterGapAnalysisRadius
  riskLabel: string
  userTypeLabel: string
}

function ShelterGapMapPanel({
  analysisRadius,
  riskLabel,
  userTypeLabel,
}: ShelterGapMapPanelProps) {
  const mapSummary = useMemo(
    () =>
      `나성동 남측 보행축, 어진동 호수공원 동측, 보람동 생활권이 ${riskLabel} 기준 ${userTypeLabel} 쉼터 접근 취약 권역으로 표시됩니다.`,
    [riskLabel, userTypeLabel],
  )

  return (
    <section className={styles.mapCard} aria-labelledby="shelter-gap-map-title">
      <h2 id="shelter-gap-map-title" className={styles.srOnly}>
        쉼터 사각지대 지도
      </h2>
      <div className={styles.mapView} role="img" aria-label={mapSummary}>
        <div className={styles.mapBase} aria-hidden="true" />

        <ShelterGapLegend analysisRadius={analysisRadius} />

        {shelterGapDistrictLabels.map((district) => (
          <span
            key={district.id}
            className={styles.district}
            style={{ left: `${district.position.x}%`, top: `${district.position.y}%` }}
          >
            {district.label}
          </span>
        ))}

        {shelterGapBlindZones.map((zone) => (
          <div
            key={zone.id}
            className={`${styles.blindCircle} ${styles[zone.className]}`}
            aria-hidden="true"
          />
        ))}

        {shelterGapRadiusZones.map((zone) => (
          <div
            key={zone.id}
            className={`${styles.radiusCircle} ${styles[zone.className]}`}
            aria-hidden="true"
          />
        ))}

        {vulnerableWalkingCorridors.map((corridor) => (
          <div
            key={corridor.id}
            className={`${styles.walkLine} ${styles[corridor.className]}`}
            aria-hidden="true"
          />
        ))}

        {topPriorityAreas.map((area) => (
          <div
            key={area.id}
            className={styles.spotLabel}
            style={{ left: `${area.position.x}%`, top: `${area.position.y - 8}%` }}
          >
            <strong>{area.name}</strong>
          </div>
        ))}

        {shelterGapMarkers.map((marker) => {
          const isShelter = marker.type === 'SHELTER'
          const MarkerIcon = isShelter ? Home : MapPin

          return (
            <div
              key={marker.id}
              className={`${styles.marker} ${isShelter ? styles.shelterMarker : styles.candidateMarker}`}
              style={{ left: `${marker.position.x}%`, top: `${marker.position.y}%` }}
              aria-hidden="true"
            >
              <MarkerIcon size={15} strokeWidth={2.6} />
            </div>
          )
        })}

        <div className={styles.mapControl} aria-label="지도 표시 제어">
          <button type="button" aria-label="확대">
            <Plus size={20} aria-hidden="true" />
          </button>
          <button type="button" aria-label="축소">
            <Minus size={20} aria-hidden="true" />
          </button>
          <button type="button" aria-label="현재 위치">
            <Crosshair size={18} aria-hidden="true" />
          </button>
        </div>

        <div className={styles.scale} aria-hidden="true">
          <span />
          <p>
            0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;250&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;500&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;750m
          </p>
        </div>
      </div>
    </section>
  )
}

function ShelterGapLegend({ analysisRadius }: { analysisRadius: ShelterGapAnalysisRadius }) {
  return (
    <div className={styles.legendBox} aria-label="지도 범례">
      <LegendItem icon={Home} label="쉼터 (기존)" tone="green" />
      <LegendItem icon={MapPin} label="임시쉼터 후보" tone="blue" />
      <LegendItem icon={ShieldAlert} label="사각지대 (취약)" tone="red" />
      <div className={styles.legendItem}>
        <span className={styles.legendLine} aria-hidden="true" />
        <p>보행축 (취약)</p>
      </div>
      <LegendItem icon={CircleDot} label={`분석 반경 (${analysisRadius})`} tone="circle" />
    </div>
  )
}

type LegendItemProps = {
  icon: LucideIcon
  label: string
  tone: 'green' | 'blue' | 'red' | 'circle'
}

function LegendItem({ icon: Icon, label, tone }: LegendItemProps) {
  return (
    <div className={styles.legendItem}>
      <Icon className={styles[tone]} size={18} strokeWidth={2.5} aria-hidden="true" />
      <p>{label}</p>
    </div>
  )
}

function PriorityImprovementPanel() {
  return (
    <section className={`${styles.card} ${styles.improvementCard}`} aria-labelledby="priority-title">
      <div className={styles.sectionHeader}>
        <h2 id="priority-title">
          우선 개선 권역
          <Info size={16} strokeWidth={2.3} aria-hidden="true" />
        </h2>
      </div>

      <div className={styles.improvementList}>
        {shelterGapAreas.map((area) => (
          <article className={styles.improvementItem} key={area.id}>
            <div className={`${styles.rankBadge} ${styles[`rank${area.rank}`]}`}>{area.rank}</div>

            <div className={styles.improvementContent}>
              <div className={styles.improvementTitleRow}>
                <h3>{area.name}</h3>
                <div className={styles.tagRow}>
                  {area.riskTags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>

              <div className={styles.areaMeta}>
                <p>
                  <Users size={14} aria-hidden="true" /> 예상 수혜 인구{' '}
                  <strong>{area.beneficiaryPopulation}</strong>
                </p>
                <p>
                  <Clock size={14} aria-hidden="true" /> 현재 접근 시간{' '}
                  <strong>{area.currentAccessTimeMin}</strong>
                </p>
                <p>
                  <Building2 size={14} aria-hidden="true" /> 인근 공공시설{' '}
                  <strong>{area.nearbyPublicFacilityCount}</strong>
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function TemporaryShelterCandidatesTable({ onMore }: { onMore: () => void }) {
  return (
    <section className={`${styles.card} ${styles.candidateCard}`} aria-labelledby="candidate-title">
      <h2 id="candidate-title">임시쉼터 후보</h2>

      <div className={styles.tableScroll}>
        <table>
          <thead>
            <tr>
              <th scope="col">시설명</th>
              <th scope="col">주소</th>
              <th scope="col">운영시간</th>
              <th scope="col">
                접근성 점수 <Info size={14} strokeWidth={2.3} aria-hidden="true" />
              </th>
            </tr>
          </thead>

          <tbody>
            {temporaryShelterCandidates.map((candidate) => (
              <tr key={candidate.id}>
                <td>
                  <span className={styles.candidateIcon} aria-hidden="true">
                    <CircleDot size={16} strokeWidth={2.6} />
                  </span>
                  {candidate.name}
                </td>
                <td>{candidate.address}</td>
                <td>{candidate.operationTime}</td>
                <td>{candidate.accessibilityScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button type="button" className={styles.moreButton} onClick={onMore}>
        더보기
        <ChevronRight size={16} aria-hidden="true" />
      </button>
    </section>
  )
}

type ShelterGapActionsProps = {
  onShowCandidates: () => void
  onCreateReport: () => void
}

function ShelterGapActions({ onShowCandidates, onCreateReport }: ShelterGapActionsProps) {
  return (
    <div className={styles.actionRow}>
      <button type="button" className={styles.outlineButton} onClick={onShowCandidates}>
        <MapPin size={23} aria-hidden="true" />
        임시쉼터 후보 보기
      </button>
      <button type="button" className={styles.primaryButton} onClick={onCreateReport}>
        <FileText size={24} aria-hidden="true" />
        리포트 생성
      </button>
    </div>
  )
}
