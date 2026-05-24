import { useState } from 'react'
import {
  CalendarDays,
  Footprints,
  MapPin,
  RefreshCw,
  UserRound,
} from 'lucide-react'
import type { RouteSearchParams, TransportMode } from '@/entities/route/types'
import { userTypes, type UserType } from '@/entities/user/types'
import {
  defaultSearchParams,
  isUserType,
} from '@/features/route-search/routeSearchStore'
import { transportModeLabels, userTypeLabels } from '@/shared/constants/labels'
import styles from '@/pages/MapPage.module.css'

type MapSearchBarProps = {
  searchParams: RouteSearchParams
  userType: UserType
  statusMessage: string
  onSearchUpdate: (searchParams: RouteSearchParams, userType: UserType) => void
}

const transportModes: TransportMode[] = ['WALK', 'BUS_BRT', 'BIKE', 'MIXED']

export function MapSearchBar({
  searchParams,
  userType,
  statusMessage,
  onSearchUpdate,
}: MapSearchBarProps) {
  const [startPlace, setStartPlace] = useState(
    searchParams.startPlace || defaultSearchParams.startPlace,
  )
  const [destination, setDestination] = useState(
    searchParams.destination || defaultSearchParams.destination,
  )
  const [transportMode, setTransportMode] = useState<TransportMode>(
    searchParams.transportMode || defaultSearchParams.transportMode,
  )
  const [departureAt, setDepartureAt] = useState(
    searchParams.departureAt || defaultSearchParams.departureAt,
  )
  const [selectedUserType, setSelectedUserType] = useState<UserType>(userType)

  const submitSearch = () => {
    onSearchUpdate(
      {
        ...searchParams,
        startPlace,
        destination,
        transportMode,
        departureAt,
      },
      selectedUserType,
    )
  }

  return (
    <section className={styles.filterPanel} aria-label="경로 검색 조건">
      <label className={styles.filterItem}>
        <span className={styles.filterLabel}>
          <MapPin size={20} aria-hidden="true" />
          출발지
        </span>
        <select value={startPlace} onChange={(event) => setStartPlace(event.target.value)}>
          <option value="정부세종청사 1동">정부세종청사 1동</option>
        </select>
      </label>

      <label className={styles.filterItem}>
        <span className={`${styles.filterLabel} ${styles.tealLabel}`}>
          <MapPin size={20} aria-hidden="true" />
          목적지
        </span>
        <select value={destination} onChange={(event) => setDestination(event.target.value)}>
          <option value="세종특별자치시청">세종특별자치시청</option>
        </select>
      </label>

      <label className={styles.filterItem}>
        <span className={styles.filterLabel}>
          <Footprints size={20} aria-hidden="true" />
          이동수단
        </span>
        <select
          value={transportMode}
          onChange={(event) => setTransportMode(event.target.value as TransportMode)}
        >
          {transportModes.map((mode) => (
            <option value={mode} key={mode}>
              {transportModeLabels[mode]}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.filterItem}>
        <span className={styles.filterLabel}>
          <CalendarDays size={20} aria-hidden="true" />
          출발일시
        </span>
        <input
          type="text"
          value={departureAt}
          onChange={(event) => setDepartureAt(event.target.value)}
        />
      </label>

      <label className={styles.filterItem}>
        <span className={`${styles.filterLabel} ${styles.tealLabel}`}>
          <UserRound size={20} aria-hidden="true" />
          사용자 유형
        </span>
        <select
          value={selectedUserType}
          onChange={(event) => {
            const nextUserType = event.target.value
            if (isUserType(nextUserType)) {
              setSelectedUserType(nextUserType)
            }
          }}
        >
          {userTypes.map((type) => (
            <option value={type} key={type}>
              {userTypeLabels[type]}
            </option>
          ))}
        </select>
      </label>

      <button type="button" className={styles.searchButton} onClick={submitSearch}>
        <RefreshCw size={23} aria-hidden="true" />
        다시 검색
      </button>

      {statusMessage && (
        <p className={styles.statusMessage} role="status">
          {statusMessage}
        </p>
      )}
    </section>
  )
}
