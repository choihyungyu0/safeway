import { useMemo, useState } from 'react'
import { useRouteSearchStore } from '@/features/route-search/routeSearchStore'
import { MapBottomActions } from '@/features/map/components/MapBottomActions'
import { MapSearchBar } from '@/features/map/components/MapSearchBar'
import { RouteSummaryPanel } from '@/features/map/components/RouteSummaryPanel'
import { DEFAULT_SELECTED_ROUTE_ID } from '@/features/map/map.constants'
import { RouteMap } from '@/features/map/RouteMap'
import type { MapLayerKey } from '@/mocks/fixtures/mapLayers'
import { mapLayerOptions, mockSafetyLayerPoints } from '@/mocks/fixtures/mapLayers'
import { mockRecommendationResults } from '@/mocks/fixtures/recommendations'
import styles from '@/pages/MapPage.module.css'

const initialActiveLayers: Record<MapLayerKey, boolean> = {
  climateRisk: true,
  shelters: true,
  busStops: true,
  cctv: true,
  streetlights: true,
  riskSegments: true,
}

export function MapPage() {
  const {
    searchParams,
    userType,
    selectedRecommendationId,
    setSearchParams,
    setUserType,
  } = useRouteSearchStore()
  const [searchStatus, setSearchStatus] = useState('')
  const [activeLayers, setActiveLayers] =
    useState<Record<MapLayerKey, boolean>>(initialActiveLayers)

  const selectedRecommendation = useMemo(
    () =>
      mockRecommendationResults.find((route) => route.id === selectedRecommendationId) ??
      mockRecommendationResults.find((route) => route.id === DEFAULT_SELECTED_ROUTE_ID) ??
      mockRecommendationResults[0],
    [selectedRecommendationId],
  )

  const toggleLayer = (layer: MapLayerKey) => {
    setActiveLayers((current) => ({ ...current, [layer]: !current[layer] }))
  }

  return (
    <section className={styles.mapPage} aria-label="지도 보기">
      <div className={styles.content}>
        <MapSearchBar
          searchParams={searchParams}
          userType={userType}
          statusMessage={searchStatus}
          onSearchUpdate={(nextSearchParams, nextUserType) => {
            setSearchParams(nextSearchParams)
            setUserType(nextUserType)
            setSearchStatus('검색 조건이 업데이트되었습니다.')
          }}
        />

        <section className={styles.mapLayout} aria-label="경로 지도 및 안전 분석">
          <section className={styles.mapCard} aria-label="지도 표시 영역">
            <div className={styles.mapLayerToolbar} aria-label="안전 레이어">
              {mapLayerOptions.map((layer) => (
                <button
                  type="button"
                  className={`${styles.layerButton} ${
                    activeLayers[layer.key] ? styles.layerButtonActive : ''
                  }`}
                  aria-pressed={activeLayers[layer.key]}
                  onClick={() => toggleLayer(layer.key)}
                  key={layer.key}
                >
                  {layer.label}
                </button>
              ))}
            </div>

            <RouteMap
              recommendation={selectedRecommendation}
              activeLayers={activeLayers}
              layerPoints={mockSafetyLayerPoints}
            />
          </section>

          <RouteSummaryPanel recommendation={selectedRecommendation} />
        </section>

        <MapBottomActions />
      </div>
    </section>
  )
}
