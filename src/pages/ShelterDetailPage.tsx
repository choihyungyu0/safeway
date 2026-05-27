import { useEffect, useRef, useState, type ComponentType } from 'react'
import { useQuery } from '@tanstack/react-query'
import L, { type LatLngExpression, type Map as LeafletMap, type Marker } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Armchair,
  Building2,
  ChevronRight,
  Clock,
  Droplets,
  HeartPulse,
  Home,
  MapPin,
  PlusCircle,
  Route,
  Snowflake,
  Toilet,
  TreePine,
  Users,
  Wifi,
} from 'lucide-react'
import type { Shelter, ShelterFacility } from '@/entities/shelter/types'
import { useShelterRouteStore } from '@/features/shelter/shelter.store'
import { shelterFacilityLabels } from '@/features/shelter/facilityLabels'
import { getShelterById } from '@/shared/api/safewayApi'
import styles from '@/pages/ShelterDetailPage.module.css'

type FacilityKey = keyof ShelterFacility

type ShelterStatusItem = {
  id: string
  label: string
  value: string
  tone: 'blue' | 'green'
  icon: ComponentType<{ size?: number; strokeWidth?: number; 'aria-hidden'?: boolean }>
}

const facilityOrder: FacilityKey[] = ['cooling', 'seating', 'water', 'restroom', 'wifi', 'aed']
const tileLayerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

const facilityIcons: Record<FacilityKey, typeof Snowflake> = {
  cooling: Snowflake,
  seating: Armchair,
  water: Droplets,
  restroom: Toilet,
  wifi: Wifi,
  aed: HeartPulse,
}

const shelterTypeLabels: Record<Shelter['type'], string> = {
  COOLING_CENTER: '실내 쉼터',
  PUBLIC_FACILITY: '실내 쉼터',
  TRANSIT_SHELTER: '환승 쉼터',
  PARK_REST: '공원 쉼터',
}

const statusLabels: Record<Shelter['status'], string> = {
  OPEN: '운영중',
  LIMITED: '부분 운영',
  CLOSED: '운영 종료',
}

export function ShelterDetailPage() {
  const { shelterId = 'shelter-001' } = useParams()
  const navigate = useNavigate()
  const [statusMessage, setStatusMessage] = useState('')
  const { data: shelter, isLoading } = useQuery({
    queryKey: ['shelter', shelterId],
    queryFn: () => getShelterById(shelterId),
  })
  const isShelterAdded = useShelterRouteStore((state) =>
    shelter ? state.isShelterAdded(shelter.id) : false,
  )
  const addShelterToRoute = useShelterRouteStore((state) => state.addShelterToRoute)
  const focusShelterOnMap = useShelterRouteStore((state) => state.focusShelterOnMap)

  if (isLoading) {
    return (
      <section className={styles.shelterPage}>
        <div className={styles.content}>
          <div className={styles.loadingState}>쉼터 정보를 불러오고 있습니다.</div>
        </div>
      </section>
    )
  }

  if (!shelter) {
    return (
      <section className={styles.shelterPage}>
        <div className={styles.content}>
          <div className={styles.emptyState}>
            <h1>쉼터를 찾을 수 없습니다</h1>
            <p>선택한 쉼터 정보가 변경되었거나 mock 데이터에 없습니다.</p>
            <Link to="/map">지도로 돌아가기</Link>
          </div>
        </div>
      </section>
    )
  }

  const statusItems: ShelterStatusItem[] = [
    {
      id: 'operationTime',
      label: '운영시간',
      value: shelter.operationTime,
      tone: 'blue',
      icon: Clock,
    },
    {
      id: 'capacity',
      label: '수용인원',
      value: `${shelter.capacity}명`,
      tone: 'blue',
      icon: Users,
    },
    {
      id: 'crowding',
      label: '현재 혼잡도',
      value: shelter.crowdingLevel,
      tone: 'green',
      icon: TreePine,
    },
    {
      id: 'distance',
      label: '현재 경로에서 거리',
      value: `${shelter.distanceFromRouteMeters}m (${shelter.walkingTimeMin}분)`,
      tone: 'blue',
      icon: Route,
    },
  ]

  const addCurrentShelter = () => {
    addShelterToRoute(shelter.id)
    setStatusMessage('쉼터가 경로에 추가되었습니다.')
  }

  const viewShelterOnMap = () => {
    focusShelterOnMap(shelter.id)
    navigate('/map', { state: { focusShelterId: shelter.id } })
  }

  return (
    <section className={styles.shelterPage}>
      <div className={styles.content}>
        <ShelterBreadcrumb />

        <section className={styles.detailGrid} aria-label="쉼터 상세 정보">
          <article className={styles.shelterCard}>
            <ShelterLocationMap shelter={shelter} />

            <div className={styles.shelterInfo}>
              <h1>{shelter.name}</h1>

              <div className={styles.badgeRow} aria-label="쉼터 상태">
                <span className={styles.typeBadge}>
                  <Building2 size={20} aria-hidden="true" />
                  {shelterTypeLabels[shelter.type]}
                </span>
                <span className={styles.openBadge}>{statusLabels[shelter.status]}</span>
              </div>

              <div className={styles.bottomRow}>
                <p className={styles.address}>
                  <MapPin size={25} aria-hidden="true" />
                  {shelter.address}
                </p>

                <button
                  type="button"
                  className={styles.mapButton}
                  onClick={viewShelterOnMap}
                >
                  <MapPin size={19} aria-hidden="true" />
                  지도에서 보기
                </button>
              </div>
            </div>
          </article>

          <aside className={styles.statusPanel} aria-label="쉼터 운영 요약">
            {statusItems.map((item) => (
              <ShelterStatusRow key={item.id} item={item} />
            ))}
          </aside>
        </section>

        <section className={styles.facilityCard} aria-labelledby="facility-heading">
          <h2 id="facility-heading">주요 편의시설</h2>

          <div className={styles.facilityGrid}>
            {facilityOrder.map((facility) => (
              <ShelterFacilityCard
                key={facility}
                facility={facility}
                available={shelter.facilities[facility]}
              />
            ))}
          </div>
        </section>

        <button
          type="button"
          className={styles.addRouteButton}
          onClick={addCurrentShelter}
          aria-pressed={isShelterAdded}
        >
          <PlusCircle size={31} aria-hidden="true" />
          {isShelterAdded ? '경로에 추가됨' : '경로에 추가'}
        </button>

        {statusMessage && (
          <p className={styles.toast} role="status">
            {statusMessage}
          </p>
        )}

      </div>
    </section>
  )
}

function ShelterBreadcrumb() {
  return (
    <nav className={styles.breadcrumb} aria-label="breadcrumb">
      <Link to="/">
        <Home size={18} aria-hidden="true" />
        홈
      </Link>
      <ChevronRight size={17} aria-hidden="true" />
      <Link to="/shelters">쉼터</Link>
      <ChevronRight size={17} aria-hidden="true" />
      <span aria-current="page">쉼터 상세</span>
    </nav>
  )
}

function ShelterLocationMap({ shelter }: { shelter: Shelter }) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const markerRef = useRef<Marker | null>(null)
  const initialLocationRef = useRef(shelter.location)
  const { lat, lng } = shelter.location

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return
    }

    const map = L.map(mapContainerRef.current, {
      center: toLeafletLatLng(initialLocationRef.current),
      zoom: 16,
      scrollWheelZoom: true,
    })

    L.tileLayer(tileLayerUrl, {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current

    if (!map) {
      return
    }

    const position = toLeafletLatLng({ lat, lng })
    map.setView(position, 16)

    markerRef.current?.remove()
    markerRef.current = L.marker(position, {
      icon: createShelterLocationIcon(),
      title: shelter.name,
      zIndexOffset: 500,
    }).addTo(map)

    const resizeTimer = window.setTimeout(() => map.invalidateSize(), 80)

    return () => window.clearTimeout(resizeTimer)
  }, [lat, lng, shelter.name])

  return (
    <div
      className={styles.locationMapWrap}
      aria-label={`${shelter.name} 위치 지도`}
      data-testid="shelter-location-map"
    >
      <div ref={mapContainerRef} className={styles.shelterMap} />
      <div className={styles.shelterMapBadge}>Leaflet / OpenStreetMap</div>
      <div className={styles.shelterMapAddress}>
        <MapPin size={18} aria-hidden="true" />
        <span>{shelter.address}</span>
      </div>
    </div>
  )
}

function createShelterLocationIcon() {
  return L.divIcon({
    className: styles.shelterLocationMarker,
    html: '<span aria-hidden="true"></span>',
    iconAnchor: [18, 36],
  })
}

function toLeafletLatLng(location: Shelter['location']): LatLngExpression {
  return [location.lat, location.lng]
}

function ShelterStatusRow({ item }: { item: ShelterStatusItem }) {
  const Icon = item.icon

  return (
    <article className={styles.statusRow}>
      <span className={`${styles.statusIcon} ${styles[item.tone]}`} aria-hidden="true">
        <Icon size={45} strokeWidth={1.9} />
      </span>
      <div>
        <p>{item.label}</p>
        <strong className={item.tone === 'green' ? styles.greenValue : undefined}>
          {item.value}
        </strong>
      </div>
    </article>
  )
}

function ShelterFacilityCard({
  facility,
  available,
}: {
  facility: FacilityKey
  available: boolean
}) {
  const Icon = facilityIcons[facility]
  const label = shelterFacilityLabels[facility]
  const isGreen = facility === 'aed'

  return (
    <article
      className={`${styles.facilityItem} ${available ? styles.available : styles.unavailable}`}
      aria-label={`${label}${available ? ' 이용 가능' : ' 이용 불가'}`}
    >
      <span className={`${styles.facilityIcon} ${isGreen ? styles.facilityGreen : ''}`}>
        <Icon size={48} strokeWidth={1.9} aria-hidden="true" />
      </span>
      <p>{label}</p>
    </article>
  )
}
