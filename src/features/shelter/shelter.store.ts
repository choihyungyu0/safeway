import { create } from 'zustand'

export const ADDED_SHELTERS_SESSION_KEY = 'safeway-added-shelters'
export const FOCUSED_SHELTER_SESSION_KEY = 'safeway-focused-shelter-id'

type ShelterRouteStore = {
  addedShelterIds: string[]
  focusedShelterId: string | null
  addShelterToRoute: (shelterId: string) => void
  removeShelterFromRoute: (shelterId: string) => void
  isShelterAdded: (shelterId: string) => boolean
  focusShelterOnMap: (shelterId: string) => void
  syncShelterRouteState: () => void
}

const canUseSessionStorage = () => typeof window !== 'undefined' && Boolean(window.sessionStorage)

const readStringArray = (key: string): string[] => {
  if (!canUseSessionStorage()) {
    return []
  }

  try {
    const parsed: unknown = JSON.parse(window.sessionStorage.getItem(key) ?? '[]')

    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === 'string')
      : []
  } catch {
    return []
  }
}

const readFocusedShelterId = () => {
  if (!canUseSessionStorage()) {
    return null
  }

  return window.sessionStorage.getItem(FOCUSED_SHELTER_SESSION_KEY)
}

const writeAddedShelterIds = (shelterIds: string[]) => {
  if (!canUseSessionStorage()) {
    return
  }

  window.sessionStorage.setItem(ADDED_SHELTERS_SESSION_KEY, JSON.stringify(shelterIds))
}

const writeFocusedShelterId = (shelterId: string) => {
  if (!canUseSessionStorage()) {
    return
  }

  window.sessionStorage.setItem(FOCUSED_SHELTER_SESSION_KEY, shelterId)
}

export const useShelterRouteStore = create<ShelterRouteStore>((set, get) => ({
  addedShelterIds: readStringArray(ADDED_SHELTERS_SESSION_KEY),
  focusedShelterId: readFocusedShelterId(),
  addShelterToRoute: (shelterId) => {
    const nextShelterIds = Array.from(new Set([...get().addedShelterIds, shelterId]))

    writeAddedShelterIds(nextShelterIds)
    set({ addedShelterIds: nextShelterIds })
  },
  removeShelterFromRoute: (shelterId) => {
    const nextShelterIds = get().addedShelterIds.filter((id) => id !== shelterId)

    writeAddedShelterIds(nextShelterIds)
    set({ addedShelterIds: nextShelterIds })
  },
  isShelterAdded: (shelterId) => get().addedShelterIds.includes(shelterId),
  focusShelterOnMap: (shelterId) => {
    writeFocusedShelterId(shelterId)
    set({ focusedShelterId: shelterId })
  },
  syncShelterRouteState: () => {
    set({
      addedShelterIds: readStringArray(ADDED_SHELTERS_SESSION_KEY),
      focusedShelterId: readFocusedShelterId(),
    })
  },
}))
