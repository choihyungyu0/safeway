import type { ScoreBreakdown } from '@/entities/route/types'
import type { UserType } from '@/entities/user/types'

export type ScoringWeights = Record<keyof ScoreBreakdown, number>

export const baseScoringWeights: ScoringWeights = {
  climateSafety: 0.3,
  outdoorExposureSafety: 0.2,
  shelterAccess: 0.2,
  greenAccess: 0.1,
  transitAccess: 0.1,
  nightSafety: 0.1,
}

const userTypeAdjustments: Record<UserType, Partial<ScoringWeights>> = {
  GENERAL: {},
  SENIOR: {
    shelterAccess: 0.1,
    outdoorExposureSafety: 0.08,
    greenAccess: -0.03,
  },
  CHILD: {
    nightSafety: 0.08,
    transitAccess: 0.06,
    shelterAccess: 0.04,
  },
  PREGNANT: {
    shelterAccess: 0.1,
    outdoorExposureSafety: 0.08,
    transitAccess: 0.02,
  },
  DISABLED: {
    transitAccess: 0.1,
    shelterAccess: 0.06,
    outdoorExposureSafety: 0.05,
  },
  OUTDOOR_WORKER: {
    climateSafety: 0.12,
    shelterAccess: 0.08,
    outdoorExposureSafety: 0.06,
  },
}

const scoreKeys = Object.keys(baseScoringWeights) as Array<keyof ScoreBreakdown>

export const clampScore = (score: number) => Math.min(100, Math.max(0, Math.round(score)))

export const normalizeWeights = (weights: ScoringWeights): ScoringWeights => {
  const total = scoreKeys.reduce((sum, key) => sum + weights[key], 0)

  return scoreKeys.reduce<ScoringWeights>(
    (normalized, key) => ({
      ...normalized,
      [key]: weights[key] / total,
    }),
    { ...baseScoringWeights },
  )
}

export const getAdjustedWeights = (userType: UserType): ScoringWeights => {
  const adjustment = userTypeAdjustments[userType]
  const adjustedWeights = scoreKeys.reduce<ScoringWeights>(
    (weights, key) => ({
      ...weights,
      [key]: Math.max(0.05, baseScoringWeights[key] + (adjustment[key] ?? 0)),
    }),
    { ...baseScoringWeights },
  )

  return normalizeWeights(adjustedWeights)
}

export const calculateSafetyScore = (
  breakdown: ScoreBreakdown,
  userType: UserType,
): number => {
  const weights = getAdjustedWeights(userType)
  const weightedScore = scoreKeys.reduce(
    (total, key) => total + clampScore(breakdown[key]) * weights[key],
    0,
  )

  return clampScore(weightedScore)
}
