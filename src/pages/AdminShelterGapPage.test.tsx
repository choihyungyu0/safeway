import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AdminShelterGapPage } from '@/pages/AdminShelterGapPage'

function LocationProbe() {
  const location = useLocation()

  return <span data-testid="current-path">{location.pathname}</span>
}

const renderShelterGapPage = () =>
  render(
    <MemoryRouter initialEntries={['/admin/shelter-gaps']}>
      <Routes>
        <Route
          path="/admin/shelter-gaps"
          element={
            <>
              <AdminShelterGapPage />
              <LocationProbe />
            </>
          }
        />
        <Route
          path="/admin/temporary-shelters"
          element={
            <>
              <div>임시쉼터 후보 관리</div>
              <LocationProbe />
            </>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <>
              <div>분석 리포트</div>
              <LocationProbe />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <div>로그인 페이지</div>
              <LocationProbe />
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  )

describe('AdminShelterGapPage', () => {
  it('renders the title, subtitle, and active sidebar item', () => {
    renderShelterGapPage()

    expect(screen.getByRole('heading', { name: '쉼터 사각지대 분석' })).toBeInTheDocument()
    expect(
      screen.getByText('폭염·미세먼지 취약 보행축과 쉼터 접근성 분석'),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '쉼터 사각지대' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('renders the filter toolbar defaults', () => {
    renderShelterGapPage()

    expect(screen.getByLabelText('위험 유형')).toHaveDisplayValue('폭염')
    expect(screen.getByLabelText('사용자 유형')).toHaveDisplayValue('일반 성인')
    expect(screen.getByLabelText('분석 반경')).toHaveDisplayValue('500m')
    expect(screen.getByLabelText('기준 시간대')).toHaveDisplayValue('14:00')
  })

  it('renders the map legend and priority map labels', () => {
    renderShelterGapPage()

    ;['쉼터 (기존)', '사각지대 (취약)', '보행축 (취약)', '분석 반경 (500m)'].forEach(
      (label) => {
        expect(screen.getAllByText(label).length).toBeGreaterThan(0)
      },
    )
    expect(screen.getAllByText('임시쉼터 후보').length).toBeGreaterThan(0)

    ;['어진동 호수공원 동측', '나성동 남측 보행축', '보람동 생활권'].forEach((label) => {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0)
    })
  })

  it('renders the priority improvement panel', () => {
    renderShelterGapPage()

    expect(screen.getByRole('heading', { name: /우선 개선 권역/ })).toBeInTheDocument()
    expect(screen.getAllByText('나성동 남측 보행축').length).toBeGreaterThan(0)
    expect(screen.getByText('4,860명')).toBeInTheDocument()
    expect(screen.getByText('18.6분')).toBeInTheDocument()
    expect(screen.getAllByText('3개').length).toBeGreaterThan(0)
  })

  it('renders the temporary shelter candidate table', () => {
    renderShelterGapPage()

    expect(screen.getByRole('heading', { name: '임시쉼터 후보' })).toBeInTheDocument()
    ;[
      '나성동 주민센터',
      '세종복합커뮤니티센터',
      '어진동 주민센터',
      '세종시립도서관',
      '보람동 복합커뮤니티센터',
    ].forEach((candidate) => {
      expect(screen.getByText(candidate)).toBeInTheDocument()
    })
  })

  it('resets filters and shows reset feedback', async () => {
    const user = userEvent.setup()
    renderShelterGapPage()

    await user.selectOptions(screen.getByLabelText('위험 유형'), 'FINE_DUST')
    await user.selectOptions(screen.getByLabelText('사용자 유형'), 'SENIOR')
    await user.selectOptions(screen.getByLabelText('분석 반경'), '700m')
    await user.selectOptions(screen.getByLabelText('기준 시간대'), '21:00')

    await user.click(screen.getByRole('button', { name: /분석 조건 초기화/ }))

    expect(screen.getByLabelText('위험 유형')).toHaveValue('HEAT')
    expect(screen.getByLabelText('사용자 유형')).toHaveValue('GENERAL')
    expect(screen.getByLabelText('분석 반경')).toHaveValue('500m')
    expect(screen.getByLabelText('기준 시간대')).toHaveValue('14:00')
    expect(screen.getByText('분석 조건이 초기화되었습니다.')).toBeInTheDocument()
  })

  it('navigates to temporary shelter candidates', async () => {
    const user = userEvent.setup()
    renderShelterGapPage()

    await user.click(screen.getByRole('button', { name: '임시쉼터 후보 보기' }))

    expect(screen.getByText('임시쉼터 후보 관리')).toBeInTheDocument()
    expect(screen.getByTestId('current-path')).toHaveTextContent('/admin/temporary-shelters')
  })

  it('navigates to the report page from report actions', async () => {
    const user = userEvent.setup()
    renderShelterGapPage()

    await user.click(screen.getByRole('button', { name: '리포트 생성' }))
    expect(screen.getByText('분석 리포트')).toBeInTheDocument()
    expect(screen.getByTestId('current-path')).toHaveTextContent('/admin/reports')
  })

  it('renders the shared admin header', () => {
    renderShelterGapPage()

    expect(screen.getByRole('button', { name: /알림/ })).toBeInTheDocument()
    expect(screen.getByText('김세종 관리자')).toBeInTheDocument()
    expect(screen.getByText('안전정책과')).toBeInTheDocument()
  })
})
