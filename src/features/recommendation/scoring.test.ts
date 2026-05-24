import { describe, expect, it } from 'vitest'
import type { ScoreBreakdown } from '@/entities/route/types'
import { calculateSafetyScore, getAdjustedWeights } from '@/features/recommendation/scoring'

const sampleBreakdown: ScoreBreakdown = {
  climateSafety: 120,
  outdoorExposureSafety: 84,
  shelterAccess: 91,
  greenAccess: 86,
  transitAccess: 73,
  nightSafety: 79,
}

describe('recommendation scoring', () => {
  it('returns a normalized safety score', () => {
    const score = calculateSafetyScore(sampleBreakdown, 'GENERAL')

    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(100)
  })

  it('changes weights by user type', () => {
    const generalWeights = getAdjustedWeights('GENERAL')
    const seniorWeights = getAdjustedWeights('SENIOR')

    expect(seniorWeights).not.toEqual(generalWeights)
    expect(seniorWeights.shelterAccess).toBeGreaterThan(generalWeights.shelterAccess)
  })
})
