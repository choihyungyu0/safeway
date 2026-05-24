import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { App } from '@/app/App'
import {
  ADDED_SHELTERS_SESSION_KEY,
  FOCUSED_SHELTER_SESSION_KEY,
  useShelterRouteStore,
} from '@/features/shelter/shelter.store'
import { ShelterDetailPage } from '@/pages/ShelterDetailPage'

const renderShelterDetailPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/shelters/shelter-001']}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="shelters/:shelterId" element={<ShelterDetailPage />} />
            <Route path="map" element={<div>map route</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('ShelterDetailPage', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    useShelterRouteStore.setState({
      addedShelterIds: [],
      focusedShelterId: null,
    })
  })

  it('renders the global header with the shelter nav item active', async () => {
    renderShelterDetailPage()

    await screen.findByRole('heading', { name: '나성동 복합커뮤니티센터 쉼터' })
    const mainNav = screen.getByRole('navigation', { name: '주요 메뉴' })

    expect(within(mainNav).getByRole('link', { name: '쉼터' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('renders the breadcrumb trail', async () => {
    renderShelterDetailPage()

    await screen.findByRole('heading', { name: '나성동 복합커뮤니티센터 쉼터' })
    const breadcrumb = screen.getByRole('navigation', { name: 'breadcrumb' })

    expect(within(breadcrumb).getByText('홈')).toBeInTheDocument()
    expect(within(breadcrumb).getByText('쉼터')).toBeInTheDocument()
    expect(within(breadcrumb).getByText('쉼터 상세')).toBeInTheDocument()
  })

  it('renders the shelter identity, badges, address, and local image path', async () => {
    renderShelterDetailPage()

    expect(
      await screen.findByRole('heading', { name: '나성동 복합커뮤니티센터 쉼터' }),
    ).toBeInTheDocument()
    expect(screen.getByText('실내 쉼터')).toBeInTheDocument()
    expect(screen.getByText('운영중')).toBeInTheDocument()
    expect(screen.getByText('세종특별자치시 나성로 33')).toBeInTheDocument()
    expect(screen.getByAltText('나성동 복합커뮤니티센터 쉼터 외관')).toHaveAttribute(
      'src',
      '/assets/shelters/shelter-naseong-community-center.png',
    )
  })

  it('renders the status panel values', async () => {
    renderShelterDetailPage()

    await screen.findByRole('heading', { name: '나성동 복합커뮤니티센터 쉼터' })

    expect(screen.getByText('09:00 ~ 18:00')).toBeInTheDocument()
    expect(screen.getByText('120명')).toBeInTheDocument()
    expect(screen.getByText('여유로움')).toBeInTheDocument()
    expect(screen.getByText('450m (6분)')).toBeInTheDocument()
  })

  it('renders facility labels in the expected order', async () => {
    renderShelterDetailPage()

    await screen.findByRole('heading', { name: '나성동 복합커뮤니티센터 쉼터' })
    const facilitySection = screen.getByRole('region', { name: '주요 편의시설' })

    expect(within(facilitySection).getByText('냉방')).toBeInTheDocument()
    expect(within(facilitySection).getByText('의자')).toBeInTheDocument()
    expect(within(facilitySection).getByText('정수기')).toBeInTheDocument()
    expect(within(facilitySection).getByText('화장실')).toBeInTheDocument()
    expect(within(facilitySection).getByText('와이파이')).toBeInTheDocument()
    expect(within(facilitySection).getByText('AED')).toBeInTheDocument()
  })

  it('persists the shelter ID when adding it to the route', async () => {
    const user = userEvent.setup()
    renderShelterDetailPage()

    await screen.findByRole('heading', { name: '나성동 복합커뮤니티센터 쉼터' })
    await user.click(screen.getByRole('button', { name: '경로에 추가' }))

    expect(window.sessionStorage.getItem(ADDED_SHELTERS_SESSION_KEY)).toBe(
      JSON.stringify(['shelter-001']),
    )
    expect(screen.getByRole('status')).toHaveTextContent(
      '쉼터가 경로에 추가되었습니다.',
    )
    expect(screen.getByRole('button', { name: '경로에 추가됨' })).toBeInTheDocument()
  })

  it('stores the focused shelter ID and navigates to the map', async () => {
    const user = userEvent.setup()
    renderShelterDetailPage()

    await screen.findByRole('heading', { name: '나성동 복합커뮤니티센터 쉼터' })
    await user.click(screen.getByRole('button', { name: '지도에서 보기' }))

    expect(window.sessionStorage.getItem(FOCUSED_SHELTER_SESSION_KEY)).toBe(
      'shelter-001',
    )
    expect(screen.getByText('map route')).toBeInTheDocument()
  })
})
