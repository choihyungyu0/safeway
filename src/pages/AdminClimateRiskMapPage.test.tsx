import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AdminClimateRiskMapPage } from '@/pages/AdminClimateRiskMapPage'

const renderClimateRiskPage = () =>
  render(
    <MemoryRouter initialEntries={['/admin/climate-risk-map']}>
      <Routes>
        <Route path="/admin/climate-risk-map" element={<AdminClimateRiskMapPage />} />
        <Route path="/login" element={<div>login route</div>} />
      </Routes>
    </MemoryRouter>,
  )

const textContentMatcher = (text: string) => (_content: string, element: Element | null) =>
  element?.textContent === text

describe('AdminClimateRiskMapPage', () => {
  it('renders the title, subtitle, and active sidebar item', () => {
    renderClimateRiskPage()

    expect(screen.getByRole('heading', { name: '기후위험 지도', level: 1 })).toBeInTheDocument()
    expect(screen.getByText('폭염·미세먼지·안개 위험 권역 모니터링')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '기후위험 지도' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('renders the filter toolbar values', () => {
    renderClimateRiskPage()

    expect(screen.getAllByText('위험 유형').length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: /폭염/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /미세먼지/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /안개/ })).toBeInTheDocument()
    expect(screen.getByText('기준일시')).toBeInTheDocument()
    expect(screen.getByText('2025.06.21 14:00')).toBeInTheDocument()
    expect(screen.getByLabelText('사용자 유형')).toHaveValue('일반 성인')
    expect(screen.getByLabelText('표시 범위')).toHaveValue('전체')
  })

  it('renders the map panel, legend, summary cards, charts, and table data', () => {
    renderClimateRiskPage()

    expect(screen.getByRole('heading', { name: '위험 지도 (폭염)' })).toBeInTheDocument()
    expect(screen.getAllByText('어진동').length).toBeGreaterThan(0)
    expect(screen.getAllByText('나성동').length).toBeGreaterThan(0)
    expect(screen.getAllByText('보람동').length).toBeGreaterThan(0)
    expect(screen.getByText('위험 매우 높음')).toBeInTheDocument()

    expect(screen.getAllByText('매우 높음').length).toBeGreaterThan(0)
    expect(screen.getAllByText('높음').length).toBeGreaterThan(0)
    expect(screen.getAllByText('보통').length).toBeGreaterThan(0)
    expect(screen.getAllByText('낮음').length).toBeGreaterThan(0)
    expect(screen.getByText('매우 낮음')).toBeInTheDocument()

    expect(screen.getByText('86점')).toBeInTheDocument()
    expect(screen.getByText('4개')).toBeInTheDocument()
    expect(screen.getByText('5개')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '시간대별 위험지수' })).toBeInTheDocument()

    expect(screen.getByRole('heading', { name: '위험 유형 비율 (폭염 기준)' })).toBeInTheDocument()
    expect(screen.getByText(textContentMatcher('합계 3,514건'))).toBeInTheDocument()

    expect(screen.getByRole('heading', { name: '위험 권역 TOP 5 (폭염 기준)' })).toBeInTheDocument()
    expect(screen.getAllByText('나성동').length).toBeGreaterThan(0)
    expect(screen.getAllByText('94').length).toBeGreaterThan(0)
    expect(screen.getByText('326건')).toBeInTheDocument()
  })

  it('updates the selected risk type titles', async () => {
    const user = userEvent.setup()
    renderClimateRiskPage()

    await user.click(screen.getByRole('button', { name: /미세먼지/ }))

    expect(screen.getByRole('button', { name: /미세먼지/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('heading', { name: '위험 지도 (미세먼지)' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '위험 권역 TOP 5 (미세먼지 기준)' }),
    ).toBeInTheDocument()
  })

  it('shows a download preparation message', async () => {
    const user = userEvent.setup()
    renderClimateRiskPage()

    await user.click(screen.getByRole('button', { name: /전체 다운로드/ }))

    expect(screen.getByText('위험 권역 데이터 다운로드를 준비 중입니다.')).toBeInTheDocument()
  })

  it('renders the shared admin header', () => {
    renderClimateRiskPage()

    expect(screen.getByRole('button', { name: /알림/ })).toBeInTheDocument()
    expect(screen.getByText('김세종 관리자')).toBeInTheDocument()
    expect(screen.getByText('안전정책과')).toBeInTheDocument()
  })
})
