import { Map, Polyline } from 'react-kakao-maps-sdk'
import type { SafeRouteRecommendation } from '@/entities/route/types'
import type { MapLayerKey, SafetyLayerPoint } from '@/mocks/fixtures/mapLayers'

type RouteMapProps = {
  recommendation: SafeRouteRecommendation
  activeLayers: Record<MapLayerKey, boolean>
  layerPoints: SafetyLayerPoint[]
}

export function RouteMap({ recommendation, activeLayers, layerPoints }: RouteMapProps) {
  const hasKakaoKey = Boolean(import.meta.env.VITE_KAKAO_MAP_APP_KEY)
  const visiblePoints = layerPoints.filter((point) => activeLayers[point.layer])

  if (hasKakaoKey) {
    return (
      <Map
        center={recommendation.path[0]}
        className="route-map"
        level={5}
        aria-label="세종 세이프웨이 경로 지도"
      >
        <Polyline
          path={recommendation.path}
          strokeWeight={6}
          strokeColor="#005BD8"
          strokeOpacity={0.9}
          strokeStyle="solid"
        />
      </Map>
    )
  }

  return (
    <div className="route-map route-map-fallback" role="img" aria-label="세종 안전 경로 모의 지도">
      <div className="mock-map-grid" />
      <svg viewBox="0 0 640 380" aria-hidden="true">
        <path
          d="M72 76 C168 94 170 174 270 178 S396 216 504 314"
          className="mock-route mock-route-shadow"
        />
        <path d="M72 76 C168 94 170 174 270 178 S396 216 504 314" className="mock-route" />
        <circle cx="72" cy="76" r="10" className="mock-point start" />
        <circle cx="504" cy="314" r="10" className="mock-point end" />
      </svg>
      <div className="map-label map-label-start">정부세종청사</div>
      <div className="map-label map-label-end">세종시청</div>
      <div className="map-layer-pins">
        {visiblePoints.map((point, index) => (
          <span
            key={point.id}
            className={`map-pin map-pin-${point.layer}`}
            style={{
              left: `${18 + index * 13}%`,
              top: `${24 + (index % 3) * 18}%`,
            }}
            title={point.label}
          >
            {point.label}
          </span>
        ))}
      </div>
    </div>
  )
}
