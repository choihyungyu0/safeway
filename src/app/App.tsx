import { Outlet, useLocation } from 'react-router-dom'
import { HomeHeader } from '@/features/home/components/HomeHeader'

export function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className={isAdminRoute ? 'app-shell app-shell--admin' : 'app-shell'}>
      {isAdminRoute ? null : <HomeHeader />}
      <main className={isAdminRoute ? 'app-main app-main--admin' : 'app-main'}>
        <Outlet />
      </main>
    </div>
  )
}
