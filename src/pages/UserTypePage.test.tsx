import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import {
  defaultSearchParams,
  USER_TYPE_SESSION_KEY,
  useRouteSearchStore,
} from '@/features/route-search/routeSearchStore'
import { UserTypePage } from '@/pages/UserTypePage'

const renderUserTypePage = () =>
  render(
    <MemoryRouter initialEntries={['/user-type']}>
      <Routes>
        <Route path="/user-type" element={<UserTypePage />} />
        <Route path="/recommendations" element={<div>recommendations route</div>} />
      </Routes>
    </MemoryRouter>,
  )

describe('UserTypePage', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    useRouteSearchStore.setState({
      searchParams: defaultSearchParams,
      userType: 'GENERAL',
      selectedRecommendationId: 'safeway-route',
    })
  })

  it('renders the user type selection heading', () => {
    renderUserTypePage()

    expect(screen.getByRole('heading', { name: '사용자 유형 선택' })).toBeInTheDocument()
  })

  it('renders all six user type labels', () => {
    renderUserTypePage()

    expect(screen.getByText('일반 성인')).toBeInTheDocument()
    expect(screen.getByText('고령자')).toBeInTheDocument()
    expect(screen.getByText('아동/청소년')).toBeInTheDocument()
    expect(screen.getByText('임산부')).toBeInTheDocument()
    expect(screen.getByText('장애인')).toBeInTheDocument()
    expect(screen.getByText('야외근로자')).toBeInTheDocument()
  })

  it('selects general by default', () => {
    renderUserTypePage()

    expect(screen.getByRole('button', { name: /일반 성인/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('updates selected state when clicking senior', async () => {
    const user = userEvent.setup()
    renderUserTypePage()

    await user.click(screen.getByRole('button', { name: /고령자/ }))

    expect(screen.getByRole('button', { name: /고령자/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: /일반 성인/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('saves general when skipping', async () => {
    const user = userEvent.setup()
    renderUserTypePage()

    await user.click(screen.getByRole('button', { name: '건너뛰기' }))

    expect(window.sessionStorage.getItem(USER_TYPE_SESSION_KEY)).toBe('GENERAL')
    expect(screen.getByText('recommendations route')).toBeInTheDocument()
  })

  it('persists the selected user type when continuing', async () => {
    const user = userEvent.setup()
    renderUserTypePage()

    await user.click(screen.getByRole('button', { name: /고령자/ }))
    await user.click(screen.getByRole('button', { name: '다음' }))

    expect(window.sessionStorage.getItem(USER_TYPE_SESSION_KEY)).toBe('SENIOR')
    expect(screen.getByText('recommendations route')).toBeInTheDocument()
  })

  it('renders local icon images with meaningful alt text', () => {
    renderUserTypePage()

    expect(screen.getByAltText('일반 성인 사용자 아이콘')).toHaveAttribute(
      'src',
      '/assets/user-type/icon-general.png',
    )
    expect(screen.getByAltText('고령자 사용자 아이콘')).toHaveAttribute(
      'src',
      '/assets/user-type/icon-senior.png',
    )
    expect(screen.getByAltText('아동 및 청소년 사용자 아이콘')).toHaveAttribute(
      'src',
      '/assets/user-type/icon-child.png',
    )
    expect(screen.getByAltText('임산부 사용자 아이콘')).toHaveAttribute(
      'src',
      '/assets/user-type/icon-pregnant.png',
    )
    expect(screen.getByAltText('장애인 사용자 아이콘')).toHaveAttribute(
      'src',
      '/assets/user-type/icon-disabled.png',
    )
    expect(screen.getByAltText('야외근로자 사용자 아이콘')).toHaveAttribute(
      'src',
      '/assets/user-type/icon-outdoor-worker.png',
    )
  })
})
