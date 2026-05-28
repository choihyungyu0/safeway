import { useState } from 'react'
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Footprints,
  MapPin,
  RefreshCw,
  UserRound,
} from 'lucide-react'
import type { RouteSearchParams, TransportMode } from '@/entities/route/types'
import { userTypes, type UserType } from '@/entities/user/types'
import { defaultSearchParams, isUserType } from '@/features/route-search/routeSearchStore'
import { transportModeLabels, userTypeLabels } from '@/shared/constants/labels'
import styles from '@/pages/MapPage.module.css'

type MapSearchBarProps = {
  searchParams: RouteSearchParams
  userType: UserType
  statusMessage: string
  onSearchUpdate: (searchParams: RouteSearchParams, userType: UserType) => void
}

type ActivePicker = 'start' | 'destination' | 'departure' | null

type PlaceOption = {
  value: string
  title: string
  meta: string
}

const transportModes: TransportMode[] = ['WALK', 'BUS_BRT', 'BIKE', 'MIXED']

const placeOptions: PlaceOption[] = [
  {
    value: '정부세종청사 1동',
    title: '정부세종청사 1동',
    meta: '어진동 · 행정 중심 출발지',
  },
  {
    value: '세종특별자치시청',
    title: '세종특별자치시청',
    meta: '보람동 · 시민 행정 거점',
  },
  {
    value: '세종호수공원',
    title: '세종호수공원',
    meta: '세종동 · 그늘길과 수변 산책로',
  },
  {
    value: '나성동 BRT 정류장',
    title: '나성동 BRT 정류장',
    meta: '나성동 · BRT 환승 접근',
  },
  {
    value: '도담동 주민센터',
    title: '도담동 주민센터',
    meta: '도담동 · 생활권 공공시설',
  },
  {
    value: '금강보행교',
    title: '금강보행교',
    meta: '세종동 · 강변 저시정 주의',
  },
]

const timeOptions = ['09:00', '12:00', '14:00', '18:00', '21:00']
const weekdayLabels = ['일', '월', '화', '수', '목', '금', '토']

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
  const [activePicker, setActivePicker] = useState<ActivePicker>(null)
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const initialDeparture = parseDepartureAt(
      searchParams.departureAt || defaultSearchParams.departureAt,
    )

    return {
      year: initialDeparture.year,
      month: initialDeparture.month,
    }
  })

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
    setActivePicker(null)
  }

  const departureDate = parseDepartureAt(departureAt)
  const selectedCalendarDay =
    departureDate.year === calendarMonth.year &&
    departureDate.month === calendarMonth.month
      ? departureDate.day
      : null

  const openPicker = (picker: ActivePicker) => {
    if (picker === 'departure') {
      const parsedDeparture = parseDepartureAt(departureAt)
      setCalendarMonth({
        year: parsedDeparture.year,
        month: parsedDeparture.month,
      })
    }

    setActivePicker((current) => (current === picker ? null : picker))
  }

  const updatePlace = (target: 'start' | 'destination', value: string) => {
    if (target === 'start') {
      setStartPlace(value)
    } else {
      setDestination(value)
    }

    setActivePicker(null)
  }

  const updateCalendarMonth = (offset: number) => {
    setCalendarMonth((current) => {
      const nextMonth = new Date(current.year, current.month - 1 + offset, 1)

      return {
        year: nextMonth.getFullYear(),
        month: nextMonth.getMonth() + 1,
      }
    })
  }

  const updateDepartureDay = (day: number) => {
    setDepartureAt(
      formatDepartureAt(
        {
          ...departureDate,
          year: calendarMonth.year,
          month: calendarMonth.month,
          day,
        },
        departureDate.time,
      ),
    )
  }

  const updateDepartureTime = (time: string) => {
    setDepartureAt(formatDepartureAt(departureDate, time))
    setActivePicker(null)
  }

  return (
    <section className={styles.filterPanel} aria-label="경로 검색 조건">
      <div className={styles.filterItem}>
        <span className={styles.filterLabel} id="map-start-place-label">
          <MapPin size={20} aria-hidden="true" />
          출발지
        </span>
        <button
          type="button"
          className={`${styles.pickerButton} ${
            activePicker === 'start' ? styles.pickerButtonOpen : ''
          }`}
          aria-labelledby="map-start-place-label map-start-place-value"
          aria-haspopup="listbox"
          aria-expanded={activePicker === 'start'}
          aria-controls="map-start-place-options"
          onClick={() => openPicker('start')}
        >
          <span id="map-start-place-value">{getPlaceOption(startPlace).title}</span>
          <small>{getPlaceOption(startPlace).meta}</small>
          <ChevronDown size={17} aria-hidden="true" />
        </button>

        {activePicker === 'start' && (
          <PlacePicker
            id="map-start-place-options"
            label="출발지 후보"
            selectedValue={startPlace}
            onSelect={(value) => updatePlace('start', value)}
          />
        )}
      </div>

      <div className={styles.filterItem}>
        <span
          className={`${styles.filterLabel} ${styles.tealLabel}`}
          id="map-destination-label"
        >
          <MapPin size={20} aria-hidden="true" />
          목적지
        </span>
        <button
          type="button"
          className={`${styles.pickerButton} ${
            activePicker === 'destination' ? styles.pickerButtonOpen : ''
          }`}
          aria-labelledby="map-destination-label map-destination-value"
          aria-haspopup="listbox"
          aria-expanded={activePicker === 'destination'}
          aria-controls="map-destination-options"
          onClick={() => openPicker('destination')}
        >
          <span id="map-destination-value">{getPlaceOption(destination).title}</span>
          <small>{getPlaceOption(destination).meta}</small>
          <ChevronDown size={17} aria-hidden="true" />
        </button>

        {activePicker === 'destination' && (
          <PlacePicker
            id="map-destination-options"
            label="목적지 후보"
            selectedValue={destination}
            onSelect={(value) => updatePlace('destination', value)}
          />
        )}
      </div>

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

      <div className={styles.filterItem}>
        <span className={styles.filterLabel} id="map-departure-label">
          <CalendarDays size={20} aria-hidden="true" />
          출발일시
        </span>
        <button
          type="button"
          className={`${styles.pickerButton} ${
            activePicker === 'departure' ? styles.pickerButtonOpen : ''
          }`}
          aria-labelledby="map-departure-label map-departure-value"
          aria-haspopup="dialog"
          aria-expanded={activePicker === 'departure'}
          aria-controls="map-departure-calendar"
          onClick={() => openPicker('departure')}
        >
          <span id="map-departure-value">{departureAt}</span>
          <small>시간대별 기후안전 반영</small>
          <ChevronDown size={17} aria-hidden="true" />
        </button>

        {activePicker === 'departure' && (
          <div
            className={`${styles.pickerPopover} ${styles.calendarPopover}`}
            id="map-departure-calendar"
            role="dialog"
            aria-label="출발일시 선택"
          >
            <div className={styles.calendarHeader}>
              <button
                type="button"
                aria-label="이전 달"
                onClick={() => updateCalendarMonth(-1)}
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
              <strong>
                {calendarMonth.year}년 {calendarMonth.month}월
              </strong>
              <button
                type="button"
                aria-label="다음 달"
                onClick={() => updateCalendarMonth(1)}
              >
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>

            <div className={styles.calendarWeekdays} aria-hidden="true">
              {weekdayLabels.map((weekday) => (
                <span key={weekday}>{weekday}</span>
              ))}
            </div>

            <div className={styles.calendarGrid}>
              {getCalendarCells(calendarMonth.year, calendarMonth.month).map(
                (day, index) =>
                  day ? (
                    <button
                      type="button"
                      className={
                        day === selectedCalendarDay ? styles.calendarDaySelected : ''
                      }
                      aria-pressed={day === selectedCalendarDay}
                      aria-label={`${day}일 선택`}
                      onClick={() => updateDepartureDay(day)}
                      key={`${calendarMonth.year}-${calendarMonth.month}-${day}`}
                    >
                      {day}
                    </button>
                  ) : (
                    <span
                      className={styles.calendarBlank}
                      aria-hidden="true"
                      key={`blank-${index}`}
                    />
                  ),
              )}
            </div>

            <div className={styles.timeGrid} aria-label="출발 시간">
              {timeOptions.map((time) => (
                <button
                  type="button"
                  className={time === departureDate.time ? styles.timeChipSelected : ''}
                  aria-pressed={time === departureDate.time}
                  onClick={() => updateDepartureTime(time)}
                  key={time}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

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
        <span>다시 검색</span>
      </button>

      {statusMessage && (
        <p className={styles.statusMessage} role="status">
          {statusMessage}
        </p>
      )}
    </section>
  )
}

function PlacePicker({
  id,
  label,
  selectedValue,
  onSelect,
}: {
  id: string
  label: string
  selectedValue: string
  onSelect: (value: string) => void
}) {
  return (
    <div className={styles.pickerPopover} id={id} role="listbox" aria-label={label}>
      {placeOptions.map((place) => (
        <button
          type="button"
          className={styles.placeOption}
          role="option"
          aria-selected={place.value === selectedValue}
          onClick={() => onSelect(place.value)}
          key={place.value}
        >
          <span>{place.title}</span>
          <small>{place.meta}</small>
        </button>
      ))}
    </div>
  )
}

function getPlaceOption(value: string): PlaceOption {
  return (
    placeOptions.find((place) => place.value === value) ?? {
      value,
      title: value,
      meta: '직접 입력한 장소',
    }
  )
}

function parseDepartureAt(value: string) {
  const match = /(\d{4})\.(\d{2})\.(\d{2}).*?(\d{2}:\d{2})/.exec(value)

  if (!match) {
    return {
      year: 2025,
      month: 6,
      day: 21,
      time: '14:00',
    }
  }

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    time: match[4],
  }
}

function formatDepartureAt(
  date: { year: number; month: number; day: number },
  time: string,
) {
  const nextDate = new Date(date.year, date.month - 1, date.day)
  const weekday = weekdayLabels[nextDate.getDay()]

  return `${date.year}.${padDateNumber(date.month)}.${padDateNumber(
    date.day,
  )} (${weekday}) ${time}`
}

function getCalendarCells(year: number, month: number): Array<number | null> {
  const firstWeekday = new Date(year, month - 1, 1).getDay()
  const lastDay = new Date(year, month, 0).getDate()

  return [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: lastDay }, (_, index) => index + 1),
  ]
}

function padDateNumber(value: number) {
  return String(value).padStart(2, '0')
}
