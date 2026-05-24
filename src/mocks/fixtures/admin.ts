import type {
  AdminDashboardSummary,
  DataCollectionStatus,
  ShelterGapArea,
  TemporaryShelterCandidate,
} from '@/entities/admin/types'

export const mockAdminDashboard: AdminDashboardSummary = {
  highRiskAreas: 12,
  shelterGaps: 7,
  vulnerableWalkingRoutes: 18,
  temporaryShelterCandidates: 5,
  recommendationUsage: 328,
  riskTypeDistribution: [
    { label: '폭염', value: 42 },
    { label: '미세먼지', value: 24 },
    { label: '안개', value: 14 },
    { label: '야간', value: 20 },
  ],
  topRiskAreas: [
    {
      name: '금강보행교 남측 진입부',
      reason: '그늘 부족과 강변 저시정 위험이 함께 나타남',
      score: 87,
    },
    {
      name: '나성동 상업지역 보행축',
      reason: '야간 보행량은 많지만 쉼터 접근성이 낮음',
      score: 79,
    },
    {
      name: '도담동 학교 주변',
      reason: '아동 보행 경로와 미세먼지 민감 구간이 겹침',
      score: 74,
    },
  ],
}

export const mockShelterGapAreas: ShelterGapArea[] = [
  {
    id: 'gap-geumgang-bridge',
    name: '금강보행교 남측 산책로',
    description: '보행량은 높지만 300m 이내 냉방 쉼터가 부족합니다.',
    vulnerableUsers: ['고령자', '임산부', '야외근로자'],
    nearestShelterDistanceMeters: 620,
    priority: 'HIGH',
  },
  {
    id: 'gap-naseong-office',
    name: '나성동 업무시설 밀집지',
    description: '퇴근 시간 이동 수요가 많고 야간 안전시설 보강이 필요합니다.',
    vulnerableUsers: ['일반', '장애인'],
    nearestShelterDistanceMeters: 480,
    priority: 'MEDIUM',
  },
  {
    id: 'gap-dodam-school',
    name: '도담동 학교-정류장 연결로',
    description: '아동/청소년 이동이 많아 미세먼지 회피 동선 안내가 필요합니다.',
    vulnerableUsers: ['아동/청소년'],
    nearestShelterDistanceMeters: 530,
    priority: 'HIGH',
  },
]

export const mockTemporaryShelterCandidates: TemporaryShelterCandidate[] = [
  {
    id: 'candidate-community-hall',
    name: '금강변 작은도서관',
    address: '세종특별자치시 세종동 120-4',
    reason: '보행교와 호수공원 사이의 쉼터 공백을 줄일 수 있습니다.',
    estimatedCapacity: 36,
  },
  {
    id: 'candidate-public-lobby',
    name: '나성동 공공업무동 로비',
    address: '세종특별자치시 나성북로 17',
    reason: 'BRT 환승객과 야간 보행자의 임시 대기 공간으로 적합합니다.',
    estimatedCapacity: 58,
  },
]

export const mockDataCollectionStatuses: DataCollectionStatus[] = [
  {
    id: 'dataset-weather',
    datasetName: '기상 관측 및 특보',
    provider: '기상청',
    collectionCycle: '10분',
    lastCollectedAt: '2026-05-24T15:00:00+09:00',
    status: 'NORMAL',
  },
  {
    id: 'dataset-shelters',
    datasetName: '무더위쉼터 및 한파쉼터',
    provider: '세종특별자치시',
    collectionCycle: '1일',
    lastCollectedAt: '2026-05-24T09:10:00+09:00',
    status: 'NORMAL',
  },
  {
    id: 'dataset-cctv',
    datasetName: '방범 CCTV 위치',
    provider: '공공데이터포털',
    collectionCycle: '1주',
    lastCollectedAt: '2026-05-22T02:30:00+09:00',
    status: 'DELAYED',
    errorMessage: '일부 좌표 정규화가 지연되고 있습니다.',
  },
]
