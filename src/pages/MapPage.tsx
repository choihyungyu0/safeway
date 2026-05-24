import { useMemo, useState } from 'react'
import { useRouteSearchStore } from '@/features/route-search/routeSearchStore'
import { MapBottomActions } from '@/features/map/components/MapBottomActions'
import { MapMountArea } from '@/features/map/components/MapMountArea'
import { MapSearchBar } from '@/features/map/components/MapSearchBar'
import { RouteSummaryPanel } from '@/features/map/components/RouteSummaryPanel'
import { DEFAULT_SELECTED_ROUTE_ID } from '@/features/map/map.constants'
import { mockRecommendationResults } from '@/mocks/fixtures/recommendations'
import styles from '@/pages/MapPage.module.css'

export function MapPage() {
  const {
    searchParams,
    userType,
    selectedRecommendationId,
    setSearchParams,
    setUserType,
  } = useRouteSearchStore()
  const [searchStatus, setSearchStatus] = useState('')

  const selectedRecommendation = useMemo(
    () =>
      mockRecommendationResults.find((route) => route.id === selectedRecommendationId) ??
      mockRecommendationResults.find((route) => route.id === DEFAULT_SELECTED_ROUTE_ID) ??
      mockRecommendationResults[0],
    [selectedRecommendationId],
  )

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
          <MapMountArea />
          <RouteSummaryPanel recommendation={selectedRecommendation} />
        </section>

        <MapBottomActions />
      </div>
    </section>
  )
}
