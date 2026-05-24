import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { MapPinned, PlusCircle } from 'lucide-react'
import { getShelterGaps } from '@/shared/api/safewayApi'
import { Badge } from '@/shared/ui/Badge'
import { PageHeader } from '@/shared/ui/PageHeader'

const priorityTone = {
  HIGH: 'orange',
  MEDIUM: 'purple',
  LOW: 'green',
} as const

export function AdminShelterGapPage() {
  const { data } = useQuery({
    queryKey: ['admin', 'shelter-gaps'],
    queryFn: getShelterGaps,
  })

  return (
    <section className="page">
      <PageHeader
        eyebrow="공간 분석"
        title="쉼터 공백 및 임시 후보"
        description="기후위험이 높은 보행축에서 가까운 쉼터가 부족한 구간과 임시 쉼터 후보지를 비교합니다."
        actions={
          <Link className="button button-secondary" to="/admin">
            대시보드
          </Link>
        }
      />

      <div className="admin-grid">
        <article className="detail-panel">
          <h2>쉼터 공백 지역</h2>
          <div className="gap-list">
            {(data?.gaps ?? []).map((gap) => (
              <div key={gap.id} className="gap-row">
                <MapPinned size={20} />
                <div>
                  <div className="row-title">
                    <strong>{gap.name}</strong>
                    <Badge tone={priorityTone[gap.priority]}>{gap.priority}</Badge>
                  </div>
                  <p>{gap.description}</p>
                  <small>
                    가까운 쉼터 {gap.nearestShelterDistanceMeters}m · 대상{' '}
                    {gap.vulnerableUsers.join(', ')}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="detail-panel">
          <h2>임시 쉼터 후보</h2>
          <div className="gap-list">
            {(data?.candidates ?? []).map((candidate) => (
              <div key={candidate.id} className="gap-row">
                <PlusCircle size={20} />
                <div>
                  <div className="row-title">
                    <strong>{candidate.name}</strong>
                    <Badge tone="teal">{candidate.estimatedCapacity}명</Badge>
                  </div>
                  <p>{candidate.reason}</p>
                  <small>{candidate.address}</small>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}
