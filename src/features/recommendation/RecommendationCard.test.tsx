import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import type { SafeRouteRecommendation } from '@/entities/route/types'
import { RecommendationCard } from '@/features/recommendation/RecommendationCard'
import { calculateSafetyScore } from '@/features/recommendation/scoring'
import { routeRecommendationTemplates } from '@/mocks/fixtures/routes'

const template = routeRecommendationTemplates[0]
const recommendation: SafeRouteRecommendation = {
  ...template,
  userType: 'GENERAL',
  climateSafetyScore: calculateSafetyScore(template.scoreBreakdown, 'GENERAL'),
}

describe('RecommendationCard', () => {
  it('renders duration, score, shelter count, and reason', () => {
    render(
      <MemoryRouter>
        <RecommendationCard recommendation={recommendation} />
      </MemoryRouter>,
    )

    expect(screen.getByText('31분')).toBeInTheDocument()
    expect(screen.getByText(`${recommendation.climateSafetyScore}`)).toBeInTheDocument()
    expect(screen.getByText('3곳')).toBeInTheDocument()
    expect(screen.getByText(recommendation.reason)).toBeInTheDocument()
  })
})
