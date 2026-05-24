import { Link, useLocation } from 'react-router-dom'
import {
  Database,
  FileText,
  Home,
  Map,
  MapPinned,
  MessagesSquare,
  Route,
  Settings,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import styles from '@/pages/AdminDashboardPage.module.css'

type AdminMenuItem = {
  icon: LucideIcon
  label: string
  to: string
  aliases?: string[]
}

const adminMenuItems: AdminMenuItem[] = [
  { icon: Home, label: '대시보드', to: '/admin' },
  { icon: MapPinned, label: '기후위험 지도', to: '/admin/climate-risk-map', aliases: ['/admin/climate-risk'] },
  { icon: Map, label: '쉼터 사각지대', to: '/admin/shelter-gaps' },
  { icon: Route, label: '추천 로그', to: '/admin/recommendation-logs' },
  {
    icon: MessagesSquare,
    label: '피드백 분석',
    to: '/admin/feedback',
    aliases: ['/admin/feedback-analysis'],
  },
  { icon: Database, label: '공공데이터 관리', to: '/admin/data-status' },
  { icon: FileText, label: '리포트', to: '/admin/reports' },
  { icon: Settings, label: '설정', to: '/admin/settings' },
]

export function AdminSidebar() {
  const location = useLocation()

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.sideMenu} aria-label="관리자 메뉴">
        {adminMenuItems.map((item) => {
          const Icon = item.icon
          const isActive =
            item.to === '/admin'
              ? location.pathname === '/admin'
              : location.pathname === item.to ||
                location.pathname.startsWith(`${item.to}/`) ||
                Boolean(item.aliases?.some((alias) => location.pathname.startsWith(alias)))

          return (
            <Link
              key={item.label}
              to={item.to}
              className={isActive ? styles.activeMenuItem : styles.menuItem}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={20} strokeWidth={2.1} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className={styles.sidebarBottom}>
        <div className={styles.cityCard}>
          <div className={styles.cityLogoMark} aria-hidden="true" />
          <strong>세종특별자치시</strong>
          <p>AI 기반안전 도시, 세종</p>
        </div>
      </div>
    </aside>
  )
}
