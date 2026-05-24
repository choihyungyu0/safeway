import type { ReportFilter } from '@/features/admin/report.types'

export const reportPeriod = '2025.06.01 ~ 2025.06.30'

export const reportRegionOptions = ['전체', '나성동', '어진동', '보람동', '한솔동', '소담동']

export const reportRiskTypeOptions = ['전체', '폭염', '미세먼지', '안개', '한파']

export const reportUserTypeOptions = [
  '전체',
  '일반 성인',
  '고령자',
  '아동/청소년',
  '임산부',
  '장애인',
  '야외근로자',
]

export const reportTypeOptions = [
  '종합 분석 리포트',
  '기후위험 분석 리포트',
  '쉼터 사각지대 리포트',
  '사용자 피드백 리포트',
  '공공데이터 품질 리포트',
]

export const defaultReportFilter: ReportFilter = {
  period: reportPeriod,
  region: '전체',
  riskType: '전체',
  userType: '전체',
  reportType: '종합 분석 리포트',
}
