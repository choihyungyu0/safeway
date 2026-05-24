import { NavLink, Outlet } from 'react-router-dom'
import { Activity, BarChart3, Map, MessageSquare, Route, ShieldCheck } from 'lucide-react'

const navItems = [
  { to: '/', label: '경로 검색', icon: Route },
  { to: '/recommendations', label: '추천 결과', icon: ShieldCheck },
  { to: '/map', label: '지도', icon: Map },
  { to: '/feedback/log-safeway-001', label: '피드백', icon: MessageSquare },
  { to: '/admin', label: '관리', icon: BarChart3 },
]

export function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <NavLink to="/" className="brand" aria-label="세종 세이프웨이 홈">
          <span className="brand-mark">
            <Activity size={20} />
          </span>
          <span>
            <strong>세종 세이프웨이</strong>
            <small>AI 기후안전 경로 추천</small>
          </span>
        </NavLink>
        <nav className="site-nav" aria-label="주요 메뉴">
          {navItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink key={item.to} to={item.to} className="site-nav__link">
                <Icon size={17} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
