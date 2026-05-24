import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Map, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { RecommendationCard } from '@/features/recommendation/RecommendationCard'
import { useRouteSearchStore } from '@/features/route-search/routeSearchStore'
import { createRecommendations } from '@/shared/api/safewayApi'
import { routePreferenceLabels, transportModeLabels, userTypeLabels } from '@/shared/constants/labels'
import { PageHeader } from '@/shared/ui/PageHeader'

export function RecommendationPage() {
  const {
    searchParams,
    userType,
    selectedRecommendationId,
    setSelectedRecommendationId,
  } = useRouteSearchStore()
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['recommendations', searchParams, userType],
    queryFn: () => createRecommendations({ params: searchParams, userType }),
  })

  return (
    <section className="page">
      <PageHeader
        eyebrow="AI 추천 결과"
        title="기후위험을 낮춘 경로 비교"
        description="세이프웨이는 최단시간보다 안전 점수, 야외 노출 감소, 쉼터 접근성을 함께 비교합니다."
        actions={
          <Link className="button button-primary" to="/map">
            <Map size={18} />
            지도에서 보기
          </Link>
        }
      />

      <div className="condition-strip">
        <span>{searchParams.startPlace}</span>
        <strong>→</strong>
        <span>{searchParams.destination}</span>
        <span>{transportModeLabels[searchParams.transportMode]}</span>
        <span>{routePreferenceLabels[searchParams.preference]}</span>
        <span>{userTypeLabels[userType]}</span>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <RefreshCw size={22} />
          추천 경로를 계산하고 있습니다.
        </div>
      ) : (
        <div className="recommendation-grid">
          {(recommendations ?? []).map((recommendation) => (
            <RecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
              selected={selectedRecommendationId === recommendation.id}
              onSelect={setSelectedRecommendationId}
            />
          ))}
        </div>
      )}

      <div className="inline-actions">
        <Link className="button button-secondary" to="/user-type">
          <ArrowLeft size={18} />
          사용자 유형 다시 선택
        </Link>
      </div>
    </section>
  )
}
