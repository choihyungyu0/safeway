import { createBrowserRouter } from 'react-router-dom'
import { App } from '@/app/App'
import { AdminDashboardPage } from '@/pages/AdminDashboardPage'
import { AdminDataStatusPage } from '@/pages/AdminDataStatusPage'
import { AdminShelterGapPage } from '@/pages/AdminShelterGapPage'
import { FeedbackPage } from '@/pages/FeedbackPage'
import { HomePage } from '@/pages/HomePage'
import { MapPage } from '@/pages/MapPage'
import { RecommendationPage } from '@/pages/RecommendationPage'
import { ShelterDetailPage } from '@/pages/ShelterDetailPage'
import { UserTypePage } from '@/pages/UserTypePage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'user-type', element: <UserTypePage /> },
      { path: 'recommendations', element: <RecommendationPage /> },
      { path: 'map', element: <MapPage /> },
      { path: 'shelters/:shelterId', element: <ShelterDetailPage /> },
      { path: 'feedback/:routeLogId', element: <FeedbackPage /> },
      { path: 'admin', element: <AdminDashboardPage /> },
      { path: 'admin/shelter-gaps', element: <AdminShelterGapPage /> },
      { path: 'admin/data-status', element: <AdminDataStatusPage /> },
    ],
  },
])
