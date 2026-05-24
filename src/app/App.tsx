import { Outlet } from 'react-router-dom'
import { HomeHeader } from '@/features/home/components/HomeHeader'

export function App() {
  return (
    <div className="app-shell">
      <HomeHeader />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
