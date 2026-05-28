import { useEffect, useMemo, useRef } from 'react'
import L, {
  type FitBoundsOptions,
  type LatLngExpression,
  type LayerGroup,
  type Map as LeafletMap,
  type PopupOptions,
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

const layerDescriptions: Record<MapLayerKey, string> = {
  climateRisk:
    '직사광선과 열섬 위험이 높아 우회하거나 쉬어갈 곳을 함께 확인해야 하는 구간입니다.',
  shelters: '더위와 한파 때 잠시 쉬어갈 수 있는 가까운 공공 쉼터입니다.',
  busStops:
    'BRT와 버스 연계가 가능한 지점입니다. 도보 부담이 클 때 대중교통 대체 경로로 전환할 수 있어요.',
  cctv: '야간 이동 때 시야 확보와 안전 체감에 도움이 되는 CCTV 지점입니다.',
  streetlights: '야간 경로에서 밝은 보행 환경을 만들어 주는 조명 지점입니다.',
  riskSegments: '강변 바람이나 저시정처럼 이동 중 주의가 필요한 구간입니다.',
}

const tileLayerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const popupOptions: PopupOptions = {
  className: styles.leafletInfoPopup,
  closeButton: false,
  offset: [0, -18],
}

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
      keyboard: false,
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
      title: '출발 지점',
      zIndexOffset: 500,
      bubblingMouseEvents: false,
    })
      .bindPopup(
        createPopupHtml(
          '출발 지점',
          '선택한 출발지입니다. 세이프웨이가 주변 쉼터와 그늘 접근성을 함께 계산합니다.',
        ),
        popupOptions,
      )
      .addTo(overlayLayer)

    L.marker(routePath[routePath.length - 1], {
      icon: createRouteIcon('도착', styles.leafletEndMarker),
      title: '도착 지점',
      zIndexOffset: 500,
      bubblingMouseEvents: false,
    })
      .bindPopup(
        createPopupHtml(
          '도착 지점',
          '목적지 주변은 조명과 CCTV가 많은 길을 우선해 마지막 보행 구간을 안내합니다.',
        ),
        popupOptions,
      )
      .addTo(overlayLayer)

    visiblePoints.forEach((point) => {
      L.marker(toLeafletLatLng(point.location), {
        icon: createLayerIcon(point),
        title: point.label,
        bubblingMouseEvents: false,
      })
        .bindPopup(createLayerPopupHtml(point), popupOptions)
        .addTo(overlayLayer)
    })

    map.fitBounds(routeLine.getBounds(), getFitBoundsOptions())
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

function createLayerPopupHtml(point: SafetyLayerPoint) {
  return createPopupHtml(point.label, layerDescriptions[point.layer])
}

function createPopupHtml(title: string, description: string) {
  return `<div class="${styles.popupContent}"><strong>${escapeHtml(
    title,
  )}</strong><p>${escapeHtml(description)}</p></div>`
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const replacements: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    }

    return replacements[character]
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

function getFitBoundsOptions(): FitBoundsOptions {
  const isMobile =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(max-width: 640px)').matches

  if (!isMobile) {
    return { padding: [42, 42], maxZoom: 15 }
  }

  return {
    paddingTopLeft: [36, 170],
    paddingBottomRight: [36, 274],
    maxZoom: 15,
  }
}
