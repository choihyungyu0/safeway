import type { LucideIcon } from 'lucide-react'

export type PublicDataStatus = 'NORMAL' | 'DELAYED' | 'NEEDS_CHECK' | 'ERROR'

export type PublicDatasetType =
  | 'WEATHER'
  | 'AIR_QUALITY'
  | 'SHELTER'
  | 'TRANSPORT'
  | 'SAFETY_FACILITY'
  | 'WALKING_ENVIRONMENT'

export type PublicDataCollectionCycle = '10분' | '30분' | '1시간' | '24시간' | '수시'

export type PublicDataAccent = 'blue' | 'teal' | 'orange' | 'purple' | 'red'

export type PublicDataset = {
  id: string
  name: string
  type: PublicDatasetType
  provider: string
  lastCollectedAt: string
  status: PublicDataStatus
  note: string
  collectionCycle: PublicDataCollectionCycle
  icon: LucideIcon
}

export type PublicDataSummaryMetric = {
  id: string
  title: string
  value: string
  subtext: string
  accent: Exclude<PublicDataAccent, 'red'>
  icon: LucideIcon
}

export type DataQualityMetric = {
  id: string
  label: string
  englishLabel: string
  value: number
  description: string
  accent: 'blue' | 'teal' | 'orange'
}

export type DataAlertLog = {
  id: string
  title: string
  description: string
  time: string
  level: 'warning' | 'danger' | 'info' | 'success'
  accent: PublicDataAccent
  icon: LucideIcon
}

export type PublicDataFilterState = {
  datasetType: PublicDatasetType | 'ALL'
  status: PublicDataStatus | 'ALL'
  collectionCycle: PublicDataCollectionCycle | 'ALL'
  searchTerm: string
}
