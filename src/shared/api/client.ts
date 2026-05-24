import axios from 'axios'

export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

export const apiEndpoints = {
  currentClimate: '/climate/current',
  placesSearch: '/places/search',
  shelters: '/shelters',
  recommendations: '/recommendations',
  feedback: '/feedback',
  adminDashboard: '/admin/dashboard',
  adminShelterGaps: '/admin/shelter-gaps',
  adminDataStatus: '/admin/data-status',
} as const
