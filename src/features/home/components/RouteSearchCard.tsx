import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, ChevronDown, MapPin, Navigation, Sparkles, UserRound } from 'lucide-react'
import type { RoutePreference, TransportMode } from '@/entities/route/types'
import type { UserType } from '@/entities/user/types'
import { useRouteSearchStore } from '@/features/route-search/routeSearchStore'
import { routeSearchSchema } from '@/features/route-search/schema'
import { useHomeSearchStore } from '@/features/home/home.store'
import type { TransportSegment } from '@/features/home/home.types'
import { ClimateStatusRow } from '@/features/home/components/ClimateStatusRow'
import styles from '@/pages/HomePage.module.css'

const transportSegments: TransportSegment[] = [
  { mode: 'WALK', label: '도보' },
  { mode: 'BUS_BRT', label: '버스·BRT' },
  { mode: 'BIKE', label: '자전거' },
  { mode: 'MIXED', label: '복합이동' },
]

const userTypeOptions: Array<{ type: UserType; label: string }> = [
  { type: 'GENERAL', label: '일반 성인' },
  { type: 'SENIOR', label: '고령자' },
  { type: 'CHILD', label: '아동/청소년' },
  { type: 'PREGNANT', label: '임산부' },
  { type: 'DISABLED', label: '장애인' },
  { type: 'OUTDOOR_WORKER', label: '야외근로자' },
]

const preferenceOptions: Array<{ preference: RoutePreference; label: string }> = [
  { preference: 'COOL', label: '시원하고 안전한 길 우선' },
  { preference: 'SAFE', label: '기후위험 낮은 길 우선' },
  { preference: 'TRANSIT', label: '대중교통 연계 우선' },
  { preference: 'NIGHT_SAFE', label: '야간 안전 우선' },
  { preference: 'SHORTEST', label: '최단 시간 비교' },
]

export function RouteSearchCard() {
  const navigate = useNavigate()
  const { values, updateValue } = useHomeSearchStore()
  const { setSearchParams } = useRouteSearchStore()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextSearchParams = {
      startPlace: values.startPlace,
      destination: values.destination,
      departureAt: values.departureAt,
      transportMode: values.transportMode,
      preference: values.preference,
      lowVisibilitySafety: true,
    }

    const parsed = routeSearchSchema.safeParse(nextSearchParams)

    if (!parsed.success) {
      return
    }

    setSearchParams(parsed.data)
    navigate('/user-type')
  }

  const updateUserType = (label: string) => {
    const option = userTypeOptions.find((item) => item.label === label)
    updateValue('userTypeLabel', label)
    updateValue('userType', option?.type ?? 'GENERAL')
  }

  const updatePreference = (label: string) => {
    const option = preferenceOptions.find((item) => item.label === label)
    updateValue('preferenceLabel', label)
    updateValue('preference', option?.preference ?? 'COOL')
  }

  return (
    <form className={styles.searchCard} onSubmit={handleSubmit}>
      <div className={styles.searchGrid}>
        <label className={styles.field}>
          <span>출발지</span>
          <div className={styles.fieldControl}>
            <MapPin size={18} />
            <input
              value={values.startPlace}
              onChange={(event) => updateValue('startPlace', event.target.value)}
              aria-label="출발지"
            />
          </div>
        </label>

        <label className={styles.field}>
          <span>목적지</span>
          <div className={styles.fieldControl}>
            <Navigation size={18} />
            <input
              value={values.destination}
              onChange={(event) => updateValue('destination', event.target.value)}
              aria-label="목적지"
            />
          </div>
        </label>

        <label className={styles.field}>
          <span>출발일시</span>
          <div className={styles.fieldControl}>
            <CalendarDays size={18} />
            <input
              value={values.departureAt}
              onChange={(event) => updateValue('departureAt', event.target.value)}
              aria-label="출발일시"
            />
          </div>
        </label>

        <label className={styles.field}>
          <span>사용자 유형</span>
          <div className={styles.fieldControl}>
            <UserRound size={18} />
            <select
              value={values.userTypeLabel}
              onChange={(event) => updateUserType(event.target.value)}
              aria-label="사용자 유형"
            >
              {userTypeOptions.map((option) => (
                <option key={option.type} value={option.label}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} aria-hidden="true" />
          </div>
        </label>
      </div>

      <div className={styles.searchGridSecondary}>
        <label className={styles.field}>
          <span>이동 우선</span>
          <div className={styles.fieldControl}>
            <Sparkles size={18} />
            <select
              value={values.preferenceLabel}
              onChange={(event) => updatePreference(event.target.value)}
              aria-label="이동 우선"
            >
              {preferenceOptions.map((option) => (
                <option key={option.preference} value={option.label}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} aria-hidden="true" />
          </div>
        </label>

        <fieldset className={styles.transportField}>
          <legend>이동수단</legend>
          <div className={styles.segmentedControl}>
            {transportSegments.map((segment) => (
              <button
                key={segment.mode}
                type="button"
                className={
                  values.transportMode === segment.mode ? styles.segmentSelected : undefined
                }
                onClick={() => updateValue('transportMode', segment.mode as TransportMode)}
              >
                {segment.label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className={styles.searchBottomRow}>
        <ClimateStatusRow />

        <div className={styles.ctaRow}>
          <button type="submit" className={styles.primaryCta} aria-label="AI 추천 경로 받기">
            <strong>AI 추천 경로 받기</strong>
            <span>기후위험을 고려한 최적 경로 추천</span>
          </button>
        </div>
      </div>
    </form>
  )
}
