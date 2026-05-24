import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { DatabaseZap } from 'lucide-react'
import { getDataStatus } from '@/shared/api/safewayApi'
import { formatDateTime } from '@/shared/lib/format'
import { Badge } from '@/shared/ui/Badge'
import { PageHeader } from '@/shared/ui/PageHeader'

const statusTone = {
  NORMAL: 'green',
  DELAYED: 'orange',
  ERROR: 'purple',
} as const

const statusLabel = {
  NORMAL: '정상',
  DELAYED: '지연',
  ERROR: '오류',
}

export function AdminDataStatusPage() {
  const { data: statuses } = useQuery({
    queryKey: ['admin', 'data-status'],
    queryFn: getDataStatus,
  })

  return (
    <section className="page">
      <PageHeader
        eyebrow="공공데이터 상태"
        title="수집 데이터 점검"
        description="기상, 쉼터, CCTV, 교통 데이터의 수집 주기와 마지막 수집 시간을 확인합니다."
        actions={
          <Link className="button button-secondary" to="/admin">
            대시보드
          </Link>
        }
      />

      <div className="data-status-list">
        {(statuses ?? []).map((status) => (
          <article key={status.id} className="data-status-row">
            <DatabaseZap size={22} />
            <div>
              <div className="row-title">
                <h2>{status.datasetName}</h2>
                <Badge tone={statusTone[status.status]}>{statusLabel[status.status]}</Badge>
              </div>
              <dl className="inline-definition-list">
                <div>
                  <dt>제공기관</dt>
                  <dd>{status.provider}</dd>
                </div>
                <div>
                  <dt>수집주기</dt>
                  <dd>{status.collectionCycle}</dd>
                </div>
                <div>
                  <dt>마지막 수집</dt>
                  <dd>{formatDateTime(status.lastCollectedAt)}</dd>
                </div>
              </dl>
              {status.errorMessage ? <p className="status-warning">{status.errorMessage}</p> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
