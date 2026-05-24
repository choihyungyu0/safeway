import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import {
  Armchair,
  Droplets,
  HeartPulse,
  Snowflake,
  Toilet,
  Wifi,
} from 'lucide-react'
import type { ShelterFacility } from '@/entities/shelter/types'
import { shelterFacilityLabels } from '@/features/shelter/facilityLabels'
import { getShelterById } from '@/shared/api/safewayApi'
import { Badge } from '@/shared/ui/Badge'
import { PageHeader } from '@/shared/ui/PageHeader'

const facilityIcons: Record<keyof ShelterFacility, typeof Snowflake> = {
  cooling: Snowflake,
  seating: Armchair,
  water: Droplets,
  restroom: Toilet,
  wifi: Wifi,
  aed: HeartPulse,
}

const shelterTypeLabels = {
  COOLING_CENTER: '무더위쉼터',
  PUBLIC_FACILITY: '공공시설',
  TRANSIT_SHELTER: '환승쉼터',
  PARK_REST: '공원 휴게공간',
}

const statusLabels = {
  OPEN: '운영 중',
  LIMITED: '부분 운영',
  CLOSED: '운영 종료',
}

export function ShelterDetailPage() {
  const { shelterId = '' } = useParams()
  const { data: shelter, isLoading } = useQuery({
    queryKey: ['shelter', shelterId],
    queryFn: () => getShelterById(shelterId),
  })

  if (isLoading) {
    return (
      <section className="page">
        <div className="loading-state">쉼터 정보를 불러오고 있습니다.</div>
      </section>
    )
  }

  if (!shelter) {
    return (
      <section className="page">
        <PageHeader
          title="쉼터를 찾을 수 없습니다"
          description="선택한 쉼터 정보가 변경되었거나 mock 데이터에 없습니다."
        />
        <Link className="button button-secondary" to="/map">
          지도로 돌아가기
        </Link>
      </section>
    )
  }

  return (
    <section className="page">
      <PageHeader
        eyebrow="쉬어갈 수 있는 곳"
        title={shelter.name}
        description="경로 주변에서 이용 가능한 공공 쉼터 정보를 확인합니다."
        actions={<Badge tone={shelter.status === 'OPEN' ? 'green' : 'orange'}>{statusLabels[shelter.status]}</Badge>}
      />

      <div className="detail-grid">
        <article className="detail-panel">
          <h2>운영 정보</h2>
          <dl className="stacked-metrics">
            <div>
              <dt>유형</dt>
              <dd>{shelterTypeLabels[shelter.type]}</dd>
            </div>
            <div>
              <dt>주소</dt>
              <dd>{shelter.address}</dd>
            </div>
            <div>
              <dt>운영시간</dt>
              <dd>{shelter.operationTime}</dd>
            </div>
            <div>
              <dt>수용 인원</dt>
              <dd>{shelter.capacity}명</dd>
            </div>
            <div>
              <dt>경로 이탈 거리</dt>
              <dd>{shelter.distanceFromRouteMeters}m</dd>
            </div>
          </dl>
        </article>

        <article className="detail-panel">
          <h2>시설 아이콘</h2>
          <div className="facility-grid">
            {(Object.entries(shelter.facilities) as Array<[keyof ShelterFacility, boolean]>).map(
              ([facility, available]) => {
                const Icon = facilityIcons[facility]

                return (
                  <span key={facility} className={available ? 'facility is-on' : 'facility'}>
                    <Icon size={19} />
                    {shelterFacilityLabels[facility]}
                  </span>
                )
              },
            )}
          </div>
        </article>
      </div>
    </section>
  )
}
