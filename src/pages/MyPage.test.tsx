import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { App } from '@/app/App'
import {
  defaultSearchParams,
  useRouteSearchStore,
} from '@/features/route-search/routeSearchStore'
import { MyPage } from '@/pages/MyPage'

const renderMyPage = () =>
  render(
    <MemoryRouter initialEntries={['/mypage']}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="mypage" element={<MyPage />} />
          <Route path="user-type" element={<div>user type route</div>} />
          <Route path="login" element={<div>login route</div>} />
          <Route path="map" element={<div>map route</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )

describe('MyPage', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    useRouteSearchStore.setState({
      searchParams: defaultSearchParams,
      userType: 'GENERAL',
      selectedRecommendationId: 'safeway-route',
    })
  })

  it('renders the profile, settings, saved places, and active navigation', () => {
    renderMyPage()

    expect(screen.getAllByText('마이페이지').length).toBeGreaterThan(0)
    expect(screen.getByRole('heading', { name: '세종시민님' })).toBeInTheDocument()
    expect(screen.getByText('일반 성인')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '내 알림 설정' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '저장한 장소' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '최근 이용 경로' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '계정 관리' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '서비스 정보' })).toBeInTheDocument()
    const mainNav = screen.getByRole('navigation', { name: '주요 메뉴' })

    expect(within(mainNav).getByRole('link', { name: /마이페이지/ })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('toggles notification settings', async () => {
    const user = userEvent.setup()
    renderMyPage()

    const nightSwitch = screen.getByRole('switch', { name: '야간 안전 알림 켜기' })

    expect(nightSwitch).toHaveAttribute('aria-checked', 'false')

    await user.click(nightSwitch)

    expect(nightSwitch).toHaveAttribute('aria-checked', 'true')
  })

  it('navigates to user type selection from the profile card', async () => {
    const user = userEvent.setup()
    renderMyPage()

    await user.click(screen.getByRole('button', { name: '유형 변경' }))

    expect(screen.getByText('user type route')).toBeInTheDocument()
  })
})
