import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { MapPinned, MessageSquare, ShieldCheck } from 'lucide-react'
import { RouteMap } from '@/features/map/RouteMap'
import { useRouteSearchStore } from '@/features/route-search/routeSearchStore'
import type { MapLayerKey } from '@/mocks/fixtures/mapLayers'
import { mapLayerOptions, mockSafetyLayerPoints } from '@/mocks/fixtures/mapLayers'
import { createRecommendations, getShelters } from '@/shared/api/safewayApi'
import { formatMeters, formatMinutes } from '@/shared/lib/format'
import { Badge } from '@/shared/ui/Badge'

const initialLayers = mapLayerOptions.reduce<Record<MapLayerKey, boolean>>(
  (layers, option) => ({
    ...layers,
    [option.key]: true,
  }),
  {
    climateRisk: true,
    shelters: true,
    busStops: true,
    cctv: true,
    streetlights: true,
    riskSegments: true,
  },
)

export function MapPage() {
  const { searchParams, userType, selectedRecommendationId } = useRouteSearchStore()
  const [activeLayers, setActiveLayers] = useState(initialLayers)
  const { data: recommendations } = useQuery({
    queryKey: ['recommendations', searchParams, userType],
    queryFn: () => createRecommendations({ params: searchParams, userType }),
  })
  const { data: shelters } = useQuery({
    queryKey: ['shelters'],
    queryFn: getShelters,
  })

  const recommendation = useMemo(
    () =>
      recommendations?.find((item) => item.id === selectedRecommendationId) ??
      recommendations?.[0],
    [recommendations, selectedRecommendationId],
  )
  const routeShelters =
    recommendation && shelters
      ? shelters.filter((shelter) => recommendation.nearShelterIds.includes(shelter.id))
      : []

  if (!recommendation) {
    return (
      <section className="page">
        <div className="loading-state">지도 경로를 준비하고 있습니다.</div>
      </section>
    )
  }

  return (
    <section className="page page-map">
      <div className="map-shell">
        <div className="map-main">
          <div className="map-toolbar">
            <div>
              <Badge tone="teal">지도 기반 안전 경로</Badge>
              <h1>{recommendation.title}</h1>
            </div>
            <div className="layer-toggle-group" aria-label="안전 레이어">
              {mapLayerOptions.map((layer) => (
                <label key={layer.key} className="chip-toggle">
                  <input
                    type="checkbox"
                    checked={activeLayers[layer.key]}
                    onChange={() =>
                      setActiveLayers((current) => ({
                        ...current,
                        [layer.key]: !current[layer.key],
                      }))
                    }
                  />
                  <span>{layer.label}</span>
                </label>
              ))}
            </div>
          </div>

          <RouteMap
            recommendation={recommendation}
            activeLayers={activeLayers}
            layerPoints={mockSafetyLayerPoints}
          />
        </div>

        <aside className="map-side-panel" aria-label="경로 안전 요약">
          <div className="panel-heading">
            <MapPinned size={20} />
            <h2>경로 요약</h2>
          </div>
          <dl className="stacked-metrics">
            <div>
              <dt>기후 안전 점수</dt>
              <dd>{recommendation.climateSafetyScore}점</dd>
            </div>
            <div>
              <dt>총 소요</dt>
              <dd>{formatMinutes(recommendation.totalDurationMinutes)}</dd>
            </div>
            <div>
              <dt>야외 노출 감소</dt>
              <dd>{recommendation.outdoorExposureReductionPercent}%</dd>
            </div>
            <div>
              <dt>전체 거리</dt>
              <dd>{formatMeters(recommendation.distanceMeters)}</dd>
            </div>
          </dl>

          <div className="panel-section">
            <h3>가까운 쉼터</h3>
            <div className="shelter-list">
              {routeShelters.map((shelter) => (
                <Link key={shelter.id} to={`/shelters/${shelter.id}`}>
                  <ShieldCheck size={17} />
                  <span>{shelter.name}</span>
                  <small>{shelter.distanceFromRouteMeters}m</small>
                </Link>
              ))}
            </div>
          </div>

          <Link className="button button-primary button-wide" to={`/feedback/${recommendation.routeLogId}`}>
            <MessageSquare size={18} />
            이동 후 피드백 남기기
          </Link>
        </aside>
      </div>
    </section>
  )
}
