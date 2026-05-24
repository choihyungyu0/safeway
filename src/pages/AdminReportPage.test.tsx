import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AdminReportPage } from '@/pages/AdminReportPage'

const renderAdminReportPage = () =>
  render(
    <MemoryRouter initialEntries={['/admin/reports']}>
      <AdminReportPage />
    </MemoryRouter>,
  )

describe('AdminReportPage', () => {
  it('renders the page title, subtitle, active sidebar item, and settings', () => {
    renderAdminReportPage()

    expect(screen.getByRole('heading', { name: '분석 리포트', level: 1 })).toBeInTheDocument()
    expect(
      screen.getAllByText('세종시 기후안전 경로 및 쉼터 운영 분석 보고서').length,
    ).toBeGreaterThan(0)
    expect(screen.getByRole('link', { name: '리포트' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByRole('heading', { name: '리포트 설정' })).toBeInTheDocument()
    expect(screen.getByLabelText('기간')).toHaveDisplayValue('2025.06.01 ~ 2025.06.30')
    expect(screen.getByLabelText('지역')).toHaveDisplayValue('전체')
    expect(screen.getByLabelText('위험유형')).toHaveDisplayValue('전체')
    expect(screen.getByLabelText('사용자 유형')).toHaveDisplayValue('전체')
    expect(screen.getByLabelText('리포트 종류')).toHaveDisplayValue('종합 분석 리포트')
  })

  it('renders action buttons, preview cover, metrics, and summaries', () => {
    renderAdminReportPage()

    expect(screen.getByRole('button', { name: '미리보기' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'PDF 다운로드' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '엑셀 다운로드' })).toBeInTheDocument()

    expect(screen.getByRole('heading', { name: '리포트 미리보기' })).toBeInTheDocument()
    expect(screen.getByText('2025년 6월')).toBeInTheDocument()
    expect(screen.getByText('세종시 기후안전 운영 리포트')).toBeInTheDocument()
    expect(screen.getAllByText('핵심 요약').length).toBeGreaterThan(0)

    ;[
      '고위험 권역',
      '7개',
      '쉼터 사각지대',
      '12개',
      '임시쉼터 후보',
      '24개',
      '평균 만족도',
      '4.6 / 5',
      '기후위험 집중 지역',
      '쉼터 접근성 개선 우선순위',
      '시민 피드백 요약',
    ].forEach((text) => {
      expect(screen.getAllByText(text).length).toBeGreaterThan(0)
    })
  })

  it('renders feedback keywords, report chapters, and policy proposal', () => {
    renderAdminReportPage()

    ;['그늘', '쉼터', '가로등', '보행안전'].forEach((keyword) => {
      expect(screen.getAllByText(keyword).length).toBeGreaterThan(0)
    })

    ;[
      '운영 현황',
      '기후위험 지도',
      '쉼터 사각지대',
      '임시쉼터 후보',
      '추천 로그 분석',
      '사용자 피드백 분석',
      '정책 제안',
    ].forEach((chapter) => {
      expect(screen.getAllByText(chapter).length).toBeGreaterThan(0)
    })

    expect(screen.getByText('보람동-어진동 연결 보행축에')).toBeInTheDocument()
    expect(screen.getByText('그늘 및 쉼터 보강 필요')).toBeInTheDocument()
  })

  it('shows local demo messages for export actions and policy detail', async () => {
    const user = userEvent.setup()
    renderAdminReportPage()

    await user.click(screen.getByRole('button', { name: '미리보기' }))
    expect(screen.getByRole('status')).toHaveTextContent('리포트 미리보기를 갱신했습니다.')

    await user.click(screen.getByRole('button', { name: 'PDF 다운로드' }))
    expect(screen.getByRole('status')).toHaveTextContent('PDF 다운로드는 데모 준비 중입니다.')

    await user.click(screen.getByRole('button', { name: '엑셀 다운로드' }))
    expect(screen.getByRole('status')).toHaveTextContent('엑셀 다운로드는 데모 준비 중입니다.')

    await user.click(screen.getByRole('button', { name: /상세 제안 보기/ }))
    expect(screen.getByRole('status')).toHaveTextContent(
      '정책 제안 상세 화면은 데모 준비 중입니다.',
    )
  })

  it('updates the active preview thumbnail locally', async () => {
    const user = userEvent.setup()
    renderAdminReportPage()

    const secondPageButton = screen.getByRole('button', {
      name: '리포트 2페이지 미리보기',
    })

    expect(secondPageButton).toHaveAttribute('aria-pressed', 'false')
    await user.click(secondPageButton)
    expect(secondPageButton).toHaveAttribute('aria-pressed', 'true')
  })
})
