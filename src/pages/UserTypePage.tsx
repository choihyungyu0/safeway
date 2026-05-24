import { useState } from 'react'
import {
  CalendarDays,
  Check,
  Footprints,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { UserType } from '@/entities/user/types'
import {
  defaultSearchParams,
  getStoredUserType,
  useRouteSearchStore,
} from '@/features/route-search/routeSearchStore'
import {
  userTypeOptions,
  type UserTypeSelectionOption,
} from '@/features/user-type/options'
import { transportModeLabels, userTypeLabels } from '@/shared/constants/labels'
import styles from '@/pages/UserTypePage.module.css'

const summaryFallbacks = {
  startPlace: defaultSearchParams.startPlace,
  destination: defaultSearchParams.destination,
  departureAt: defaultSearchParams.departureAt,
  transportMode: defaultSearchParams.transportMode,
}

export function UserTypePage() {
  const navigate = useNavigate()
  const { searchParams, userType, setUserType } = useRouteSearchStore()
  const [hasSelectedUserType, setHasSelectedUserType] = useState(
    () => getStoredUserType() !== null,
  )

  const selectUserType = (nextUserType: UserType) => {
    setUserType(nextUserType)
    setHasSelectedUserType(true)
  }

  const skipUserType = () => {
    setUserType('GENERAL')
    navigate('/recommendations')
  }

  const continueToRecommendations = () => {
    setUserType(userType)
    navigate('/recommendations')
  }

  const summaryItems = [
    {
      id: 'startPlace',
      label: '출발지',
      value: searchParams.startPlace || summaryFallbacks.startPlace,
      icon: MapPin,
    },
    {
      id: 'destination',
      label: '도착지',
      value: searchParams.destination || summaryFallbacks.destination,
      icon: MapPin,
    },
    {
      id: 'departureAt',
      label: '출발일시',
      value: searchParams.departureAt || summaryFallbacks.departureAt,
      icon: CalendarDays,
    },
    {
      id: 'userType',
      label: '사용자 유형',
      value: hasSelectedUserType ? userTypeLabels[userType] : '선택 필요',
      icon: UserRound,
    },
    {
      id: 'transportMode',
      label: '이동수단',
      value: transportModeLabels[searchParams.transportMode || summaryFallbacks.transportMode],
      icon: Footprints,
    },
  ]

  return (
    <section className={styles.userTypePage}>
      <div className={styles.background} aria-hidden="true" />

      <section className={styles.panel} aria-labelledby="user-type-heading">
        <div className={styles.panelHeader}>
          <h1 id="user-type-heading">사용자 유형 선택</h1>
          <p>사용자 유형에 따라 더 정확하고 안전한 경로를 추천해 드립니다.</p>
        </div>

        <section className={styles.summaryBar} aria-label="경로 검색 요약">
          {summaryItems.map(({ id, label, value, icon: Icon }) => (
            <article className={styles.summaryItem} key={id}>
              <Icon className={styles.summaryIcon} size={28} aria-hidden="true" />
              <div>
                <p>{label}</p>
                <strong>{value}</strong>
              </div>
            </article>
          ))}
        </section>

        <section className={styles.typeGrid} aria-label="사용자 유형">
          {userTypeOptions.map((option) => (
            <UserTypeCard
              key={option.type}
              option={option}
              selected={userType === option.type}
              onSelect={selectUserType}
            />
          ))}
        </section>

        <section className={styles.privacyBanner} aria-labelledby="privacy-title">
          <div className={styles.privacyIcon}>
            <ShieldCheck size={30} aria-hidden="true" />
          </div>
          <div>
            <h2 id="privacy-title">안심하고 이용하세요</h2>
            <p>입력하신 개인 정보는 안전한 경로 추천을 위한 목적으로만 사용됩니다.</p>
          </div>
          <LockKeyhole className={styles.lockIcon} size={38} aria-hidden="true" />
        </section>

        <div className={styles.actions}>
          <button type="button" className={styles.skipButton} onClick={skipUserType}>
            건너뛰기
          </button>
          <button
            type="button"
            className={styles.nextButton}
            onClick={continueToRecommendations}
          >
            다음
          </button>
        </div>
      </section>
    </section>
  )
}

type UserTypeCardProps = {
  option: UserTypeSelectionOption
  selected: boolean
  onSelect: (userType: UserType) => void
}

function UserTypeCard({ option, selected, onSelect }: UserTypeCardProps) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <button
      type="button"
      className={`${styles.typeCard} ${selected ? styles.selected : ''}`}
      data-theme={option.theme}
      aria-pressed={selected}
      onClick={() => onSelect(option.type)}
    >
      {selected && (
        <span className={styles.checkBadge} aria-hidden="true">
          <Check size={21} strokeWidth={3} />
        </span>
      )}

      <span className={styles.typeIcon}>
        {imageFailed ? (
          <span className={styles.fallbackGlyph} aria-hidden="true">
            {option.fallbackGlyph}
          </span>
        ) : (
          <img
            src={option.iconSrc}
            alt={option.iconAlt}
            onError={() => setImageFailed(true)}
          />
        )}
      </span>

      <span className={styles.typeTitle}>{option.label}</span>
      <span className={styles.typeDescription}>{option.description}</span>
    </button>
  )
}
