import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { App } from '@/app/App'
import {
  defaultSearchParams,
  useRouteSearchStore,
} from '@/features/route-search/routeSearchStore'
import { MapPage } from '@/pages/MapPage'

const renderMapPage = () =>
  render(
    <MemoryRouter initialEntries={['/map']}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="map" element={<MapPage />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )

describe('MapPage', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    useRouteSearchStore.setState({
      searchParams: defaultSearchParams,
      userType: 'GENERAL',
      selectedRecommendationId: 'safeway-route',
    })
  })

  it('renders the active map navigation item', () => {
    renderMapPage()

    expect(screen.getByRole('link', { name: '지도 보기' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('renders the route search bar controls', () => {
    renderMapPage()

    expect(screen.getByLabelText('출발지')).toBeInTheDocument()
    expect(screen.getByLabelText('목적지')).toBeInTheDocument()
    expect(screen.getByLabelText('이동수단')).toBeInTheDocument()
    expect(screen.getByLabelText('출발일시')).toBeInTheDocument()
    expect(screen.getByLabelText('사용자 유형')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '다시 검색' })).toBeInTheDocument()
  })

  it('renders an empty map mount area without fake route labels', () => {
    renderMapPage()

    const mapMountArea = screen.getByTestId('map-mount-area')

    expect(mapMountArea).toBeInTheDocument()
    expect(mapMountArea).toHaveAccessibleName('지도 표시 영역')
    expect(within(mapMountArea).queryByText('출발')).not.toBeInTheDocument()
    expect(within(mapMountArea).queryByText('도착')).not.toBeInTheDocument()
  })

  it('renders the recommendation summary metrics and analysis rows', () => {
    renderMapPage()

    expect(screen.getByRole('heading', { name: '세이프웨이 추천' })).toBeInTheDocument()
    expect(screen.getByText('32분')).toBeInTheDocument()
    expect(screen.getByText('3개')).toBeInTheDocument()
    expect(screen.getByText('62%')).toBeInTheDocument()
    expect(screen.getByText('92점')).toBeInTheDocument()
    expect(screen.getByText('쉼터 접근성')).toBeInTheDocument()
    expect(screen.getAllByText('외부 노출 감소')).toHaveLength(2)
    expect(screen.getByText('야간 안전성')).toBeInTheDocument()
    expect(screen.getByText('기후·폭염 위험')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '실제 쉼터 상위 후보' })).toBeInTheDocument()
    expect(screen.getByText('한솔동복합커뮤니티센터 정음관')).toBeInTheDocument()
  })

  it('shows mock navigation and route detail feedback', async () => {
    const user = userEvent.setup()
    renderMapPage()

    expect(screen.getByRole('button', { name: '상세 경로 정보' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '경로 안내 시작' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '경로 안내 시작' }))
    expect(screen.getByText('경로 안내를 시작합니다.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '상세 경로 정보' }))
    expect(screen.getByText('정부세종청사 1동 출발')).toBeInTheDocument()
    expect(screen.getByText('그늘길 우선 구간 통과')).toBeInTheDocument()
    expect(screen.getByText('쉼터 3개소 경유')).toBeInTheDocument()
    expect(screen.getByText('세종특별자치시청 도착')).toBeInTheDocument()
  })
})
