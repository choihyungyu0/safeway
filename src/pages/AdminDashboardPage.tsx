import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { AlertTriangle, BarChart3, Building2, Footprints, MapPinned, Tent } from 'lucide-react'
import { adminNavigationItems } from '@/features/admin/navigation'
import { getAdminDashboard } from '@/shared/api/safewayApi'
import { Badge } from '@/shared/ui/Badge'
import { MetricCard } from '@/shared/ui/MetricCard'
import { PageHeader } from '@/shared/ui/PageHeader'

export function AdminDashboardPage() {
  const { data: summary } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: getAdminDashboard,
  })

  return (
    <section className="page">
      <PageHeader
        eyebrow="운영자 대시보드"
        title="세종시 기후안전 이동 현황"
        description="고위험 보행축, 쉼터 공백, 임시 쉼터 후보, 추천 이용량을 한 화면에서 확인합니다."
        actions={
          <div className="page-header__actions">
            {adminNavigationItems.map((item) => (
              <Link key={item.to} className="button button-secondary" to={item.to}>
                {item.label}
              </Link>
            ))}
          </div>
        }
      />

      <div className="admin-metric-grid">
        <MetricCard
          label="고위험 지역"
          value={summary?.highRiskAreas ?? '-'}
          detail="폭염·저시정 중첩"
          icon={<AlertTriangle size={20} />}
        />
        <MetricCard
          label="쉼터 공백"
          value={summary?.shelterGaps ?? '-'}
          detail="300m 이상 이격"
          icon={<MapPinned size={20} />}
        />
        <MetricCard
          label="취약 보행 경로"
          value={summary?.vulnerableWalkingRoutes ?? '-'}
          detail="사용자 보정 필요"
          icon={<Footprints size={20} />}
        />
        <MetricCard
          label="임시 쉼터 후보"
          value={summary?.temporaryShelterCandidates ?? '-'}
          detail="공공시설 검토"
          icon={<Tent size={20} />}
        />
        <MetricCard
          label="추천 이용"
          value={summary?.recommendationUsage ?? '-'}
          detail="최근 7일"
          icon={<BarChart3 size={20} />}
        />
        <MetricCard
          label="시설 연계"
          value="BRT·CCTV"
          detail="레이어 정상"
          icon={<Building2 size={20} />}
        />
      </div>

      <div className="admin-grid">
        <article className="detail-panel">
          <h2>위험 유형 분포</h2>
          <div className="bar-list">
            {(summary?.riskTypeDistribution ?? []).map((item) => (
              <div key={item.label} className="bar-row">
                <span>{item.label}</span>
                <div aria-hidden="true">
                  <span style={{ width: `${item.value}%` }} />
                </div>
                <strong>{item.value}%</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="detail-panel">
          <h2>상위 위험 지역</h2>
          <div className="risk-area-list">
            {(summary?.topRiskAreas ?? []).map((area) => (
              <div key={area.name} className="risk-area-row">
                <Badge tone={area.score > 80 ? 'orange' : 'purple'}>{area.score}점</Badge>
                <div>
                  <strong>{area.name}</strong>
                  <p>{area.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}
