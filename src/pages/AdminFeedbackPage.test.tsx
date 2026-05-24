import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AdminFeedbackPage } from '@/pages/AdminFeedbackPage'

const renderAdminFeedbackPage = () =>
  render(
    <MemoryRouter initialEntries={['/admin/feedback']}>
      <Routes>
        <Route path="/admin/feedback" element={<AdminFeedbackPage />} />
        <Route path="/login" element={<div>login route</div>} />
      </Routes>
    </MemoryRouter>,
  )

describe('AdminFeedbackPage', () => {
  it('renders the title, subtitle, and active feedback sidebar item', () => {
    renderAdminFeedbackPage()

    expect(screen.getByRole('heading', { name: '사용자 피드백 분석', level: 1 })).toBeInTheDocument()
    expect(screen.getByText('시민 의견과 만족도 기반 서비스 개선 현황')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '피드백 분석' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('renders the filter toolbar defaults', () => {
    renderAdminFeedbackPage()

    expect(screen.getByText('기간')).toBeInTheDocument()
    expect(screen.getByDisplayValue('2025.05.22 ~ 2025.06.21 (최근 30일)')).toBeInTheDocument()
    expect(screen.getByText('사용자 유형')).toBeInTheDocument()
    expect(screen.getByLabelText('사용자 유형')).toHaveValue('전체')
    expect(screen.getAllByText('경로 유형').length).toBeGreaterThan(0)
    expect(screen.getByLabelText('경로 유형')).toHaveValue('전체')
    expect(screen.getByRole('button', { name: /필터 초기화/ })).toBeInTheDocument()
  })

  it('renders summary metric values', () => {
    renderAdminFeedbackPage()

    expect(screen.getAllByText('1,248건').length).toBeGreaterThan(0)
    expect(screen.getByText('4.6 / 5')).toBeInTheDocument()
    expect(screen.getByText('82%')).toBeInTheDocument()
    expect(screen.getByText('41%')).toBeInTheDocument()
  })

  it('renders chart and analysis panels', () => {
    renderAdminFeedbackPage()

    expect(screen.getByRole('heading', { name: '만족도 추이' })).toBeInTheDocument()

    expect(screen.getByRole('heading', { name: '체감 위험도 분포' })).toBeInTheDocument()
    ;['낮음 (1~2)', '보통 (3)', '높음 (4)', '매우 높음 (5)'].forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument()
    })
    expect(screen.getAllByText('합계').length).toBeGreaterThan(0)
    expect(screen.getAllByText('1,248건').length).toBeGreaterThan(0)

    expect(screen.getByRole('heading', { name: '경로 유형별 만족도' })).toBeInTheDocument()
    ;['추천 경로', '최단 경로', '안전 우선', '그늘 우선', '경사 완만'].forEach((label) => {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0)
    })

    expect(screen.getByRole('heading', { name: '자주 언급된 피드백 키워드' })).toBeInTheDocument()
    ;['그늘', '쉼터', '안심', '가로등'].forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument()
    })
  })

  it('renders the recent feedback table and pagination controls', () => {
    renderAdminFeedbackPage()

    expect(screen.getByRole('heading', { name: '최근 피드백' })).toBeInTheDocument()
    expect(screen.getByText('2025.06.21 14:05')).toBeInTheDocument()
    expect(
      screen.getByText('그늘이 많아 조성되어 있어 한여름에도 이용하기 좋았습니다.'),
    ).toBeInTheDocument()
    expect(screen.getAllByText('검토중').length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: '1' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByLabelText('페이지당 표시 개수')).toHaveDisplayValue('10개씩 보기')
  })

  it('shows local demo messages for reset and full-view actions', async () => {
    const user = userEvent.setup()
    renderAdminFeedbackPage()

    await user.click(screen.getByRole('button', { name: /필터 초기화/ }))
    expect(screen.getByText('필터가 초기화되었습니다.')).toBeInTheDocument()

    const fullViewButtons = screen.getAllByRole('button', { name: /전체보기/ })

    await user.click(fullViewButtons[0])
    expect(screen.getByText('전체 키워드 분석 화면은 데모 준비 중입니다.')).toBeInTheDocument()

    await user.click(fullViewButtons[1])
    expect(screen.getByText('전체 피드백 목록은 데모 준비 중입니다.')).toBeInTheDocument()
  })
})
