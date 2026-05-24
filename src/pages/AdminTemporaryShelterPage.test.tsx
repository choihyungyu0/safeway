import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AdminTemporaryShelterPage } from '@/pages/AdminTemporaryShelterPage'

function LocationProbe() {
  const location = useLocation()

  return <span data-testid="current-path">{location.pathname}</span>
}

const renderTemporaryShelterPage = (initialPath = '/admin/temporary-shelters') =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route
          path="/admin/temporary-shelters"
          element={
            <>
              <AdminTemporaryShelterPage />
              <LocationProbe />
            </>
          }
        />
        <Route
          path="/admin/temporary-shelter-candidates"
          element={
            <>
              <AdminTemporaryShelterPage />
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

describe('AdminTemporaryShelterPage', () => {
  it('renders the title, subtitle, and active sidebar item', () => {
    renderTemporaryShelterPage()

    expect(screen.getByRole('heading', { name: '임시쉼터 후보 관리' })).toBeInTheDocument()
    expect(
      screen.getByText('쉼터 사각지대 해소를 위한 후보 시설 검토 현황'),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '임시쉼터 후보' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('renders the filter toolbar defaults', () => {
    renderTemporaryShelterPage()

    expect(screen.getByLabelText('기간')).toHaveDisplayValue(
      '2025.05.22 ~ 2025.06.21 (최근 30일)',
    )
    expect(screen.getByLabelText('지역')).toHaveDisplayValue('전체')
    expect(screen.getByLabelText('시설유형')).toHaveDisplayValue('전체')
    expect(screen.getByLabelText('우선순위')).toHaveDisplayValue('전체')
    expect(screen.getByRole('button', { name: /초기화/ })).toBeInTheDocument()
  })

  it('renders summary stat values', () => {
    renderTemporaryShelterPage()

    ;['24개', '7개', '18,420명', '+21%'].forEach((value) => {
      expect(screen.getByText(value)).toBeInTheDocument()
    })
  })

  it('renders the map panel legend and district labels', () => {
    renderTemporaryShelterPage()

    expect(screen.getByRole('heading', { name: '세종시 후보 위치 지도' })).toBeInTheDocument()
    ;['쉼터 사각지대(위험)', '쉼터 사각지대(주의)', '후보 시설'].forEach((label) => {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0)
    })
    ;['나성동', '어진동', '보람동', '한솔동'].forEach((district) => {
      expect(screen.getAllByText(district).length).toBeGreaterThan(0)
    })
  })

  it('renders the priority candidate table', () => {
    renderTemporaryShelterPage()

    expect(screen.getByRole('heading', { name: '우선 검토 후보' })).toBeInTheDocument()
    ;[
      '나성동 주민센터 별관',
      '보람청소년센터',
      '한솔복컴 체육관',
      '어진동 공공청사 회의동',
      '소담동 체육문화센터',
    ].forEach((candidate) => {
      expect(screen.getAllByText(candidate).length).toBeGreaterThan(0)
    })
  })

  it('renders the default selected detail panel', () => {
    renderTemporaryShelterPage()

    expect(screen.getByRole('heading', { name: '선택 후보 상세' })).toBeInTheDocument()
    expect(
      screen.getByText('세종특별자치시 나성북로 33, 나성동 주민센터 별관'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('평일 09:00 ~ 21:00 / 주말 09:00 ~ 18:00'),
    ).toBeInTheDocument()
    expect(screen.getByText('120명')).toBeInTheDocument()
    expect(screen.getByText('접근성 개선')).toBeInTheDocument()
    expect(screen.getByText('+28%')).toBeInTheDocument()
    expect(screen.getByText('3,620명')).toBeInTheDocument()
  })

  it('updates selected detail when a candidate row is clicked', async () => {
    const user = userEvent.setup()
    renderTemporaryShelterPage()

    await user.click(screen.getByText('보람청소년센터'))

    expect(screen.getByText('세종특별자치시 보람로 21, 보람청소년센터')).toBeInTheDocument()
    expect(
      screen.getByText('보람동 생활권 내 쉼터 접근 취약 구간을 보완할 수 있는 후보입니다.'),
    ).toBeInTheDocument()
  })

  it('updates selected detail when a map marker is clicked', async () => {
    const user = userEvent.setup()
    renderTemporaryShelterPage()

    await user.click(screen.getByRole('button', { name: '3순위 한솔복컴 체육관 후보 선택' }))

    expect(
      screen.getByText('세종특별자치시 한솔로 45, 한솔복합커뮤니티센터'),
    ).toBeInTheDocument()
    expect(screen.getByText('150명')).toBeInTheDocument()
  })

  it('shows reset feedback', async () => {
    const user = userEvent.setup()
    renderTemporaryShelterPage()

    await user.selectOptions(screen.getByLabelText('지역'), '나성동')
    await user.selectOptions(screen.getByLabelText('시설유형'), '공공청사')
    await user.selectOptions(screen.getByLabelText('우선순위'), '높음')
    await user.click(screen.getByRole('button', { name: /초기화/ }))

    expect(screen.getByLabelText('지역')).toHaveDisplayValue('전체')
    expect(screen.getByLabelText('시설유형')).toHaveDisplayValue('전체')
    expect(screen.getByLabelText('우선순위')).toHaveDisplayValue('전체')
    expect(screen.getByText('필터가 초기화되었습니다.')).toBeInTheDocument()
  })

  it('shows demo feedback for candidate actions', async () => {
    const user = userEvent.setup()
    renderTemporaryShelterPage()

    await user.click(screen.getByRole('button', { name: /후보 확정/ }))
    expect(screen.getByText('임시쉼터 후보가 확정되었습니다.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /현장 조사 요청/ }))
    expect(screen.getByText('현장 조사 요청이 등록되었습니다.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /리포트 생성/ }))
    expect(screen.getByText('분석 리포트')).toBeInTheDocument()
    expect(screen.getByTestId('current-path')).toHaveTextContent('/admin/reports')
  })

  it('shows demo feedback for the full candidate list button', async () => {
    const user = userEvent.setup()
    renderTemporaryShelterPage()

    await user.click(screen.getByRole('button', { name: /전체 후보 보기/ }))

    expect(screen.getByText('전체 임시쉼터 후보 목록은 데모 준비 중입니다.')).toBeInTheDocument()
  })

  it('renders from the alias route', () => {
    renderTemporaryShelterPage('/admin/temporary-shelter-candidates')

    expect(screen.getByRole('heading', { name: '임시쉼터 후보 관리' })).toBeInTheDocument()
    expect(screen.getByTestId('current-path')).toHaveTextContent(
      '/admin/temporary-shelter-candidates',
    )
  })
})
