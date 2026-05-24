import { create } from 'zustand'
import type { HomeSearchValues } from '@/features/home/home.types'

type HomeSearchState = {
  values: HomeSearchValues
  setValues: (values: HomeSearchValues) => void
  updateValue: <Key extends keyof HomeSearchValues>(
    key: Key,
    value: HomeSearchValues[Key],
  ) => void
}

export const defaultHomeSearchValues: HomeSearchValues = {
  startPlace: '정부세종청사 1동',
  destination: '세종특별자치시청',
  departureAt: '2025.06.21 (토) 14:00',
  userType: 'GENERAL',
  userTypeLabel: '일반 성인',
  preference: 'COOL',
  preferenceLabel: '시원하고 안전한 길 우선',
  transportMode: 'WALK',
}

export const useHomeSearchStore = create<HomeSearchState>((set) => ({
  values: defaultHomeSearchValues,
  setValues: (values) => set({ values }),
  updateValue: (key, value) =>
    set((state) => ({
      values: {
        ...state.values,
        [key]: value,
      },
    })),
}))
