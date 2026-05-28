import { fireEvent, render, screen, within } from '@testing-library/react'
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

  it('renders the route search controls', () => {
    renderMapPage()

    expect(
      screen.getByRole('button', { name: /출발지 정부세종청사 1동/ }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /목적지 세종특별자치시청/ }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('이동수단')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /출발일시 2025\.06\.21/ }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('사용자 유형')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '다시 검색' })).toBeInTheDocument()
  })

  it('opens place candidates and a mini departure calendar', async () => {
    const user = userEvent.setup()
    renderMapPage()

    await user.click(screen.getByRole('button', { name: /출발지 정부세종청사 1동/ }))
    expect(screen.getByRole('listbox', { name: '출발지 후보' })).toBeInTheDocument()

    await user.click(screen.getByRole('option', { name: /세종호수공원/ }))
    expect(
      screen.getByRole('button', { name: /출발지 세종호수공원/ }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /출발일시 2025\.06\.21/ }))
    expect(screen.getByRole('dialog', { name: '출발일시 선택' })).toBeInTheDocument()
    expect(screen.getByText('2025년 6월')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '22일 선택' }))
    expect(
      screen.getByRole('button', { name: /출발일시 2025\.06\.22/ }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '18:00' }))
    expect(
      screen.getByRole('button', { name: /출발일시 2025\.06\.22.*18:00/ }),
    ).toBeInTheDocument()
  })

  it('renders the route map and toggles safety layers', async () => {
    const user = userEvent.setup()
    renderMapPage()

    const routeMap = screen.getByTestId('route-map')
    const busLayerButton = screen.getByRole('button', { name: '버스정류장' })

    expect(routeMap).toBeInTheDocument()
    expect(routeMap).toHaveAccessibleName('세종 세이프웨이 Leaflet 지도')
    expect(within(routeMap).getByText('Leaflet / OpenStreetMap')).toBeInTheDocument()
    expect(await within(routeMap).findByText('출발')).toBeInTheDocument()
    expect(await within(routeMap).findByText('도착')).toBeInTheDocument()
    expect(await within(routeMap).findByText('나성동 BRT 정류장')).toBeInTheDocument()
    expect(busLayerButton).toHaveAttribute('aria-pressed', 'true')

    await user.click(busLayerButton)

    expect(busLayerButton).toHaveAttribute('aria-pressed', 'false')
    expect(within(routeMap).queryByText('나성동 BRT 정류장')).not.toBeInTheDocument()
  })

  it('shows short marker descriptions when map icons are clicked', async () => {
    renderMapPage()

    const routeMap = screen.getByTestId('route-map')

    fireEvent.click(await within(routeMap).findByTitle('나성동 BRT 정류장'))
    expect(await within(routeMap).findByText(/대중교통 대체 경로/)).toBeInTheDocument()

    fireEvent.click(await within(routeMap).findByTitle('도착 지점'))
    expect(await within(routeMap).findByText(/마지막 보행 구간/)).toBeInTheDocument()
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
    expect(screen.getByText(/500m 이내 쉼터 32개와 최종 기후안전/)).toBeInTheDocument()
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
