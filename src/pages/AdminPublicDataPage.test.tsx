import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AdminPublicDataPage } from '@/pages/AdminPublicDataPage'

const renderAdminPublicDataPage = () =>
  render(
    <MemoryRouter initialEntries={['/admin/data-status']}>
      <AdminPublicDataPage />
    </MemoryRouter>,
  )

describe('AdminPublicDataPage', () => {
  it('renders the title, subtitle, active sidebar item, and top actions', () => {
    renderAdminPublicDataPage()

    expect(screen.getByRole('heading', { name: '공공데이터 관리' })).toBeInTheDocument()
    expect(screen.getByText('연계 데이터 수집·갱신·품질 상태 관리')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '공공데이터 관리' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByRole('button', { name: /수집 점검/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /오류 로그 보기/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /데이터 새로고침/ })).toBeInTheDocument()
  })

  it('renders summary cards and filter toolbar controls', () => {
    renderAdminPublicDataPage()

    ;['8개', '7개', '1개', '92점'].forEach((value) => {
      expect(screen.getByText(value)).toBeInTheDocument()
    })
    expect(screen.getByLabelText('데이터 유형')).toHaveDisplayValue('전체')
    expect(screen.getByLabelText('상태')).toHaveDisplayValue('전체')
    expect(screen.getByLabelText('갱신주기')).toHaveDisplayValue('전체')
    expect(screen.getByLabelText('데이터명 검색')).toHaveAttribute(
      'placeholder',
      '데이터명 검색',
    )
  })

  it('renders every dataset row and status badge', () => {
    renderAdminPublicDataPage()

    ;[
      '기상/기온',
      '미세먼지',
      '안개',
      '쉼터 정보',
      'SafeWay 처리 분석 데이터',
      'CCTV 정보',
      '버스정류장',
      '가로등 정보',
      '보행환경 데이터',
    ].forEach((datasetName) => {
      expect(screen.getByText(datasetName)).toBeInTheDocument()
    })
    expect(screen.getAllByText('정상').length).toBeGreaterThan(0)
    expect(screen.getByText('쉼터 500개 · 추천 54건 · 시나리오 3개')).toBeInTheDocument()
    expect(screen.getAllByText('지연 수집').length).toBeGreaterThan(0)
    expect(screen.getAllByText('점검 필요').length).toBeGreaterThan(0)
  })

  it('renders quality metrics and recent alert logs', () => {
    renderAdminPublicDataPage()

    expect(screen.getByRole('heading', { name: /품질 요약/ })).toBeInTheDocument()
    expect(screen.getByText('완전성 (Completeness)')).toBeInTheDocument()
    expect(screen.getByText('95%')).toBeInTheDocument()
    expect(screen.getByText('정확성 (Accuracy)')).toBeInTheDocument()
    expect(screen.getByText('91%')).toBeInTheDocument()
    expect(screen.getByText('적시성 (Timeliness)')).toBeInTheDocument()
    expect(screen.getByText('90%')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '최근 알림 로그' })).toBeInTheDocument()
    expect(screen.getByText('CCTV 정보 데이터 수집 지연')).toBeInTheDocument()
    expect(screen.getByText('보행환경 데이터 품질 점검 필요')).toBeInTheDocument()
    expect(screen.getByText('미세먼지 데이터 정상 수집')).toBeInTheDocument()
    expect(screen.getByText('기상/기온 데이터 정상 수집')).toBeInTheDocument()
  })

  it('filters dataset rows locally by search term', async () => {
    const user = userEvent.setup()
    renderAdminPublicDataPage()

    await user.type(screen.getByLabelText('데이터명 검색'), 'CCTV')

    const table = screen.getByRole('table', {
      name: '공공데이터 연계 데이터셋 수집 상태 목록',
    })
    expect(within(table).getByText('CCTV 정보')).toBeInTheDocument()
    expect(within(table).queryByText('기상/기온')).not.toBeInTheDocument()
  })

  it('shows demo feedback for top actions and alert log navigation', async () => {
    const user = userEvent.setup()
    renderAdminPublicDataPage()

    await user.click(screen.getByRole('button', { name: /수집 점검/ }))
    expect(screen.getByRole('status')).toHaveTextContent(
      '공공데이터 수집 점검을 시작했습니다.',
    )

    await user.click(screen.getByRole('button', { name: /오류 로그 보기/ }))
    expect(screen.getByRole('status')).toHaveTextContent(
      '오류 로그 화면은 데모 준비 중입니다.',
    )

    await user.click(screen.getByRole('button', { name: /데이터 새로고침/ }))
    expect(screen.getByRole('status')).toHaveTextContent(
      '공공데이터 상태가 새로고침되었습니다.',
    )

    await user.click(screen.getByRole('button', { name: /전체보기/ }))
    expect(screen.getByRole('status')).toHaveTextContent(
      '전체 알림 로그 화면은 데모 준비 중입니다.',
    )
  })
})
