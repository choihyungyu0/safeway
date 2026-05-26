import { AlertTriangle, MapPin, Star, TentTree } from 'lucide-react'
import type {
  PolicyProposal,
  ReportChapter,
  ReportMetric,
  ReportPreviewPage,
  ReportSummaryKeyword,
  ShelterPriorityItem,
} from '@/features/admin/report.types'
import {
  safewayAnalysisSummary,
  safestSafewayScenario,
} from '@/mocks/fixtures/generated/safewayData'

export const reportMetrics: ReportMetric[] = [
  {
    id: 'high-risk-area',
    title: '고위험 권역',
    value: '7개',
    comparison: '전월 대비 ↑ 1개',
    accent: 'red',
    icon: AlertTriangle,
  },
  {
    id: 'shelter-gap',
    title: '쉼터 사각지대',
    value: '12개',
    comparison: '전월 대비 ↑ 2개',
    accent: 'orange',
    icon: MapPin,
  },
  {
    id: 'temporary-shelter',
    title: '임시쉼터 후보',
    value: '24개',
    comparison: '전월 대비 ↑ 6개',
    accent: 'green',
    icon: TentTree,
  },
  {
    id: 'satisfaction',
    title: '평균 만족도',
    value: '4.6 / 5',
    comparison: '전월 대비 ↑ 0.2',
    accent: 'blue',
    icon: Star,
  },
]

export const reportPreviewPages: ReportPreviewPage[] = [
  { page: 1, title: '표지 및 핵심 요약', thumbnailLabel: '리포트 1페이지 미리보기' },
  { page: 2, title: '운영 현황', thumbnailLabel: '리포트 2페이지 미리보기' },
  { page: 3, title: '기후위험 지도', thumbnailLabel: '리포트 3페이지 미리보기' },
  { page: 4, title: '쉼터 사각지대', thumbnailLabel: '리포트 4페이지 미리보기' },
  { page: 5, title: '정책 제안', thumbnailLabel: '리포트 5페이지 미리보기' },
]

export const shelterPriorityItems: ShelterPriorityItem[] = [
  { rank: 1, area: '보람동(주민센터 일대)', score: 86 },
  { rank: 2, area: '한솔동(첫마을 일대)', score: 78 },
  { rank: 3, area: '어진동(국책연구단지)', score: 72 },
  { rank: 4, area: '나성동(상업지구)', score: 68 },
  { rank: 5, area: '새롬동(중심상가 일대)', score: 64 },
]

export const reportFeedbackKeywords: ReportSummaryKeyword[] = [
  { keyword: '그늘', count: 342 },
  { keyword: '쉼터', count: safewayAnalysisSummary.totalShelterCount },
  { keyword: '가로등', count: 213 },
  { keyword: '보행안전', count: 198 },
]

export const reportChapters: ReportChapter[] = [
  { number: '01', title: '운영 현황', description: '주요 지표 및 운영 성과', completed: true },
  { number: '02', title: '기후위험 지도', description: '기후위험 분포 및 변화 분석', completed: true },
  { number: '03', title: '쉼터 사각지대', description: '접근성 취약지역 분석', completed: true },
  { number: '04', title: '임시쉼터 후보', description: '설치 후보지 도출 결과', completed: true },
  { number: '05', title: '추천 로그 분석', description: 'AI 추천 경로 이용 분석', completed: true },
  {
    number: '06',
    title: '사용자 피드백 분석',
    description: '시민 만족도 및 의견 분석',
    completed: true,
  },
  { number: '07', title: '정책 제안', description: '개선 과제 및 정책 제안', completed: true },
]

export const policyProposal: PolicyProposal = {
  title: '보람동-어진동 연결 보행축에',
  emphasis: '그늘 및 쉼터 보강 필요',
  description: `무더위쉼터 ${safewayAnalysisSummary.totalShelterCount}개소와 ${safestSafewayScenario.scenario} 평균 안전점수 ${safestSafewayScenario.averageFinalSafetyScore}점을 함께 반영해, 보행량이 많고 일사 노출이 높은 구간의 그늘 및 쉼터 보강이 필요합니다.`,
}
