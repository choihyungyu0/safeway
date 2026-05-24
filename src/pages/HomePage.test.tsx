import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { HomePage } from '@/pages/HomePage'

const renderHome = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user-type" element={<div>user type route</div>} />
        <Route path="/recommendations" element={<div>recommendations route</div>} />
      </Routes>
    </MemoryRouter>,
  )

describe('HomePage', () => {
  it('renders the service title', () => {
    renderHome()

    expect(screen.getAllByText('세종 세이프웨이').length).toBeGreaterThan(0)
  })

  it('renders route search fields', () => {
    renderHome()

    expect(screen.getByLabelText('출발지')).toBeInTheDocument()
    expect(screen.getByLabelText('목적지')).toBeInTheDocument()
    expect(screen.getByLabelText('출발일시')).toBeInTheDocument()
    expect(screen.getByLabelText('사용자 유형')).toBeInTheDocument()
  })

  it('renders the CTA button', () => {
    renderHome()

    expect(screen.getByRole('button', { name: 'AI 추천 경로 받기' })).toBeInTheDocument()
  })

  it('renders quick action images with accessible alt text', () => {
    renderHome()

    expect(screen.getByAltText('추천 경로 보기 아이콘')).toBeInTheDocument()
    expect(screen.getByAltText('지도에서 찾기 아이콘')).toBeInTheDocument()
    expect(screen.getByAltText('내 주변 쉼터 아이콘')).toBeInTheDocument()
    expect(screen.getByAltText('기상·위험 정보 아이콘')).toBeInTheDocument()
  })

  it('navigates to user type selection when clicking the CTA', async () => {
    const user = userEvent.setup()
    renderHome()

    await user.click(screen.getByRole('button', { name: 'AI 추천 경로 받기' }))

    expect(screen.getByText('user type route')).toBeInTheDocument()
  })
})
