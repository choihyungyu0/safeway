import { Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import type { SafeRouteRecommendation } from '@/entities/route/types'
import { recommendationTypeLabels } from '@/shared/constants/labels'
import { formatMeters, formatMinutes } from '@/shared/lib/format'
import { Badge } from '@/shared/ui/Badge'

type RecommendationCardProps = {
  recommendation: SafeRouteRecommendation
  selected?: boolean
  onSelect?: (recommendationId: string) => void
}

export function RecommendationCard({
  recommendation,
  selected = false,
  onSelect,
}: RecommendationCardProps) {
  return (
    <article className={`recommendation-card ${selected ? 'is-selected' : ''}`}>
      <div className="recommendation-card__header">
        <div>
          <Badge tone={recommendation.type === 'SHORTEST' ? 'gray' : 'teal'}>
            {recommendationTypeLabels[recommendation.type]}
          </Badge>
          <h2>{recommendation.title}</h2>
          <p>{recommendation.summary}</p>
        </div>
        <div
          className="score-ring"
          aria-label={`기후안전 점수 ${recommendation.climateSafetyScore}점`}
        >
          <ShieldCheck size={18} />
          <strong>{recommendation.climateSafetyScore}</strong>
        </div>
      </div>

      <dl className="recommendation-metrics">
        <div>
          <dt>총 소요시간</dt>
          <dd>{formatMinutes(recommendation.totalDurationMinutes)}</dd>
        </div>
        <div>
          <dt>외부 노출 감소</dt>
          <dd>{recommendation.outdoorExposureReductionPercent}%</dd>
        </div>
        <div>
          <dt>주변 쉼터</dt>
          <dd>{recommendation.shelterCount}개소</dd>
        </div>
        <div>
          <dt>거리</dt>
          <dd>{formatMeters(recommendation.distanceMeters)}</dd>
        </div>
      </dl>

      <p className="recommendation-reason">{recommendation.reason}</p>

      <div className="recommendation-card__actions">
        <button
          type="button"
          className="button button-secondary"
          onClick={() => onSelect?.(recommendation.id)}
        >
          비교 선택
        </button>
        <Link className="button button-primary" to="/map">
          지도에서 보기
        </Link>
      </div>
    </article>
  )
}
