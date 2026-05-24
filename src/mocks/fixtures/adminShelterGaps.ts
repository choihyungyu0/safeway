import type {
  ShelterGapArea,
  ShelterGapDistrictLabel,
  ShelterGapMapMarker,
  ShelterGapMapZone,
  TemporaryShelterCandidate,
} from '@/features/admin/shelterGap.types'

export const shelterGapAreas: ShelterGapArea[] = [
  {
    id: 'naseong-south-walkway',
    rank: 1,
    name: '나성동 남측 보행축',
    riskTags: ['폭염 취약', '접근성 낮음'],
    beneficiaryPopulation: '4,860명',
    currentAccessTimeMin: '18.6분',
    nearbyPublicFacilityCount: '3개',
    position: { x: 31, y: 61 },
    heatmapIntensity: 0.92,
  },
  {
    id: 'eojin-lake-east',
    rank: 2,
    name: '어진동 호수공원 동측',
    riskTags: ['폭염 취약', '접근성 낮음'],
    beneficiaryPopulation: '4,120명',
    currentAccessTimeMin: '16.2분',
    nearbyPublicFacilityCount: '4개',
    position: { x: 59, y: 22 },
    heatmapIntensity: 0.88,
  },
  {
    id: 'boram-living-zone',
    rank: 3,
    name: '보람동 생활권',
    riskTags: ['폭염 취약', '접근성 낮음'],
    beneficiaryPopulation: '3,560명',
    currentAccessTimeMin: '15.1분',
    nearbyPublicFacilityCount: '5개',
    position: { x: 76, y: 66 },
    heatmapIntensity: 0.84,
  },
  {
    id: 'dodam-north-walkway',
    rank: 4,
    name: '도담동 북측 보행축',
    riskTags: ['폭염 취약', '접근성 낮음'],
    beneficiaryPopulation: '2,980명',
    currentAccessTimeMin: '13.7분',
    nearbyPublicFacilityCount: '4개',
    position: { x: 18, y: 51 },
    heatmapIntensity: 0.68,
  },
  {
    id: 'daepyeong-south-zone',
    rank: 5,
    name: '대평동 남측 생활권',
    riskTags: ['폭염 취약', '접근성 낮음'],
    beneficiaryPopulation: '2,430명',
    currentAccessTimeMin: '14.8분',
    nearbyPublicFacilityCount: '3개',
    position: { x: 72, y: 84 },
    heatmapIntensity: 0.62,
  },
]

export const temporaryShelterCandidates: TemporaryShelterCandidate[] = [
  {
    id: 'candidate-naseong-community',
    name: '나성동 주민센터',
    address: '나성동 745',
    operationTime: '09:00~18:00',
    accessibilityScore: 92,
  },
  {
    id: 'candidate-sejong-community',
    name: '세종복합커뮤니티센터',
    address: '나성로 213',
    operationTime: '09:00~21:00',
    accessibilityScore: 88,
  },
  {
    id: 'candidate-eojin-community',
    name: '어진동 주민센터',
    address: '어진동 672',
    operationTime: '09:00~18:00',
    accessibilityScore: 86,
  },
  {
    id: 'candidate-sejong-library',
    name: '세종시립도서관',
    address: '한누리대로 2130',
    operationTime: '09:00~22:00',
    accessibilityScore: 84,
  },
  {
    id: 'candidate-boram-community',
    name: '보람동 복합커뮤니티센터',
    address: '보람동 745',
    operationTime: '09:00~21:00',
    accessibilityScore: 82,
  },
]

export const shelterGapDistrictLabels: ShelterGapDistrictLabel[] = [
  { id: 'district-eojin', label: '어진동', position: { x: 34, y: 24 } },
  { id: 'district-naseong', label: '나성동', position: { x: 30, y: 52 } },
  { id: 'district-boram', label: '보람동', position: { x: 82, y: 57 } },
  { id: 'district-dodam', label: '도담동', position: { x: 14, y: 50 } },
  { id: 'district-hansol', label: '한솔동', position: { x: 83, y: 13 } },
  { id: 'district-daepyeong', label: '대평동', position: { x: 72, y: 88 } },
  { id: 'district-lake', label: '세종호수공원', position: { x: 60, y: 36 } },
  { id: 'district-complex', label: '정부세종청사', position: { x: 38, y: 39 } },
]

export const shelterGapMarkers: ShelterGapMapMarker[] = [
  { id: 'shelter-1', type: 'SHELTER', position: { x: 13, y: 29 } },
  { id: 'shelter-2', type: 'SHELTER', position: { x: 23, y: 68 } },
  { id: 'shelter-3', type: 'SHELTER', position: { x: 32, y: 30 } },
  { id: 'shelter-4', type: 'SHELTER', position: { x: 44, y: 16 } },
  { id: 'shelter-5', type: 'SHELTER', position: { x: 50, y: 28 } },
  { id: 'shelter-6', type: 'SHELTER', position: { x: 54, y: 70 } },
  { id: 'shelter-7', type: 'SHELTER', position: { x: 66, y: 66 } },
  { id: 'shelter-8', type: 'SHELTER', position: { x: 79, y: 55 } },
  { id: 'shelter-9', type: 'SHELTER', position: { x: 85, y: 39 } },
  { id: 'candidate-1', type: 'CANDIDATE', position: { x: 43, y: 25 } },
  { id: 'candidate-2', type: 'CANDIDATE', position: { x: 77, y: 21 } },
  { id: 'candidate-3', type: 'CANDIDATE', position: { x: 18, y: 54 } },
  { id: 'candidate-4', type: 'CANDIDATE', position: { x: 48, y: 58 } },
  { id: 'candidate-5', type: 'CANDIDATE', position: { x: 74, y: 70 } },
]

export const shelterGapBlindZones: ShelterGapMapZone[] = [
  { id: 'blind-eojin', className: 'blindEojin' },
  { id: 'blind-naseong', className: 'blindNaseong' },
  { id: 'blind-boram', className: 'blindBoram' },
]

export const shelterGapRadiusZones: ShelterGapMapZone[] = [
  { id: 'radius-eojin', className: 'radiusEojin' },
  { id: 'radius-naseong', className: 'radiusNaseong' },
  { id: 'radius-boram', className: 'radiusBoram' },
]

export const vulnerableWalkingCorridors: ShelterGapMapZone[] = [
  { id: 'corridor-eojin-naseong', className: 'corridorEojinNaseong' },
  { id: 'corridor-naseong-river', className: 'corridorNaseongRiver' },
  { id: 'corridor-river-boram', className: 'corridorRiverBoram' },
  { id: 'corridor-lake-river', className: 'corridorLakeRiver' },
]
