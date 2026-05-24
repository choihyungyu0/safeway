export type FeedbackFilter = {
  period: string
  userType: string
  routeType: string
}

export type FeedbackMetricAccent = 'blue' | 'teal' | 'green' | 'orange'

export type FeedbackMetricIcon = 'message' | 'star' | 'thumbsUp' | 'shelter'

export type FeedbackSummaryMetric = {
  id: string
  title: string
  value: string
  comparison: string
  trend: 'up' | 'down'
  accent: FeedbackMetricAccent
  icon: FeedbackMetricIcon
}

export type SatisfactionTrendPoint = {
  date: string
  satisfaction: number
  responseCount: number
}

export type RiskSegmentColor = 'teal' | 'blue' | 'orange' | 'red'

export type RiskDistributionSegment = {
  label: string
  percentage: number
  count: number
  color: RiskSegmentColor
}

export type RouteFeedbackIcon = 'recommended' | 'shortest' | 'safe' | 'shade' | 'slope'

export type RouteSatisfactionPoint = {
  routeType: string
  score: number
  icon: RouteFeedbackIcon
}

export type FeedbackKeyword = {
  keyword: string
  count: number
}

export type PerceivedRiskTone = 'blue' | 'orange' | 'red'

export type FeedbackStatusTone = 'blue' | 'green' | 'gray'

export type RecentFeedbackItem = {
  id: string
  receivedAt: string
  routeType: string
  routeIcon: RouteFeedbackIcon
  satisfaction: number
  perceivedRiskLevel: number
  perceivedRiskLabel: string
  perceivedRiskTone: PerceivedRiskTone
  summary: string
  status: string
  statusTone: FeedbackStatusTone
}
