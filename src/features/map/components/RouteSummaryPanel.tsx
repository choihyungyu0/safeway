import type { LucideIcon } from 'lucide-react'
import {
  CheckCircle2,
  Clock3,
  Footprints,
  Info,
  Moon,
  Shield,
  Sparkles,
  Sun,
  ThermometerSun,
  TreePine,
} from 'lucide-react'
import type { SafeRouteRecommendation } from '@/entities/route/types'
import { DEFAULT_SELECTED_ROUTE_ID } from '@/features/map/map.constants'
import styles from '@/pages/MapPage.module.css'

type Tone = 'blue' | 'green' | 'teal' | 'purple' | 'orange'

type Metric = {
  id: string
  icon: LucideIcon
  label: string
  value: string
  detail: string
  tone: Tone
  badge?: boolean
}

type AnalysisRow = {
  id: string
  icon: LucideIcon
  label: string
  score: number
  tone: Tone
}

const safetyAnalysisRows: AnalysisRow[] = [
  {
    id: 'shelter-access',
    icon: Footprints,
    label: '쉼터 접근성',
    score: 94,
    tone: 'blue',
  },
  {
    id: 'exposure-reduction',
    icon: TreePine,
    label: '외부 노출 감소',
    score: 91,
    tone: 'green',
  },
  {
    id: 'night-safety',
    icon: Moon,
    label: '야간 안전성',
    score: 90,
    tone: 'purple',
  },
  {
    id: 'climate-risk',
    icon: ThermometerSun,
    label: '기후·폭염 위험',
    score: 88,
    tone: 'orange',
  },
]

export function RouteSummaryPanel({
  recommendation,
}: {
  recommendation: SafeRouteRecommendation
}) {
  const metrics = getMetrics(recommendation)
  const panelTitle =
    recommendation.id === DEFAULT_SELECTED_ROUTE_ID ? '세이프웨이 추천' : recommendation.title

  return (
    <aside className={styles.recommendPanel} aria-label="추천 경로 안전 분석">
      <div className={styles.recommendHeader}>
        <span className={styles.sparkleIcon} aria-hidden="true">
          <Sparkles size={26} />
        </span>

        <div>
          <h1>{panelTitle}</h1>
          <p>AI가 분석한 가장 안전한 경로입니다.</p>
        </div>
      </div>

      <section className={styles.summaryGrid} aria-label="추천 경로 주요 지표">
        {metrics.map((metric) => (
          <MetricCard metric={metric} key={metric.id} />
        ))}
      </section>

      <section className={styles.analysisSection} aria-labelledby="analysis-title">
        <div className={styles.analysisTitle}>
          <h2 id="analysis-title">안전 요소 분석</h2>
          <Info size={16} aria-hidden="true" />
        </div>

        <div className={styles.analysisList}>
          {safetyAnalysisRows.map((row) => (
            <SafetyAnalysisItem row={row} key={row.id} />
          ))}
        </div>
      </section>

      <div className={styles.panelTip}>
        <Sun size={24} aria-hidden="true" />
        <p>그늘이 많은 경로로 선택되어 폭염 및 외부 노출 위험을 효과적으로 줄였습니다.</p>
      </div>
    </aside>
  )
}

function MetricCard({ metric }: { metric: Metric }) {
  const Icon = metric.icon

  return (
    <article className={styles.summaryBox}>
      <Icon className={`${styles.summaryIcon} ${styles[metric.tone]}`} size={31} aria-hidden="true" />
      <p>{metric.label}</p>
      <strong className={styles[metric.tone]}>{metric.value}</strong>
      {metric.badge ? <span className={styles.safetyBadge}>{metric.detail}</span> : <span>{metric.detail}</span>}
    </article>
  )
}

function SafetyAnalysisItem({ row }: { row: AnalysisRow }) {
  const Icon = row.icon

  return (
    <article className={styles.analysisItem}>
      <div className={styles.analysisLabel}>
        <Icon className={styles[row.tone]} size={25} aria-hidden="true" />
        <p>{row.label}</p>
      </div>

      <div className={styles.barArea}>
        <div
          className={styles.barTrack}
          role="progressbar"
          aria-label={`${row.label} ${row.score}/100`}
          aria-valuenow={row.score}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span
            className={`${styles.barFill} ${styles[row.tone]}`}
            style={{ width: `${row.score}%` }}
          />
        </div>

        <strong className={styles[row.tone]}>
          {row.score}
          <small>/100</small>
        </strong>
      </div>
    </article>
  )
}

function getMetrics(recommendation: SafeRouteRecommendation): Metric[] {
  const isSafewayRoute = recommendation.id === DEFAULT_SELECTED_ROUTE_ID
  const distanceKm = isSafewayRoute
    ? '2.10'
    : (recommendation.distanceMeters / 1000).toFixed(2)
  const shelterDetourKm = isSafewayRoute
    ? '1.2'
    : Math.max(0.4, recommendation.shelterCount * 0.4).toFixed(1)
  const safetyLabel = recommendation.climateSafetyScore >= 90 ? '매우 안전' : '안전'

  return [
    {
      id: 'duration',
      icon: Clock3,
      label: '예상 소요시간',
      value: `${recommendation.durationMin}분`,
      detail: `총 거리 ${distanceKm}km`,
      tone: 'blue',
    },
    {
      id: 'shelter',
      icon: TreePine,
      label: '쉼터 경유',
      value: `${recommendation.shelterCount}개`,
      detail: `총 ${shelterDetourKm}km 경유`,
      tone: 'green',
    },
    {
      id: 'exposure',
      icon: Shield,
      label: '외부 노출 감소',
      value: `${recommendation.exposureReductionPct}%`,
      detail: '기존 경로 대비',
      tone: 'teal',
    },
    {
      id: 'climate-score',
      icon: CheckCircle2,
      label: '기후안전 점수',
      value: `${recommendation.climateSafetyScore}점`,
      detail: safetyLabel,
      tone: 'blue',
      badge: true,
    },
  ]
}
