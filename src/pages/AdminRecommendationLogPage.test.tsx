import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AdminRecommendationLogPage } from '@/pages/AdminRecommendationLogPage'

const renderRecommendationLogPage = () =>
  render(
    <MemoryRouter initialEntries={['/admin/recommendation-logs']}>
      <Routes>
        <Route path="/admin/recommendation-logs" element={<AdminRecommendationLogPage />} />
      </Routes>
    </MemoryRouter>,
  )

describe('AdminRecommendationLogPage', () => {
  it('renders the page title, subtitle, and active sidebar item', () => {
    renderRecommendationLogPage()

    expect(screen.getByRole('heading', { name: '추천 로그 관리', level: 1 })).toBeInTheDocument()
    expect(screen.getByText('시민 경로 추천 이력 및 선택 패턴 조회')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '추천 로그' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('renders the filter panel defaults and actions', () => {
    renderRecommendationLogPage()

    expect(screen.getByText('기간')).toBeInTheDocument()
    expect(
      screen.getByDisplayValue('2025.05.22 ~ 2025.06.21 (최근 30일)'),
    ).toBeInTheDocument()
    expect(screen.getAllByText('사용자 유형').length).toBeGreaterThan(0)
    expect(screen.getAllByDisplayValue('전체').length).toBeGreaterThan(0)
    expect(screen.getAllByText('경로 유형').length).toBeGreaterThan(0)
    expect(screen.getAllByText('출발지').length).toBeGreaterThan(0)
    expect(screen.getAllByText('목적지').length).toBeGreaterThan(0)
    expect(screen.getAllByText('검색어').length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: /조회/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /CSV 다운로드/ })).toBeInTheDocument()
  })

  it('renders summary metrics and route type ratios', () => {
    renderRecommendationLogPage()

    ;['8,572건', '68%', '84.7점', '34분'].forEach((value) => {
      expect(screen.getAllByText(value).length).toBeGreaterThan(0)
    })

    expect(screen.getByRole('heading', { name: '경로 유형별 선택 비율' })).toBeInTheDocument()
    ;[
      '세이프웨이',
      '대중교통 대체경로',
      '야간 안전경로',
      '5,828건',
      '1,628건',
      '1,116건',
    ].forEach((text) => {
      expect(screen.getAllByText(text).length).toBeGreaterThan(0)
    })
  })

  it('renders abnormal pattern alerts', () => {
    renderRecommendationLogPage()

    expect(screen.getByRole('heading', { name: '이상 패턴 알림' })).toBeInTheDocument()
    expect(screen.getByText('야외근로자 경로 요청 급증')).toBeInTheDocument()
    expect(screen.getByText('야간 안전경로 사용률 증가')).toBeInTheDocument()
    expect(screen.getByText('보람동 구간 점수 하락')).toBeInTheDocument()
  })

  it('renders the recommendation log table rows, actions, pagination, and page size', () => {
    renderRecommendationLogPage()

    expect(screen.getByRole('heading', { name: /추천 로그 목록/ })).toBeInTheDocument()
    expect(screen.getAllByText('총 8,572건').length).toBeGreaterThan(0)

    const table = screen.getByRole('table', { name: '시민 경로 추천 이력 목록' })
    expect(within(table).getByText('2025.06.21 09:45')).toBeInTheDocument()
    expect(within(table).getAllByText('정부세종청사 1동').length).toBeGreaterThan(0)
    expect(within(table).getAllByText('세종특별자치시청').length).toBeGreaterThan(0)
    expect(within(table).getByText('92점')).toBeInTheDocument()
    expect(within(table).getByText('62%')).toBeInTheDocument()
    expect(within(table).getAllByRole('button', { name: /상세보기/ }).length).toBeGreaterThan(0)
    expect(within(table).getAllByRole('button', { name: /재분석/ }).length).toBeGreaterThan(0)

    expect(screen.getByRole('button', { name: '1' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByLabelText('페이지당 표시 개수')).toHaveDisplayValue('10개씩 보기')
  })

  it('applies local search filters and shows search feedback', async () => {
    const user = userEvent.setup()
    renderRecommendationLogPage()

    await user.type(screen.getByLabelText('검색어'), '세종예술의전당')
    await user.click(screen.getByRole('button', { name: /조회/ }))

    expect(screen.getByRole('status')).toHaveTextContent('추천 로그를 조회했습니다.')

    const table = screen.getByRole('table', { name: '시민 경로 추천 이력 목록' })
    expect(within(table).getAllByText('세종예술의전당').length).toBeGreaterThan(0)
    expect(within(table).queryByText('세종호수공원')).not.toBeInTheDocument()
  })

  it('opens row detail content and shows re-analysis feedback', async () => {
    const user = userEvent.setup()
    renderRecommendationLogPage()

    const table = screen.getByRole('table', { name: '시민 경로 추천 이력 목록' })
    await user.click(within(table).getAllByRole('button', { name: /상세보기/ })[0])

    expect(screen.getByRole('dialog', { name: '2025.06.21 09:45' })).toBeInTheDocument()
    expect(
      screen.getByText('폭염 노출을 줄이고 쉼터 접근성이 높은 경로로 추천되었습니다.'),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '닫기' }))
    await user.click(within(table).getAllByRole('button', { name: /재분석/ })[0])

    expect(screen.getByRole('status')).toHaveTextContent('해당 추천 로그를 재분석했습니다.')
  })

  it('shows demo feedback for alert detail actions', async () => {
    const user = userEvent.setup()
    renderRecommendationLogPage()

    await user.click(screen.getAllByRole('button', { name: /상세보기/ })[0])

    expect(screen.getByRole('status')).toHaveTextContent(
      '이상 패턴 상세 화면은 데모 준비 중입니다.',
    )
  })
})
