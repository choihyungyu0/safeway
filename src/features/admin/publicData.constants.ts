import type {
  PublicDataCollectionCycle,
  PublicDataFilterState,
  PublicDataStatus,
  PublicDatasetType,
} from '@/features/admin/publicData.types'

export const publicDatasetTypeLabels: Record<PublicDatasetType, string> = {
  WEATHER: '기상',
  AIR_QUALITY: '대기질',
  SHELTER: '쉼터',
  TRANSPORT: '교통',
  SAFETY_FACILITY: '안전시설',
  WALKING_ENVIRONMENT: '보행환경',
}

export const publicDataStatusLabels: Record<PublicDataStatus, string> = {
  NORMAL: '정상',
  DELAYED: '지연 수집',
  NEEDS_CHECK: '점검 필요',
  ERROR: '오류',
}

export const publicDataTypeFilterOptions: Array<{
  value: PublicDataFilterState['datasetType']
  label: string
}> = [
  { value: 'ALL', label: '전체' },
  { value: 'WEATHER', label: '기상' },
  { value: 'AIR_QUALITY', label: '대기질' },
  { value: 'SHELTER', label: '쉼터' },
  { value: 'TRANSPORT', label: '교통' },
  { value: 'SAFETY_FACILITY', label: '안전시설' },
  { value: 'WALKING_ENVIRONMENT', label: '보행환경' },
]

export const publicDataStatusFilterOptions: Array<{
  value: PublicDataFilterState['status']
  label: string
}> = [
  { value: 'ALL', label: '전체' },
  { value: 'NORMAL', label: '정상' },
  { value: 'DELAYED', label: '지연 수집' },
  { value: 'NEEDS_CHECK', label: '점검 필요' },
  { value: 'ERROR', label: '오류' },
]

export const publicDataCycleFilterOptions: Array<{
  value: PublicDataFilterState['collectionCycle']
  label: string
}> = [
  { value: 'ALL', label: '전체' },
  { value: '10분', label: '10분' },
  { value: '30분', label: '30분' },
  { value: '1시간', label: '1시간' },
  { value: '24시간', label: '24시간' },
  { value: '수시', label: '수시' },
]

export const publicDataPageSizeOptions = [10, 20, 50] as const

export const defaultPublicDataFilter: PublicDataFilterState = {
  datasetType: 'ALL',
  status: 'ALL',
  collectionCycle: 'ALL',
  searchTerm: '',
}

export const collectionCycleNotes: Record<PublicDataCollectionCycle, string> = {
  '10분': '수집 주기 10분',
  '30분': '수집 주기 30분',
  '1시간': '수집 주기 1시간',
  '24시간': '수집 주기 24시간',
  수시: '수시 수집',
}
