import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import {
  defaultSearchParams,
  SELECTED_RECOMMENDATION_SESSION_KEY,
  useRouteSearchStore,
} from '@/features/route-search/routeSearchStore'
import { RecommendationPage } from '@/pages/RecommendationPage'

const renderRecommendationPage = () =>
  render(
    <MemoryRouter initialEntries={['/recommendations']}>
      <Routes>
        <Route path="/recommendations" element={<RecommendationPage />} />
        <Route path="/map" element={<div>map route</div>} />
      </Routes>
    </MemoryRouter>,
  )

describe('RecommendationPage', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    useRouteSearchStore.setState({
      searchParams: defaultSearchParams,
      userType: 'GENERAL',
      selectedRecommendationId: 'safeway-route',
    })
  })

  it('renders the recommendation results hero', () => {
    renderRecommendationPage()

    expect(
      screen.getByRole('heading', { name: '세종 세이프웨이 AI 추천 결과' }),
    ).toBeInTheDocument()
  })

  it('renders the route summary bar values', () => {
    renderRecommendationPage()

    expect(screen.getByText('정부세종청사 1동')).toBeInTheDocument()
    expect(screen.getByText('세종특별자치시청')).toBeInTheDocument()
    expect(screen.getByText('2025.06.21 (토) 14:00')).toBeInTheDocument()
  })

  it('renders the three recommendation titles', () => {
    renderRecommendationPage()

    expect(screen.getByRole('heading', { name: '세이프웨이' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '대중교통 대체경로' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '야간 안전경로' })).toBeInTheDocument()
  })

  it('renders Safeway metrics and the recommended badge', () => {
    renderRecommendationPage()

    const safewayHeading = screen.getByRole('heading', { name: '세이프웨이' })
    const safewayCard = safewayHeading.closest('article')
    if (!safewayCard) {
      throw new Error('Safeway card was not rendered')
    }

    expect(within(safewayCard).getByText('32분')).toBeInTheDocument()
    expect(within(safewayCard).getByText('62%')).toBeInTheDocument()
    expect(within(safewayCard).getByText('3개소')).toBeInTheDocument()
    expect(within(safewayCard).getByText('92점')).toBeInTheDocument()
    expect(within(safewayCard).getByText('★ 추천')).toBeInTheDocument()
  })

  it('renders local route icon images with meaningful alt text', () => {
    renderRecommendationPage()

    expect(screen.getByAltText('세이프웨이 경로 아이콘')).toHaveAttribute(
      'src',
      '/assets/recommendations/icon-safeway.png',
    )
    expect(screen.getByAltText('대중교통 대체경로 아이콘')).toHaveAttribute(
      'src',
      '/assets/recommendations/icon-transit.png',
    )
    expect(screen.getByAltText('야간 안전경로 아이콘')).toHaveAttribute(
      'src',
      '/assets/recommendations/icon-night-safe.png',
    )
  })

  it('stores the selected route ID and navigates to the map', async () => {
    const user = userEvent.setup()
    renderRecommendationPage()

    const safewayHeading = screen.getByRole('heading', { name: '세이프웨이' })
    const safewayCard = safewayHeading.closest('article')
    if (!safewayCard) {
      throw new Error('Safeway card was not rendered')
    }

    await user.click(within(safewayCard).getByRole('button', { name: /상세 보기/ }))

    expect(useRouteSearchStore.getState().selectedRecommendationId).toBe('safeway-route')
    expect(window.sessionStorage.getItem(SELECTED_RECOMMENDATION_SESSION_KEY)).toBe(
      'safeway-route',
    )
    expect(screen.getByText('map route')).toBeInTheDocument()
  })

  it('reveals the score criteria explanation', async () => {
    const user = userEvent.setup()
    renderRecommendationPage()

    await user.click(screen.getByRole('button', { name: /점수 산정 기준 보기/ }))

    expect(screen.getByText('기온 및 체감온도')).toBeInTheDocument()
    expect(screen.getByText('미세먼지와 대기질')).toBeInTheDocument()
    expect(screen.getByText('야간 안전성')).toBeInTheDocument()
  })
})
