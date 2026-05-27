import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  Eye,
  FileDown,
  FileSpreadsheet,
  Info,
  Lightbulb,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AdminShellLayout as AdminLayout } from '@/features/admin/components/AdminShellLayout'
import {
  AdminLeafletMap,
  type AdminLeafletCircle,
} from '@/features/admin/components/AdminLeafletMap'
import {
  defaultReportFilter,
  reportRegionOptions,
  reportRiskTypeOptions,
  reportTypeOptions,
  reportUserTypeOptions,
} from '@/features/admin/report.constants'
import type {
  PolicyProposal,
  ReportChapter,
  ReportFilter,
  ReportMetric,
  ReportPreviewPage,
  ReportSummaryKeyword,
  ShelterPriorityItem,
} from '@/features/admin/report.types'
import {
  policyProposal,
  reportChapters,
  reportFeedbackKeywords,
  reportMetrics,
  reportPreviewPages,
  shelterPriorityItems,
} from '@/mocks/fixtures/adminReports'
import styles from '@/pages/AdminReportPage.module.css'

type StatusMessage = {
  id: number
  text: string
}

type FilterKey = keyof ReportFilter

const reportHeatCircles: AdminLeafletCircle[] = [
  {
    id: 'report-heat-one',
    position: { x: 32, y: 35 },
    radiusMeters: 760,
    tone: 'danger',
    label: '매우 높음',
    fillOpacity: 0.24,
  },
  {
    id: 'report-heat-two',
    position: { x: 45, y: 68 },
    radiusMeters: 680,
    tone: 'warning',
    label: '높음',
    fillOpacity: 0.2,
  },
  {
    id: 'report-heat-three',
    position: { x: 72, y: 70 },
    radiusMeters: 620,
    tone: 'warning',
    label: '보통',
    fillOpacity: 0.16,
  },
]

export function AdminReportPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<ReportFilter>(defaultReportFilter)
  const [selectedPage, setSelectedPage] = useState(1)
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null)

  const announce = (text: string) => {
    setStatusMessage({ id: Date.now(), text })
  }

  const updateFilter = <Key extends FilterKey>(key: Key, value: ReportFilter[Key]) => {
    setFilters((current) => ({ ...current, [key]: value }))
  }

  return (
    <AdminLayout headerSubtitle="세종특별자치시 공공데이터 기반 운영현황">
      <section className={styles.page} aria-labelledby="report-title">
        <header className={styles.pageTitle}>
          <h1 id="report-title">분석 리포트</h1>
          <p>세종시 기후안전 경로 및 쉼터 운영 분석 보고서</p>
        </header>

        <ReportSettingsPanel
          filters={filters}
          onFilterChange={updateFilter}
          onPreview={() => announce('리포트 미리보기를 갱신했습니다.')}
          onPdf={() => announce('PDF 다운로드는 데모 준비 중입니다.')}
          onExcel={() => announce('엑셀 다운로드는 데모 준비 중입니다.')}
        />

        {statusMessage ? (
          <p key={statusMessage.id} className={styles.statusMessage} role="status">
            {statusMessage.text}
          </p>
        ) : null}

        <section className={styles.reportGrid} aria-label="분석 리포트 본문">
          <ReportPreviewPanel
            pages={reportPreviewPages}
            selectedPage={selectedPage}
            onSelectPage={setSelectedPage}
          />

          <div className={styles.contentColumn}>
            <section className={styles.metricGrid} aria-label="리포트 핵심 지표">
              {reportMetrics.map((metric) => (
                <ReportMetricCard key={metric.id} metric={metric} />
              ))}
            </section>

            <ReportCoreSummary
              priorities={shelterPriorityItems}
              keywords={reportFeedbackKeywords}
              onShowClimate={() => navigate('/admin/climate-risk-map')}
              onShowShelterGaps={() => navigate('/admin/shelter-gaps')}
              onShowFeedback={() => navigate('/admin/feedback')}
            />
          </div>
        </section>

        <section className={styles.bottomGrid} aria-label="리포트 구성 및 정책 제안">
          <ReportCompositionCard chapters={reportChapters} />
          <PolicyProposalCard
            proposal={policyProposal}
            onShowDetail={() => announce('정책 제안 상세 화면은 데모 준비 중입니다.')}
          />
        </section>
      </section>
    </AdminLayout>
  )
}

type ReportSettingsPanelProps = {
  filters: ReportFilter
  onFilterChange: <Key extends FilterKey>(key: Key, value: ReportFilter[Key]) => void
  onPreview: () => void
  onPdf: () => void
  onExcel: () => void
}

function ReportSettingsPanel({
  filters,
  onFilterChange,
  onPreview,
  onPdf,
  onExcel,
}: ReportSettingsPanelProps) {
  return (
    <section className={styles.settingsCard} aria-labelledby="report-settings-title">
      <h2 id="report-settings-title">리포트 설정</h2>

      <div className={styles.settingsRow}>
        <label className={styles.controlBox} htmlFor="report-period">
          <span>기간</span>
          <span className={styles.inputShell}>
            <Calendar size={17} strokeWidth={2.2} aria-hidden="true" />
            <input
              id="report-period"
              value={filters.period}
              aria-label="기간"
              readOnly
            />
          </span>
        </label>

        <ReportSelect
          id="report-region"
          label="지역"
          value={filters.region}
          options={reportRegionOptions}
          onChange={(value) => onFilterChange('region', value)}
        />
        <ReportSelect
          id="report-risk-type"
          label="위험유형"
          value={filters.riskType}
          options={reportRiskTypeOptions}
          onChange={(value) => onFilterChange('riskType', value)}
        />
        <ReportSelect
          id="report-user-type"
          label="사용자 유형"
          value={filters.userType}
          options={reportUserTypeOptions}
          onChange={(value) => onFilterChange('userType', value)}
        />
        <ReportSelect
          id="report-type"
          label="리포트 종류"
          value={filters.reportType}
          options={reportTypeOptions}
          onChange={(value) => onFilterChange('reportType', value)}
          wide
        />

        <div className={styles.actionGroup}>
          <button type="button" className={styles.previewButton} onClick={onPreview}>
            <Eye size={18} strokeWidth={2.3} aria-hidden="true" />
            미리보기
          </button>
          <button type="button" className={styles.pdfButton} onClick={onPdf}>
            <FileDown size={18} strokeWidth={2.3} aria-hidden="true" />
            PDF 다운로드
          </button>
          <button type="button" className={styles.excelButton} onClick={onExcel}>
            <FileSpreadsheet size={18} strokeWidth={2.3} aria-hidden="true" />
            엑셀 다운로드
          </button>
        </div>
      </div>
    </section>
  )
}

type ReportSelectProps = {
  id: string
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
  wide?: boolean
}

function ReportSelect({ id, label, value, options, onChange, wide }: ReportSelectProps) {
  return (
    <label className={`${styles.controlBox} ${wide ? styles.wideControl : ''}`} htmlFor={id}>
      <span>{label}</span>
      <span className={styles.selectShell}>
        <select
          id={id}
          value={value}
          aria-label={label}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown size={16} strokeWidth={2.2} aria-hidden="true" />
      </span>
    </label>
  )
}

type ReportPreviewPanelProps = {
  pages: ReportPreviewPage[]
  selectedPage: number
  onSelectPage: (page: number) => void
}

function ReportPreviewPanel({ pages, selectedPage, onSelectPage }: ReportPreviewPanelProps) {
  return (
    <section className={`${styles.card} ${styles.previewCard}`} aria-labelledby="preview-title">
      <h2 id="preview-title">리포트 미리보기</h2>

      <article
        className={styles.coverPage}
        aria-label="2025년 6월 세종시 기후안전 운영 리포트 미리보기이며 고위험 권역 7개, 쉼터 사각지대 12개, 임시쉼터 후보 24개, 평균 만족도 4.6점을 요약합니다."
      >
        <div className={styles.coverHero} aria-hidden="true">
          <div className={styles.sky} />
          <div className={styles.bridge} />
          <div className={styles.river} />
          <div className={styles.citySkyline}>
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className={styles.treeLine} />
        </div>

        <div className={styles.coverText}>
          <p>2025년 6월</p>
          <h3>세종시 기후안전 운영 리포트</h3>
          <span>세종시 기후안전 경로 및 쉼터 운영 분석 보고서</span>
        </div>

        <div className={styles.coverSummary}>
          <h4>핵심 요약</h4>
          <ul>
            <li>고위험 권역 7개 확인</li>
            <li>쉼터 사각지대 12개 확인</li>
            <li>임시쉼터 후보 24개 도출</li>
            <li>평균 만족도 4.6점/5점</li>
          </ul>
        </div>
      </article>

      <div className={styles.thumbnailRow} aria-label="리포트 페이지 미리보기 목록">
        {pages.map((page) => (
          <button
            key={page.page}
            type="button"
            className={selectedPage === page.page ? styles.activeThumbnail : undefined}
            aria-label={page.thumbnailLabel}
            aria-pressed={selectedPage === page.page}
            onClick={() => onSelectPage(page.page)}
          >
            <span className={styles.thumbnailSheet} aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <strong>{page.page}</strong>
          </button>
        ))}
      </div>
    </section>
  )
}

function ReportMetricCard({ metric }: { metric: ReportMetric }) {
  const Icon = metric.icon

  return (
    <article className={styles.metricCard}>
      <div className={`${styles.metricIcon} ${styles[metric.accent]}`} aria-hidden="true">
        <Icon size={31} strokeWidth={2.25} />
      </div>
      <div>
        <p>{metric.title}</p>
        <strong>{metric.value}</strong>
      </div>
      <span>{metric.comparison}</span>
    </article>
  )
}

type ReportCoreSummaryProps = {
  priorities: ShelterPriorityItem[]
  keywords: ReportSummaryKeyword[]
  onShowClimate: () => void
  onShowShelterGaps: () => void
  onShowFeedback: () => void
}

function ReportCoreSummary({
  priorities,
  keywords,
  onShowClimate,
  onShowShelterGaps,
  onShowFeedback,
}: ReportCoreSummaryProps) {
  return (
    <section className={`${styles.card} ${styles.summaryCard}`} aria-labelledby="summary-title">
      <h2 id="summary-title">핵심 요약</h2>

      <div className={styles.summaryGrid}>
        <SummaryPanel title="기후위험 집중 지역" onClick={onShowClimate} actionLabel="자세히 보기">
          <div className={styles.heatmapWrap}>
            <AdminLeafletMap
              className={styles.miniMap}
              ariaLabel="기후위험 집중 지역 Leaflet 열지도"
              circles={reportHeatCircles}
              center={{ x: 52, y: 55 }}
              zoom={11}
              fitToContent={false}
              showBadge={false}
              zoomControl={false}
              attributionControl={false}
            />
            <div className={styles.legendList} aria-label="위험도 범례">
              {['매우 높음', '높음', '보통', '낮음', '매우 낮음'].map((label, index) => (
                <span key={label}>
                  <i className={styles[`legend${index + 1}`]} aria-hidden="true" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </SummaryPanel>

        <SummaryPanel
          title="쉼터 접근성 개선 우선순위"
          onClick={onShowShelterGaps}
          actionLabel="전체 보기"
        >
          <ol className={styles.priorityList}>
            {priorities.map((item) => (
              <li key={item.rank}>
                <span>{item.rank}</span>
                <p>{item.area}</p>
                <strong>{item.score}점</strong>
              </li>
            ))}
          </ol>
        </SummaryPanel>

        <SummaryPanel title="시민 피드백 요약" onClick={onShowFeedback} actionLabel="자세히 보기">
          <p className={styles.keywordTitle}>주요 키워드 TOP 4</p>
          <div className={styles.keywordGrid}>
            {keywords.map((keyword) => (
              <span key={keyword.keyword}>
                <strong>{keyword.keyword}</strong>
                <small>{keyword.count}</small>
              </span>
            ))}
          </div>
          <div className={styles.feedbackProgress}>
            <div>
              <span>긍정 피드백 비율</span>
              <strong>68%</strong>
            </div>
            <p aria-label="긍정 피드백 비율 68%">
              <span style={{ width: '68%' }} />
            </p>
          </div>
        </SummaryPanel>
      </div>
    </section>
  )
}

type SummaryPanelProps = {
  title: string
  children: ReactNode
  actionLabel: string
  onClick: () => void
}

function SummaryPanel({ title, children, actionLabel, onClick }: SummaryPanelProps) {
  return (
    <article className={styles.summaryPanel}>
      <h3>
        {title}
        <Info size={15} strokeWidth={2.2} aria-hidden="true" />
      </h3>
      {children}
      <button type="button" onClick={onClick}>
        {actionLabel}
        <ChevronRight size={17} strokeWidth={2.25} aria-hidden="true" />
      </button>
    </article>
  )
}

function ReportCompositionCard({ chapters }: { chapters: ReportChapter[] }) {
  return (
    <section className={`${styles.card} ${styles.compositionCard}`} aria-labelledby="chapters-title">
      <h2 id="chapters-title">
        리포트 구성
        <Info size={15} strokeWidth={2.2} aria-hidden="true" />
      </h2>

      <div className={styles.chapterScroller}>
        {chapters.map((chapter) => (
          <article className={styles.chapterItem} key={chapter.number}>
            <CircleCheck size={18} strokeWidth={2.4} aria-hidden="true" />
            <strong>{chapter.number}</strong>
            <h3>{chapter.title}</h3>
            <p>{chapter.description}</p>
          </article>
        ))}
      </div>

      <div className={styles.compositionFooter}>
        <p>
          <Info size={16} strokeWidth={2.2} aria-hidden="true" />
          모든 항목이 포함된 종합 분석 리포트입니다.
        </p>
        <strong>총 7개 챕터</strong>
      </div>
    </section>
  )
}

type PolicyProposalCardProps = {
  proposal: PolicyProposal
  onShowDetail: () => void
}

function PolicyProposalCard({ proposal, onShowDetail }: PolicyProposalCardProps) {
  return (
    <section className={`${styles.card} ${styles.policyCard}`} aria-labelledby="policy-title">
      <h2 id="policy-title">
        정책 제안
        <Info size={15} strokeWidth={2.2} aria-hidden="true" />
      </h2>

      <article className={styles.policyPanel}>
        <div className={styles.policyIcon} aria-hidden="true">
          <Lightbulb size={31} strokeWidth={2.2} />
        </div>
        <div>
          <p>{proposal.title}</p>
          <h3>{proposal.emphasis}</h3>
          <span>{proposal.description}</span>
        </div>
      </article>

      <button type="button" className={styles.policyButton} onClick={onShowDetail}>
        상세 제안 보기
        <ChevronRight size={17} strokeWidth={2.25} aria-hidden="true" />
      </button>
    </section>
  )
}
