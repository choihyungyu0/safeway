import { useState, type CSSProperties } from 'react'
import {
  CalendarDays,
  ChevronRight,
  Clock,
  Footprints,
  Info,
  MapPin,
  ShieldCheck,
  ShieldPlus,
  TreePine,
  UserRound,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { RecommendationType, SafeRouteRecommendation } from '@/entities/route/types'
import { useRouteSearchStore } from '@/features/route-search/routeSearchStore'
import { scoreCriteria } from '@/features/recommendation/recommendation.constants'
import { bestSafewayRouteRecommendation } from '@/mocks/fixtures/generated/safewayData'
import { mockRecommendationResults } from '@/mocks/fixtures/recommendations'
import { routePreferenceLabels, transportModeLabels, userTypeLabels } from '@/shared/constants/labels'
import styles from '@/pages/RecommendationPage.module.css'

type SummaryTone = 'blue' | 'teal'

type SummaryItem = {
  id: string
  label: string
  value: string
  tone: SummaryTone
  icon: typeof MapPin
}

type RouteMetric = {
  id: string
  label: string
  value: string
  icon: typeof Clock
  isScore?: boolean
}

const cardThemeByType: Record<RecommendationType, string> = {
  SAFEWAY: styles.safeway,
  TRANSIT_ALTERNATIVE: styles.transit,
  NIGHT_SAFE: styles.nightSafe,
  SHORTEST: styles.shortest,
}

const iconAltByType: Record<RecommendationType, string> = {
  SAFEWAY: '세이프웨이 경로 아이콘',
  TRANSIT_ALTERNATIVE: '대중교통 대체경로 아이콘',
  NIGHT_SAFE: '야간 안전경로 아이콘',
  SHORTEST: '최단경로 비교 아이콘',
}

const displayRecommendations = mockRecommendationResults

export function RecommendationPage() {
  const navigate = useNavigate()
  const {
    searchParams,
    userType,
    selectedRecommendationId,
    setSelectedRecommendationId,
  } = useRouteSearchStore()
  const [isCriteriaOpen, setIsCriteriaOpen] = useState(false)

  const summaryItems: SummaryItem[] = [
    {
      id: 'startPlace',
      label: '출발지',
      value: searchParams.startPlace || '정부세종청사 1동',
      tone: 'blue',
      icon: MapPin,
    },
    {
      id: 'destination',
      label: '목적지',
      value: searchParams.destination || '세종특별자치시청',
      tone: 'teal',
      icon: MapPin,
    },
    {
      id: 'departureAt',
      label: '출발일시',
      value: searchParams.departureAt || '2025.06.21 (토) 14:00',
      tone: 'blue',
      icon: CalendarDays,
    },
    {
      id: 'userType',
      label: '사용자 유형',
      value: userTypeLabels[userType] ?? '일반 성인',
      tone: 'teal',
      icon: UserRound,
    },
    {
      id: 'transportMode',
      label: '이동수단',
      value: transportModeLabels[searchParams.transportMode] ?? '도보',
      tone: 'blue',
      icon: Footprints,
    },
    {
      id: 'preference',
      label: '이동 우선',
      value: routePreferenceLabels[searchParams.preference] ?? '시원하고 안전한 길 우선',
      tone: 'teal',
      icon: ShieldCheck,
    },
  ]

  const selectRecommendation = (recommendationId: string) => {
    setSelectedRecommendationId(recommendationId)
    navigate('/map')
  }

  return (
    <section className={styles.recommendationPage}>
      <section className={styles.hero} aria-labelledby="recommendation-heading">
        <div className={styles.heroOverlay}>
          <h1 id="recommendation-heading">
            <span className={styles.desktopHeading}>
              <span>세종 세이프웨이</span> AI 추천 결과
            </span>
            <span className={styles.mobileHeading}>AI 추천 결과</span>
          </h1>
          <p>세종시민을 위한 AI 기후안전 경로·쉼터 안내</p>
          <div className={styles.trustLine}>
            <ShieldCheck size={18} aria-hidden="true" />
            세종특별자치시 공공데이터 기반
          </div>
        </div>
      </section>

      <div className={styles.content}>
        <RouteSummaryBar items={summaryItems} />

        <section className={styles.insightBanner} aria-label="AI 추천 요약">
          <span className={styles.insightIcon} aria-hidden="true">
            <ShieldCheck size={28} />
          </span>
          <p>
            최단경로보다 <strong>6분</strong> 더 걸리지만, 폭염 노출과
            기후위험이 낮은 <strong>세이프웨이</strong> 경로입니다. SafeWay
            분석 데이터 기준 <strong>{bestSafewayRouteRecommendation.routeName}</strong>
            은 최종 기후안전 <strong>{bestSafewayRouteRecommendation.finalSafetyScore}점</strong>
            입니다.
          </p>
        </section>

        <section className={styles.routeList} aria-label="추천 경로 목록">
          {displayRecommendations.map((recommendation) => (
            <RecommendationResultCard
              key={recommendation.id}
              recommendation={recommendation}
              selected={selectedRecommendationId === recommendation.id}
              onViewDetail={selectRecommendation}
            />
          ))}
        </section>

        <section className={styles.scoreBanner} aria-label="기후안전 점수 설명">
          <div className={styles.infoCircle} aria-hidden="true">
            <Info size={25} />
          </div>
          <p>
            기후안전 점수는 기온, 미세먼지, 안개, 그늘, 녹지, 쉼터 접근성,
            보행 안전성 등의 환경요소를 종합하여 산정한 점수입니다.
          </p>
          <button
            type="button"
            className={styles.criteriaButton}
            aria-expanded={isCriteriaOpen}
            aria-controls="score-criteria-panel"
            onClick={() => setIsCriteriaOpen((current) => !current)}
          >
            점수 산정 기준 보기
            <ChevronRight size={22} aria-hidden="true" />
          </button>
        </section>

        {isCriteriaOpen && (
          <section
            id="score-criteria-panel"
            className={styles.criteriaPanel}
            aria-label="점수 산정 기준"
          >
            <h2>기후안전 점수 산정 기준</h2>
            <ul>
              {scoreCriteria.map((criterion) => (
                <li key={criterion}>{criterion}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </section>
  )
}

function RouteSummaryBar({ items }: { items: SummaryItem[] }) {
  return (
    <section className={styles.summaryBar} aria-label="경로 검색 요약">
      {items.map(({ id, label, value, tone, icon: Icon }) => (
        <article className={styles.summaryItem} key={id}>
          <span className={`${styles.summaryIcon} ${styles[tone]}`}>
            <Icon size={26} aria-hidden="true" />
          </span>
          <div>
            <p>{label}</p>
            <strong>{value}</strong>
          </div>
        </article>
      ))}
    </section>
  )
}

function RecommendationResultCard({
  recommendation,
  selected,
  onViewDetail,
}: {
  recommendation: SafeRouteRecommendation
  selected: boolean
  onViewDetail: (recommendationId: string) => void
}) {
  const metrics: RouteMetric[] = [
    {
      id: 'duration',
      label: '총 소요시간',
      value: `${recommendation.durationMin}분`,
      icon: Clock,
    },
    {
      id: 'exposure',
      label: '외부 노출 감소',
      value: `${recommendation.exposureReductionPct}%`,
      icon: ShieldCheck,
    },
    {
      id: 'shelters',
      label: '쉼터 경유',
      value: `${recommendation.shelterCount}개소`,
      icon: TreePine,
    },
    {
      id: 'score',
      label: '기후안전 점수',
      value: `${recommendation.climateSafetyScore}점`,
      icon: ShieldPlus,
      isScore: true,
    },
  ]
  const cardStyle = {
    '--accent-color': recommendation.accentColor,
  } as CSSProperties

  return (
    <article
      className={`${styles.routeCard} ${cardThemeByType[recommendation.type]} ${
        selected ? styles.selected : ''
      }`}
      style={cardStyle}
    >
      <div className={styles.routeIdentity}>
        <span className={styles.routeIcon}>
          <RouteIcon recommendation={recommendation} />
        </span>
        <div className={styles.routeTitleGroup}>
          {recommendation.isRecommended && (
            <span className={styles.recommendBadge}>★ 추천</span>
          )}
          <h2>{recommendation.title}</h2>
          <p>{recommendation.subtitle}</p>
        </div>
      </div>

      <div className={styles.metricGrid}>
        {metrics.map((metric) => (
          <RecommendationMetric metric={metric} key={metric.id} />
        ))}
      </div>

      <button
        type="button"
        className={styles.detailButton}
        onClick={() => onViewDetail(recommendation.id)}
      >
        상세 보기
        <ChevronRight size={24} aria-hidden="true" />
      </button>
    </article>
  )
}

function RouteIcon({ recommendation }: { recommendation: SafeRouteRecommendation }) {
  const [imageFailed, setImageFailed] = useState(false)

  if (imageFailed) {
    return <ShieldCheck size={48} aria-hidden="true" />
  }

  return (
    <img
      src={recommendation.iconSrc}
      alt={iconAltByType[recommendation.type]}
      onError={() => setImageFailed(true)}
    />
  )
}

function RecommendationMetric({ metric }: { metric: RouteMetric }) {
  const Icon = metric.icon

  return (
    <div className={`${styles.metricItem} ${metric.isScore ? styles.scoreMetric : ''}`}>
      <Icon className={styles.metricIcon} size={31} strokeWidth={1.9} aria-hidden="true" />
      <p>{metric.label}</p>
      <strong>{metric.value}</strong>
    </div>
  )
}
