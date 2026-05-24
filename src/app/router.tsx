import { createBrowserRouter } from 'react-router-dom'
import { App } from '@/app/App'
import { AdminClimateRiskMapPage } from '@/pages/AdminClimateRiskMapPage'
import { AdminDashboardPage } from '@/pages/AdminDashboardPage'
import { AdminFeedbackPage } from '@/pages/AdminFeedbackPage'
import { AdminPublicDataPage } from '@/pages/AdminPublicDataPage'
import { AdminRecommendationLogPage } from '@/pages/AdminRecommendationLogPage'
import { AdminReportPage } from '@/pages/AdminReportPage'
import { AdminShelterGapPage } from '@/pages/AdminShelterGapPage'
import { AdminTemporaryShelterPage } from '@/pages/AdminTemporaryShelterPage'
import { FeedbackPage } from '@/pages/FeedbackPage'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { MapPage } from '@/pages/MapPage'
import { RecommendationPage } from '@/pages/RecommendationPage'
import { ShelterDetailPage } from '@/pages/ShelterDetailPage'
import { SignUpPage } from '@/pages/SignUpPage'
import { UserTypePage } from '@/pages/UserTypePage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignUpPage /> },
      { path: 'user-type', element: <UserTypePage /> },
      { path: 'recommendations', element: <RecommendationPage /> },
      { path: 'map', element: <MapPage /> },
      { path: 'shelters/:shelterId', element: <ShelterDetailPage /> },
      { path: 'feedback/:routeLogId', element: <FeedbackPage /> },
      { path: 'admin', element: <AdminDashboardPage /> },
      { path: 'admin/climate-risk-map', element: <AdminClimateRiskMapPage /> },
      { path: 'admin/climate-risk', element: <AdminClimateRiskMapPage /> },
      { path: 'admin/climate-impact', element: <AdminClimateRiskMapPage /> },
      { path: 'admin/shelter-gaps', element: <AdminShelterGapPage /> },
      { path: 'admin/temporary-shelters', element: <AdminTemporaryShelterPage /> },
      {
        path: 'admin/temporary-shelter-candidates',
        element: <AdminTemporaryShelterPage />,
      },
      { path: 'admin/recommendation-logs', element: <AdminRecommendationLogPage /> },
      { path: 'admin/recommendations/logs', element: <AdminRecommendationLogPage /> },
      { path: 'admin/recommendation-analysis', element: <AdminRecommendationLogPage /> },
      { path: 'admin/feedback', element: <AdminFeedbackPage /> },
      { path: 'admin/feedback-analysis', element: <AdminFeedbackPage /> },
      { path: 'admin/data-status', element: <AdminPublicDataPage /> },
      { path: 'admin/public-data', element: <AdminPublicDataPage /> },
      { path: 'admin/data-collection', element: <AdminPublicDataPage /> },
      { path: 'admin/data-quality', element: <AdminPublicDataPage /> },
      { path: 'admin/reports', element: <AdminReportPage /> },
    ],
  },
])
