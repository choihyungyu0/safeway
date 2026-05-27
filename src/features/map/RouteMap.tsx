import { useEffect, useMemo, useRef } from 'react'
import L, {
  type LatLngExpression,
  type LayerGroup,
  type Map as LeafletMap,
} from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { LatLng, SafeRouteRecommendation } from '@/entities/route/types'
import type { MapLayerKey, SafetyLayerPoint } from '@/mocks/fixtures/mapLayers'
import styles from '@/pages/MapPage.module.css'

type RouteMapProps = {
  recommendation: SafeRouteRecommendation
  activeLayers: Record<MapLayerKey, boolean>
  layerPoints: SafetyLayerPoint[]
}

const layerShortLabels: Record<MapLayerKey, string> = {
  climateRisk: '위험',
  shelters: '쉼터',
  busStops: 'BRT',
  cctv: 'CCTV',
  streetlights: '조명',
  riskSegments: '주의',
}

const tileLayerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

export function RouteMap({ recommendation, activeLayers, layerPoints }: RouteMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const overlayLayerRef = useRef<LayerGroup | null>(null)
  const visiblePoints = useMemo(
    () => layerPoints.filter((point) => activeLayers[point.layer]),
    [activeLayers, layerPoints],
  )

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return
    }

    const map = L.map(mapContainerRef.current, {
      center: toLeafletLatLng(getPathCenter(recommendation.path)),
      zoom: 14,
      scrollWheelZoom: true,
    })

    L.tileLayer(tileLayerUrl, {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map
    overlayLayerRef.current = L.layerGroup().addTo(map)

    return () => {
      map.remove()
      mapRef.current = null
      overlayLayerRef.current = null
    }
  }, [recommendation.path])

  useEffect(() => {
    const map = mapRef.current
    const overlayLayer = overlayLayerRef.current

    if (!map || !overlayLayer) {
      return
    }

    overlayLayer.clearLayers()

    const routePath = recommendation.path.map(toLeafletLatLng)
    const routeLine = L.polyline(routePath, {
      color: '#005bd8',
      opacity: 0.92,
      weight: 7,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(overlayLayer)

    L.marker(routePath[0], {
      icon: createRouteIcon('출발', styles.leafletStartMarker),
      zIndexOffset: 500,
    }).addTo(overlayLayer)

    L.marker(routePath[routePath.length - 1], {
      icon: createRouteIcon('도착', styles.leafletEndMarker),
      zIndexOffset: 500,
    }).addTo(overlayLayer)

    visiblePoints.forEach((point) => {
      L.marker(toLeafletLatLng(point.location), {
        icon: createLayerIcon(point),
        title: point.label,
      }).addTo(overlayLayer)
    })

    map.fitBounds(routeLine.getBounds(), { padding: [42, 42], maxZoom: 15 })
  }, [recommendation, visiblePoints])

  return (
    <div
      className={styles.routeMapFrame}
      aria-label="세종 세이프웨이 Leaflet 지도"
      data-testid="route-map"
    >
      <div ref={mapContainerRef} className={styles.leafletMap} />
      <div className={styles.leafletMapBadge}>Leaflet / OpenStreetMap</div>
      <div className={styles.routeScoreLabel}>
        기후안전 {recommendation.climateSafetyScore}점
      </div>
    </div>
  )
}

function createRouteIcon(label: string, toneClassName: string) {
  return L.divIcon({
    className: `${styles.leafletMarker} ${styles.leafletRouteMarker} ${toneClassName}`,
    html: `<span>${label}</span>`,
    iconAnchor: [22, 36],
  })
}

function createLayerIcon(point: SafetyLayerPoint) {
  return L.divIcon({
    className: `${styles.leafletMarker} ${styles.leafletLayerMarker} ${
      styles[point.layer]
    }`,
    html: `<strong>${layerShortLabels[point.layer]}</strong><span>${point.label}</span>`,
    iconAnchor: [20, 36],
  })
}

function getPathCenter(path: LatLng[]): LatLng {
  if (path.length === 0) {
    return { lat: 36.4801, lng: 127.2891 }
  }

  const totals = path.reduce(
    (sum, point) => ({
      lat: sum.lat + point.lat,
      lng: sum.lng + point.lng,
    }),
    { lat: 0, lng: 0 },
  )

  return {
    lat: totals.lat / path.length,
    lng: totals.lng / path.length,
  }
}

function toLeafletLatLng(point: LatLng): LatLngExpression {
  return [point.lat, point.lng]
}
