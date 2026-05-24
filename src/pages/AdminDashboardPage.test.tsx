import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AdminDashboardPage } from '@/pages/AdminDashboardPage'

const renderAdminDashboard = () =>
  render(
    <MemoryRouter initialEntries={['/admin']}>
      <AdminDashboardPage />
    </MemoryRouter>,
  )

describe('AdminDashboardPage', () => {
  it('renders the admin header', () => {
    renderAdminDashboard()

    expect(
      screen.getByRole('heading', { name: '세종 세이프웨이 관리자' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '알림' })).toBeInTheDocument()
    expect(screen.getByText('김세종 관리자')).toBeInTheDocument()
    expect(screen.getByText('안전정책과')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '로그아웃' })).toBeInTheDocument()
  })

  it('renders every sidebar menu item with dashboard active', () => {
    renderAdminDashboard()

    ;[
      '대시보드',
      '기후위험 지도',
      '쉼터 사각지대',
      '임시쉼터 후보',
      '추천 로그',
      '피드백 분석',
      '공공데이터 관리',
      '리포트',
      '설정',
    ].forEach((label) => {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    })
    expect(screen.getByRole('link', { name: '대시보드' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('renders summary stat values', () => {
    renderAdminDashboard()

    expect(screen.getByText('1,284건')).toBeInTheDocument()
    expect(screen.getByText('86점')).toBeInTheDocument()
    expect(screen.getByText('4개')).toBeInTheDocument()
    expect(screen.getByText('128개')).toBeInTheDocument()
  })

  it('renders the climate risk map panel', () => {
    renderAdminDashboard()

    expect(screen.getByRole('heading', { name: /기후위험 지도/ })).toBeInTheDocument()
    expect(screen.getAllByText('폭염').length).toBeGreaterThan(0)
    expect(screen.getAllByText('미세먼지').length).toBeGreaterThan(0)
    expect(screen.getAllByText('안개').length).toBeGreaterThan(0)
    expect(screen.getAllByText('나성동').length).toBeGreaterThan(0)
    expect(screen.getByText('위험도 매우 높음')).toBeInTheDocument()
  })

  it('renders the time-risk chart and risk ratio panel', () => {
    renderAdminDashboard()

    expect(
      screen.getByRole('heading', { name: /시간대별 기후위험 현황/ }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /위험 유형 비율/ })).toBeInTheDocument()
    expect(screen.getByText('합계')).toBeInTheDocument()
    expect(screen.getByText('1,934건')).toBeInTheDocument()
  })

  it('renders the top risk table and recent alerts', () => {
    renderAdminDashboard()

    expect(screen.getByRole('heading', { name: /위험 권역 TOP 5/ })).toBeInTheDocument()
    expect(screen.getByText('위험 단계 상승')).toBeInTheDocument()
    expect(screen.getByText('쉼터 운영 알림')).toBeInTheDocument()
    expect(screen.getByText('데이터 갱신 완료')).toBeInTheDocument()
    expect(screen.getByText('추천 완료')).toBeInTheDocument()
  })
})
