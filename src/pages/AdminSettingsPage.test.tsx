import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AdminSettingsPage } from '@/pages/AdminSettingsPage'

const renderAdminSettings = () =>
  render(
    <MemoryRouter initialEntries={['/admin/settings']}>
      <AdminSettingsPage />
    </MemoryRouter>,
  )

describe('AdminSettingsPage', () => {
  it('renders the settings layout and default recommendation weights', () => {
    renderAdminSettings()

    expect(screen.getByRole('heading', { name: '설정' })).toBeInTheDocument()
    expect(screen.getByText('추천 가중치와 관리자 운영 기준 설정')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /위험도 가중치 설정/ })).toBeInTheDocument()
    expect(screen.getByRole('slider', { name: '폭염 위험 가중치' })).toHaveValue('30')
    expect(screen.getByRole('slider', { name: '미세먼지 가중치' })).toHaveValue('25')
    expect(screen.getByText(/총합계/)).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('renders admin account and notification setting panels', () => {
    renderAdminSettings()

    expect(screen.getByRole('heading', { name: /관리자 계정 관리/ })).toBeInTheDocument()
    expect(screen.getByText('김세종')).toBeInTheDocument()
    expect(screen.getByText('시스템 관리자')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /알림 기준 설정/ })).toBeInTheDocument()
    expect(screen.getByRole('switch', { name: '위험 단계 상승 알림' })).toBeChecked()
    expect(screen.getByRole('switch', { name: '데이터 수집 오류 알림' })).toBeChecked()
    expect(screen.getByRole('button', { name: '설정 저장' })).toBeInTheDocument()
  })

  it('keeps the full admin menu visible for the settings screen', () => {
    renderAdminSettings()

    expect(screen.getByRole('link', { name: '설정' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: '임시쉼터 후보' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '로그아웃' })).not.toBeInTheDocument()
  })

  it('saves settings with fixture fallback when the backend is unavailable', async () => {
    const user = userEvent.setup()
    renderAdminSettings()

    await user.click(screen.getByRole('button', { name: '설정 저장' }))

    expect(await screen.findByRole('status')).toHaveTextContent('설정이 저장되었습니다.')
  })
})
