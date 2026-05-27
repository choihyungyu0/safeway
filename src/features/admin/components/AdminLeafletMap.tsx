import { useEffect, useRef, type ReactNode } from 'react'
import L, {
  type ControlPosition,
  type LatLngExpression,
  type LayerGroup,
  type Map as LeafletMap,
} from 'leaflet'
import 'leaflet/dist/leaflet.css'
import styles from '@/features/admin/components/AdminLeafletMap.module.css'

export type AdminMapPosition =
  | {
      x: number
      y: number
    }
  | {
      lat: number
      lng: number
    }

export type AdminMapPointTone =
  | 'danger'
  | 'warning'
  | 'info'
  | 'shelter'
  | 'candidate'
  | 'priority'
  | 'district'

export type AdminMapPointShape = 'label' | 'badge' | 'pin' | 'dot' | 'district'

export type AdminLeafletPoint = {
  id: string
  position: AdminMapPosition
  label: string
  detail?: string
  tone?: AdminMapPointTone
  shape?: AdminMapPointShape
  rank?: number
  selected?: boolean
  ariaLabel?: string
  onClick?: () => void
}

export type AdminLeafletCircle = {
  id: string
  position: AdminMapPosition
  radiusMeters: number
  tone: 'danger' | 'warning' | 'info' | 'shelter' | 'candidate' | 'priority'
  label?: string
  fillOpacity?: number
  dashed?: boolean
}

export type AdminLeafletLine = {
  id: string
  positions: AdminMapPosition[]
  tone: 'danger' | 'warning' | 'info' | 'shelter' | 'candidate' | 'priority'
  label?: string
  dashed?: boolean
}

type AdminLeafletMapProps = {
  ariaLabel: string
  className?: string
  points?: AdminLeafletPoint[]
  circles?: AdminLeafletCircle[]
  lines?: AdminLeafletLine[]
  center?: AdminMapPosition
  zoom?: number
  fitToContent?: boolean
  maxFitZoom?: number
  showBadge?: boolean
  zoomControl?: boolean
  zoomControlPosition?: ControlPosition
  attributionControl?: boolean
  children?: ReactNode
}

const tileLayerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const defaultCenter: AdminMapPosition = { lat: 36.488, lng: 127.289 }

const sejongBounds = {
  north: 36.545,
  south: 36.435,
  west: 127.22,
  east: 127.37,
}

const layerToneColor = {
  danger: '#ef4444',
  warning: '#f18700',
  info: '#075bd1',
  shelter: '#15965f',
  candidate: '#075bd1',
  priority: '#ef582d',
} as const

const pointShapeClassNames: Record<AdminMapPointShape, string> = {
  label: styles.label,
  badge: styles.badgeMarker,
  pin: styles.pin,
  dot: styles.dot,
  district: styles.district,
}

const pointToneClassNames: Record<AdminMapPointTone, string> = {
  danger: styles.danger,
  warning: styles.warning,
  info: styles.info,
  shelter: styles.shelter,
  candidate: styles.candidate,
  priority: styles.priority,
  district: '',
}

export function AdminLeafletMap({
  ariaLabel,
  className,
  points = [],
  circles = [],
  lines = [],
  center = defaultCenter,
  zoom = 12,
  fitToContent = true,
  maxFitZoom = 13,
  showBadge = true,
  zoomControl = true,
  zoomControlPosition = 'bottomright',
  attributionControl = true,
  children,
}: AdminLeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const overlayLayerRef = useRef<LayerGroup | null>(null)
  const initialCenterRef = useRef(center)
  const initialZoomRef = useRef(zoom)

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return
    }

    const map = L.map(mapContainerRef.current, {
      center: toLeafletLatLng(initialCenterRef.current),
      zoom: initialZoomRef.current,
      scrollWheelZoom: true,
      keyboard: false,
      zoomControl: false,
      attributionControl,
    })

    if (zoomControl) {
      L.control.zoom({ position: zoomControlPosition }).addTo(map)
    }

    L.tileLayer(tileLayerUrl, {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map
    overlayLayerRef.current = L.layerGroup().addTo(map)

    const resizeTimer = window.setTimeout(() => map.invalidateSize(), 80)

    return () => {
      window.clearTimeout(resizeTimer)
      map.remove()
      mapRef.current = null
      overlayLayerRef.current = null
    }
  }, [attributionControl, zoomControl, zoomControlPosition])

  useEffect(() => {
    const map = mapRef.current
    const overlayLayer = overlayLayerRef.current

    if (!map || !overlayLayer) {
      return
    }

    overlayLayer.clearLayers()

    circles.forEach((circle) => {
      const color = layerToneColor[circle.tone]
      L.circle(toLeafletLatLng(circle.position), {
        radius: circle.radiusMeters,
        color,
        fillColor: color,
        fillOpacity: circle.fillOpacity ?? 0.22,
        opacity: 0.72,
        weight: 2,
        dashArray: circle.dashed ? '7 7' : undefined,
      })
        .bindTooltip(circle.label ?? '', { sticky: true })
        .addTo(overlayLayer)
    })

    lines.forEach((line) => {
      const color = layerToneColor[line.tone]
      L.polyline(line.positions.map(toLeafletLatLng), {
        color,
        opacity: 0.86,
        weight: 4,
        dashArray: line.dashed ? '8 8' : undefined,
        lineCap: 'round',
        lineJoin: 'round',
      })
        .bindTooltip(line.label ?? '', { sticky: true })
        .addTo(overlayLayer)
    })

    points.forEach((point) => {
      const marker = L.marker(toLeafletLatLng(point.position), {
        icon: createPointIcon(point),
        interactive: true,
        title: point.label,
        zIndexOffset: point.selected ? 500 : 0,
      }).addTo(overlayLayer)

      if (point.onClick) {
        marker.on('click', point.onClick)
      }
    })

    const boundsPoints = [
      ...points.map((point) => toLeafletLatLng(point.position)),
      ...circles.map((circle) => toLeafletLatLng(circle.position)),
      ...lines.flatMap((line) => line.positions.map(toLeafletLatLng)),
    ]

    if (fitToContent && boundsPoints.length > 1) {
      map.fitBounds(L.latLngBounds(boundsPoints), {
        padding: [34, 34],
        maxZoom: maxFitZoom,
      })
    } else {
      map.setView(toLeafletLatLng(center), zoom)
    }

    const resizeTimer = window.setTimeout(() => map.invalidateSize(), 80)

    return () => window.clearTimeout(resizeTimer)
  }, [center, circles, fitToContent, lines, maxFitZoom, points, zoom])

  return (
    <div className={`${styles.frame} ${className ?? ''}`} aria-label={ariaLabel}>
      <div ref={mapContainerRef} className={styles.map} />
      {children ? <div className={styles.overlay}>{children}</div> : null}
      {showBadge ? <div className={styles.badge}>Leaflet / OpenStreetMap</div> : null}
    </div>
  )
}

function createPointIcon(point: AdminLeafletPoint) {
  const shape = point.shape ?? 'label'
  const tone = point.tone ?? 'info'
  const className = [
    styles.marker,
    pointShapeClassNames[shape],
    pointToneClassNames[tone],
    point.selected ? styles.selected : '',
  ]
    .filter(Boolean)
    .join(' ')

  return L.divIcon({
    className,
    html: getPointHtml(point, shape),
    iconAnchor: getIconAnchor(shape),
  })
}

function getPointHtml(point: AdminLeafletPoint, shape: AdminMapPointShape) {
  const label = escapeHtml(point.label)
  const detail = point.detail ? escapeHtml(point.detail) : ''
  const rank = point.rank ? escapeHtml(String(point.rank)) : ''
  const ariaLabel = escapeHtml(point.ariaLabel ?? point.label)

  if (shape === 'pin') {
    const pinControl = point.onClick
      ? `<button type="button" class="${styles.pinButton}" aria-label="${ariaLabel}"><span>${rank}</span></button>`
      : `<span class="${styles.pinDot}" aria-hidden="true">${rank}</span>`

    return `${pinControl}${label ? `<strong class="${styles.pinLabel}">${label}</strong>` : ''}`
  }

  if (shape === 'dot') {
    return `<span class="${styles.dotMarker}" aria-hidden="true"></span>${
      label ? `<strong class="${styles.pinLabel}">${label}</strong>` : ''
    }`
  }

  if (shape === 'badge') {
    return `<strong>${label}</strong>${detail ? `<span>${detail}</span>` : ''}`
  }

  if (shape === 'district') {
    return `<span>${label}</span>`
  }

  return `<strong>${label}</strong>${detail ? `<span>${detail}</span>` : ''}`
}

function getIconAnchor(shape: AdminMapPointShape): [number, number] {
  if (shape === 'pin') return [18, 39]
  if (shape === 'dot') return [8, 8]
  if (shape === 'district') return [24, 12]
  if (shape === 'badge') return [44, 17]
  return [52, 38]
}

function toLeafletLatLng(position: AdminMapPosition): LatLngExpression {
  if ('lat' in position) {
    return [position.lat, position.lng]
  }

  return [
    sejongBounds.north - (position.y / 100) * (sejongBounds.north - sejongBounds.south),
    sejongBounds.west + (position.x / 100) * (sejongBounds.east - sejongBounds.west),
  ]
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}
