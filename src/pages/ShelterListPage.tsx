import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CalendarCheck,
  Database,
  MapPin,
  Moon,
  Search,
  SlidersHorizontal,
  Snowflake,
  Star,
  Users,
} from 'lucide-react'
import {
  safewayAnalysisSummary,
  safewayImportMetadata,
  safewayShelters,
} from '@/mocks/fixtures/generated/safewayData'
import type { SafewayShelter } from '@/mocks/fixtures/generated/safewayData.types'
import styles from '@/pages/ShelterListPage.module.css'

type SortOption = 'score' | 'capacity' | 'name'

const visibleShelterCount = 30
const gradeOptions = [...new Set(safewayShelters.map((shelter) => shelter.grade).filter(Boolean))]
  .sort()
  .reverse()

export function ShelterListPage() {
  const [keyword, setKeyword] = useState('')
  const [selectedGrade, setSelectedGrade] = useState('ALL')
  const [sortBy, setSortBy] = useState<SortOption>('score')
  const [nightOpenOnly, setNightOpenOnly] = useState(false)
  const [holidayOpenOnly, setHolidayOpenOnly] = useState(false)
  const [coolingOnly, setCoolingOnly] = useState(false)

  const filteredShelters = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()

    return safewayShelters
      .filter((shelter) => {
        const address = shelter.roadAddress || shelter.lotAddress
        const matchesKeyword =
          normalizedKeyword.length === 0 ||
          shelter.name.toLowerCase().includes(normalizedKeyword) ||
          address.toLowerCase().includes(normalizedKeyword) ||
          shelter.managingAgency.toLowerCase().includes(normalizedKeyword)
        const matchesGrade = selectedGrade === 'ALL' || shelter.grade === selectedGrade
        const matchesNightOpen = !nightOpenOnly || shelter.nightOpen
        const matchesHolidayOpen = !holidayOpenOnly || shelter.holidayOpen
        const matchesCooling = !coolingOnly || shelter.airConditionerCount > 0

        return (
          matchesKeyword &&
          matchesGrade &&
          matchesNightOpen &&
          matchesHolidayOpen &&
          matchesCooling
        )
      })
      .sort((left, right) => compareShelters(left, right, sortBy))
  }, [coolingOnly, holidayOpenOnly, keyword, nightOpenOnly, selectedGrade, sortBy])

  const visibleShelters = filteredShelters.slice(0, visibleShelterCount)

  return (
    <section className={styles.page} aria-labelledby="shelter-list-title">
      <div className={styles.content}>
        <header className={styles.hero}>
          <div>
            <span className={styles.dataBadge}>
              <Database size={17} aria-hidden="true" />
              SafeWay 처리 데이터 {safewayImportMetadata.generatedCounts.shelters}개
            </span>
            <h1 id="shelter-list-title">세종 무더위쉼터 탐색</h1>
            <p>
              SafeWay.zip에서 변환한 세종 쉼터 {safewayAnalysisSummary.totalShelterCount}개를
              추천점수, 개방 여부, 냉방시설 기준으로 확인합니다.
            </p>
          </div>

          <div className={styles.summaryGrid} aria-label="SafeWay 쉼터 요약">
            <SummaryMetric label="전체 쉼터" value={`${safewayAnalysisSummary.totalShelterCount}개`} />
            <SummaryMetric
              label="야간개방"
              value={`${safewayAnalysisSummary.nightOpenShelterCount}개`}
            />
            <SummaryMetric
              label="휴일개방"
              value={`${safewayAnalysisSummary.holidayOpenShelterCount}개`}
            />
            <SummaryMetric label="평균 수용" value={`${safewayAnalysisSummary.averageCapacity}명`} />
          </div>
        </header>

        <section className={styles.filterPanel} aria-label="쉼터 검색 및 필터">
          <label className={`${styles.field} ${styles.searchField}`} htmlFor="shelter-keyword">
            <span>
              <Search size={18} aria-hidden="true" />
              쉼터명·주소 검색
            </span>
            <input
              id="shelter-keyword"
              value={keyword}
              placeholder="도담, 나성, 복합커뮤니티"
              onChange={(event) => setKeyword(event.target.value)}
            />
          </label>

          <label className={styles.field} htmlFor="shelter-grade">
            <span>
              <Star size={18} aria-hidden="true" />
              등급
            </span>
            <select
              id="shelter-grade"
              value={selectedGrade}
              onChange={(event) => setSelectedGrade(event.target.value)}
            >
              <option value="ALL">전체</option>
              {gradeOptions.map((grade) => (
                <option value={grade} key={grade}>
                  {grade}등급
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field} htmlFor="shelter-sort">
            <span>
              <SlidersHorizontal size={18} aria-hidden="true" />
              정렬
            </span>
            <select
              id="shelter-sort"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortOption)}
            >
              <option value="score">추천점수순</option>
              <option value="capacity">수용인원순</option>
              <option value="name">이름순</option>
            </select>
          </label>

          <div className={styles.toggleGroup} aria-label="운영 조건">
            <FilterToggle
              icon={Moon}
              label="야간개방"
              checked={nightOpenOnly}
              onChange={setNightOpenOnly}
            />
            <FilterToggle
              icon={CalendarCheck}
              label="휴일개방"
              checked={holidayOpenOnly}
              onChange={setHolidayOpenOnly}
            />
            <FilterToggle
              icon={Snowflake}
              label="냉방시설"
              checked={coolingOnly}
              onChange={setCoolingOnly}
            />
          </div>
        </section>

        <section className={styles.resultHeader} aria-live="polite">
          <h2>쉼터 {filteredShelters.length.toLocaleString('ko-KR')}개 검색됨</h2>
          <p>상위 {visibleShelters.length}개를 표시합니다.</p>
        </section>

        <section className={styles.cardGrid} aria-label="SafeWay 쉼터 목록">
          {visibleShelters.map((shelter) => (
            <ShelterCard shelter={shelter} key={shelter.id} />
          ))}
        </section>
      </div>
    </section>
  )
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <article className={styles.summaryMetric}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  )
}

function FilterToggle({
  icon: Icon,
  label,
  checked,
  onChange,
}: {
  icon: typeof Moon
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className={styles.toggle}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>
        <Icon size={17} aria-hidden="true" />
        {label}
      </span>
    </label>
  )
}

function ShelterCard({ shelter }: { shelter: SafewayShelter }) {
  const address = shelter.roadAddress || shelter.lotAddress
  const facilities = shelter.facilities.slice(0, 4)

  return (
    <article className={styles.shelterCard}>
      <div className={styles.cardTop}>
        <span className={styles.gradeBadge}>{shelter.grade || '등급 없음'}</span>
        <strong>{shelter.recommendationScore}점</strong>
      </div>

      <h3>{shelter.name}</h3>
      <p className={styles.address}>
        <MapPin size={17} aria-hidden="true" />
        {address}
      </p>

      <div className={styles.detailRow}>
        <span>
          <Users size={16} aria-hidden="true" />
          {shelter.capacity}명
        </span>
        <span>{shelter.type}</span>
        <span>{shelter.operationTime}</span>
      </div>

      <div className={styles.facilityRow} aria-label={`${shelter.name} 시설`}>
        {facilities.map((facility) => (
          <span key={facility}>{facility}</span>
        ))}
      </div>

      <Link to={`/shelters/${shelter.id}`}>상세 보기</Link>
    </article>
  )
}

function compareShelters(left: SafewayShelter, right: SafewayShelter, sortBy: SortOption) {
  if (sortBy === 'capacity') {
    return right.capacity - left.capacity
  }

  if (sortBy === 'name') {
    return left.name.localeCompare(right.name, 'ko-KR')
  }

  return right.recommendationScore - left.recommendationScore
}
