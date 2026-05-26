import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')
const sourceRoot = path.join(repoRoot, '.tmp-safeway-data', 'SafeWay')
const outputRoot = path.join(repoRoot, 'src', 'mocks', 'fixtures', 'generated')

const userTypeCodeByLabel = new Map([
  ['일반', 'GENERAL'],
  ['고령자', 'SENIOR'],
  ['아동/청소년', 'CHILD'],
  ['임산부', 'PREGNANT'],
  ['장애인', 'DISABLED'],
  ['야외근로자', 'OUTDOOR_WORKER'],
])

const sourceFiles = {
  shelters: path.join(sourceRoot, 'data', 'processed', 'heat_shelter_scored.csv'),
  climateScenarios: path.join(sourceRoot, 'data', 'processed', 'climate_scenarios.csv'),
  userTypeWeights: path.join(sourceRoot, 'data', 'processed', 'user_type_weights.csv'),
  routeRecommendations: path.join(
    sourceRoot,
    'outputs',
    'reports',
    'final_route_recommendation.csv',
  ),
  scenarioSummary: path.join(
    sourceRoot,
    'outputs',
    'reports',
    'scenario_safety_score_summary.csv',
  ),
  shelterSummary: path.join(sourceRoot, 'outputs', 'reports', 'heat_shelter_summary.csv'),
  analysisSummary: path.join(
    sourceRoot,
    'outputs',
    'reports',
    'final_bigdata_analysis_summary.txt',
  ),
  analysisReport: path.join(
    sourceRoot,
    'outputs',
    'reports',
    'bigdata_analysis_final_report.md',
  ),
}

async function main() {
  const [
    shelterRows,
    climateScenarioRows,
    userTypeWeightRows,
    routeRecommendationRows,
    scenarioSummaryRows,
    shelterSummaryRows,
    analysisSummaryText,
    analysisReportText,
  ] = await Promise.all([
    readCsv(sourceFiles.shelters),
    readCsv(sourceFiles.climateScenarios),
    readCsv(sourceFiles.userTypeWeights),
    readCsv(sourceFiles.routeRecommendations),
    readCsv(sourceFiles.scenarioSummary),
    readCsv(sourceFiles.shelterSummary),
    readText(sourceFiles.analysisSummary),
    readText(sourceFiles.analysisReport),
  ])

  const generated = {
    safewayShelters: shelterRows.map(toShelter),
    safewayClimateScenarios: climateScenarioRows.map(toClimateScenario),
    safewayUserTypeWeights: userTypeWeightRows.map(toUserTypeWeight),
    safewayRouteRecommendations: routeRecommendationRows.map(toRouteRecommendation),
    safewayScenarioSummary: scenarioSummaryRows.map(toScenarioSummary),
    safewayAnalysisSummary: toAnalysisSummary(
      shelterSummaryRows,
      analysisSummaryText,
      analysisReportText,
    ),
    safewayImportMetadata: {
      sourceArchive: 'external-data/SafeWay.zip',
      sourceRoot: '.tmp-safeway-data/SafeWay',
      sourceFiles: Object.fromEntries(
        Object.entries(sourceFiles).map(([key, filePath]) => [
          key,
          path.relative(sourceRoot, filePath).replaceAll(path.sep, '/'),
        ]),
      ),
      rowCounts: {
        shelters: shelterRows.length,
        climateScenarios: climateScenarioRows.length,
        userTypeWeights: userTypeWeightRows.length,
        routeRecommendations: routeRecommendationRows.length,
        scenarioSummary: scenarioSummaryRows.length,
        shelterSummary: shelterSummaryRows.length,
      },
      generatedCounts: {
        shelters: shelterRows.length,
        climateScenarios: climateScenarioRows.length,
        userTypeWeights: userTypeWeightRows.length,
        routeRecommendations: routeRecommendationRows.length,
        scenarioSummary: scenarioSummaryRows.length,
      },
    },
  }

  await mkdir(outputRoot, { recursive: true })

  await Promise.all([
    writeJson('safewayShelters.json', generated.safewayShelters),
    writeJson('safewayClimateScenarios.json', generated.safewayClimateScenarios),
    writeJson('safewayUserTypeWeights.json', generated.safewayUserTypeWeights),
    writeJson('safewayRouteRecommendations.json', generated.safewayRouteRecommendations),
    writeJson('safewayScenarioSummary.json', generated.safewayScenarioSummary),
    writeJson('safewayAnalysisSummary.json', generated.safewayAnalysisSummary),
    writeJson('safewayImportMetadata.json', generated.safewayImportMetadata),
  ])

  console.log(
    [
      `Imported ${generated.safewayShelters.length} shelters`,
      `${generated.safewayClimateScenarios.length} climate scenarios`,
      `${generated.safewayUserTypeWeights.length} user type weights`,
      `${generated.safewayRouteRecommendations.length} route recommendations`,
      `${generated.safewayScenarioSummary.length} scenario summaries`,
    ].join(', '),
  )
}

async function readText(filePath) {
  try {
    const content = await readFile(filePath, 'utf8')

    return stripBom(content)
  } catch (error) {
    throw new Error(
      `Could not read ${path.relative(repoRoot, filePath)}. Extract SafeWay.zip into .tmp-safeway-data first. ${error.message}`,
    )
  }
}

async function readCsv(filePath) {
  return parseCsv(await readText(filePath))
}

function parseCsv(content) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  for (let index = 0; index < content.length; index += 1) {
    const character = content[index]
    const nextCharacter = content[index + 1]

    if (character === '"') {
      if (inQuotes && nextCharacter === '"') {
        field += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (character === ',' && !inQuotes) {
      row.push(field)
      field = ''
      continue
    }

    if ((character === '\n' || character === '\r') && !inQuotes) {
      if (character === '\r' && nextCharacter === '\n') {
        index += 1
      }
      row.push(field)
      pushRow(rows, row)
      row = []
      field = ''
      continue
    }

    field += character
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field)
    pushRow(rows, row)
  }

  if (rows.length === 0) {
    return []
  }

  const headers = rows[0].map((header) => stripBom(header.trim()))

  return rows.slice(1).map((values) =>
    Object.fromEntries(headers.map((header, index) => [header, values[index]?.trim() ?? ''])),
  )
}

function pushRow(rows, row) {
  if (row.some((field) => field.trim().length > 0)) {
    rows.push(row)
  }
}

function stripBom(value) {
  return value.replace(/^\uFEFF/, '')
}

function toShelter(row, index) {
  const fanCount = toInteger(row['선풍기보유수'])
  const airConditionerCount = toInteger(row['에어컨보유수'])
  const nightOpen = toBoolean(row['야간개방여부'])
  const holidayOpen = toBoolean(row['휴일개방여부'])
  const facilities = ['화장실', '좌석']

  if (airConditionerCount > 0) facilities.push('냉방')
  if (fanCount > 0) facilities.push('선풍기')
  if (nightOpen) facilities.push('야간개방')
  if (holidayOpen) facilities.push('휴일개방')

  return {
    id: `safeway-shelter-${String(index + 1).padStart(3, '0')}`,
    name: row['쉼터명'],
    roadAddress: row['도로명주소'],
    lotAddress: row['지번주소'],
    type: row['쉼터유형'],
    area: toNumber(row['면적']),
    capacity: toInteger(row['동시이용가능인원수']),
    operationStartDate: row['운영시작일'],
    operationEndDate: row['운영종료일'],
    fanCount,
    airConditionerCount,
    nightOpen,
    holidayOpen,
    stayAvailable: toBoolean(row['숙박가능여부']),
    managingAgency: row['관리기관명'],
    phone: row['전화번호'],
    lat: toNumber(row['위도']),
    lng: toNumber(row['경도']),
    dataBaseDate: row['데이터기준일자'],
    capacityScore: toNumber(row['수용규모점수']),
    areaScore: toNumber(row['면적점수']),
    coolingScore: toNumber(row['냉방시설점수']),
    nightOpenScore: toNumber(row['야간개방점수']),
    holidayOpenScore: toNumber(row['휴일개방점수']),
    recommendationScore: toNumber(row['쉼터추천점수']),
    grade: row['쉼터등급'],
    isOpen: true,
    operationTime: '09:00 ~ 18:00',
    facilities,
  }
}

function toClimateScenario(row) {
  return {
    name: row['시나리오'],
    temperature: toNumber(row['기온']),
    humidity: toNumber(row['습도']),
    pm10: toNumber(row['미세먼지_PM10']),
    pm25: toNumber(row['초미세먼지_PM25']),
    ozone: toNumber(row['오존']),
    visibilityKm: toNumber(row['시정_km']),
  }
}

function toUserTypeWeight(row) {
  const userTypeLabel = row['사용자유형']

  return {
    userTypeLabel,
    userType: userTypeCodeByLabel.get(userTypeLabel) ?? 'GENERAL',
    climateSafetyWeight: toNumber(row['기후안전가중치']),
    shelterAccessWeight: toNumber(row['쉼터접근성가중치']),
    nightSafetyWeight: toNumber(row['야간안전가중치']),
    exposureTimeWeight: toNumber(row['노출시간가중치']),
  }
}

function toRouteRecommendation(row, index) {
  const userTypeLabel = row['사용자유형']

  return {
    id: `safeway-route-${String(index + 1).padStart(3, '0')}`,
    scenario: row['시나리오'],
    userTypeLabel,
    userType: userTypeCodeByLabel.get(userTypeLabel) ?? 'GENERAL',
    routeId: row['경로ID'],
    routeName: row['경로명'],
    distanceKm: toNumber(row['직선거리_km']),
    shelterWithin500mCount: toInteger(row['500m이내쉼터수']),
    climateRiskScore: toNumber(row['기후위험점수']),
    climateSafetyScore: toNumber(row['기후안전점수']),
    shelterAccessScore: toNumber(row['쉼터접근성점수_100점']),
    nightSafetyScore: toNumber(row['야간안전점수_100점']),
    exposureScore: toNumber(row['외부노출점수']),
    finalSafetyScore: toNumber(row['최종기후안전점수']),
  }
}

function toScenarioSummary(row) {
  return {
    scenario: row['시나리오'],
    recommendationCount: toInteger(row['추천결과수']),
    averageFinalSafetyScore: toNumber(row['평균최종기후안전점수']),
    maxScore: toNumber(row['최고점수']),
    minScore: toNumber(row['최저점수']),
  }
}

function toAnalysisSummary(summaryRows, summaryText, reportText) {
  const summaryValues = new Map(summaryRows.map((row) => [row['항목'], toNumber(row['값'])]))
  const summarySentences = toSentences(summaryText)
  const reportParagraphs = reportText
    .split(/\r?\n\r?\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
    .filter((paragraph) => paragraph && !paragraph.startsWith('#'))

  return {
    totalShelterCount: toInteger(summaryValues.get('전체 쉼터 수')),
    nightOpenShelterCount: toInteger(summaryValues.get('야간개방 쉼터 수')),
    holidayOpenShelterCount: toInteger(summaryValues.get('휴일개방 쉼터 수')),
    averageCapacity: roundNumber(summaryValues.get('평균 수용인원') ?? 0),
    averageAirConditionerCount: roundNumber(summaryValues.get('평균 에어컨 보유수') ?? 0),
    maxCapacity: toInteger(summaryValues.get('최대 수용인원')),
    maxAirConditionerCount: toInteger(summaryValues.get('최대 에어컨 보유수')),
    topFindings: summarySentences.slice(0, 5),
    shortReportTextSnippets: reportParagraphs.slice(0, 4),
    sourceFiles: [
      'data/processed/heat_shelter_scored.csv',
      'data/processed/climate_scenarios.csv',
      'data/processed/user_type_weights.csv',
      'outputs/reports/final_route_recommendation.csv',
      'outputs/reports/scenario_safety_score_summary.csv',
      'outputs/reports/heat_shelter_summary.csv',
      'outputs/reports/final_bigdata_analysis_summary.txt',
      'outputs/reports/bigdata_analysis_final_report.md',
    ],
  }
}

function toSentences(text) {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=다\.)\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
}

function toNumber(value) {
  if (typeof value === 'number') {
    return roundNumber(value)
  }

  const normalized = String(value ?? '').replaceAll(',', '').trim()
  const parsed = Number.parseFloat(normalized)

  return Number.isFinite(parsed) ? parsed : 0
}

function toInteger(value) {
  return Math.round(toNumber(value))
}

function roundNumber(value) {
  return Math.round(value * 100) / 100
}

function toBoolean(value) {
  return ['Y', 'YES', 'TRUE', '1', 'O', '예'].includes(String(value ?? '').trim().toUpperCase())
}

async function writeJson(fileName, data) {
  await writeFile(path.join(outputRoot, fileName), `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
