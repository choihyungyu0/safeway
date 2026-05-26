import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { App } from '@/app/App'
import { ShelterListPage } from '@/pages/ShelterListPage'

const renderShelterListPage = () =>
  render(
    <MemoryRouter initialEntries={['/shelters']}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="shelters" element={<ShelterListPage />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )

describe('ShelterListPage', () => {
  it('renders SafeWay shelter data summary and active navigation', () => {
    renderShelterListPage()

    expect(screen.getByRole('heading', { name: '세종 무더위쉼터 탐색' })).toBeInTheDocument()
    expect(screen.getByText('SafeWay 처리 데이터 500개')).toBeInTheDocument()
    expect(screen.getByText('전체 쉼터')).toBeInTheDocument()
    expect(screen.getByText('500개')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '쉼터' })).toHaveAttribute('aria-current', 'page')
  })

  it('filters generated shelters by keyword and links to generated detail pages', async () => {
    const user = userEvent.setup()
    renderShelterListPage()

    await user.type(screen.getByLabelText('쉼터명·주소 검색'), '도담')

    expect(await screen.findByText('도담 방축천변 교량하부')).toBeInTheDocument()
    expect(screen.getByText('세종특별자치시 양지길 16')).toBeInTheDocument()

    const targetCard = screen.getByText('도담 방축천변 교량하부').closest('article')

    expect(within(targetCard as HTMLElement).getByRole('link', { name: '상세 보기' })).toHaveAttribute(
      'href',
      '/shelters/safeway-shelter-001',
    )
  })

  it('applies operation filters without leaving the real dataset', async () => {
    const user = userEvent.setup()
    renderShelterListPage()

    await user.click(screen.getByLabelText('야간개방'))
    await user.click(screen.getByLabelText('휴일개방'))

    expect(screen.getByText(/쉼터 .*개 검색됨/)).toBeInTheDocument()
    expect(screen.getAllByText('야간개방').length).toBeGreaterThan(0)
    expect(screen.getAllByText('휴일개방').length).toBeGreaterThan(0)
  })
})
