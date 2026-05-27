import { Link, useLocation } from 'react-router-dom'
import {
  Activity,
  Building2,
  ChevronLeft,
  ClipboardList,
  CloudSun,
  Database,
  FileText,
  Home,
  Landmark,
  Map,
  MapPinned,
  Megaphone,
  MessageSquare,
  Route,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import styles from '@/pages/AdminDashboardPage.module.css'

type AdminMenuItem = {
  icon: LucideIcon
  label: string
  to: string
  aliases?: string[]
}

type AdminSidebarProps = {
  variant?: 'compact' | 'management' | 'settings'
}

type AdminMenuGroup = {
  title?: string
  items: AdminMenuItem[]
}

const adminMenuItems: AdminMenuItem[] = [
  { icon: Home, label: '대시보드', to: '/admin' },
  {
    icon: MapPinned,
    label: '기후위험 지도',
    to: '/admin/climate-risk-map',
    aliases: ['/admin/climate-risk', '/admin/climate-impact'],
  },
  { icon: Map, label: '쉼터 사각지대', to: '/admin/shelter-gaps' },
  {
    icon: Building2,
    label: '임시쉼터 후보',
    to: '/admin/temporary-shelters',
    aliases: ['/admin/temporary-shelter-candidates'],
  },
  {
    icon: Route,
    label: '추천 로그',
    to: '/admin/recommendation-logs',
    aliases: ['/admin/recommendations/logs', '/admin/recommendation-analysis'],
  },
  {
    icon: MessageSquare,
    label: '피드백 분석',
    to: '/admin/feedback',
    aliases: ['/admin/feedback-analysis'],
  },
  {
    icon: Database,
    label: '공공데이터 관리',
    to: '/admin/data-status',
    aliases: ['/admin/public-data', '/admin/data-collection', '/admin/data-quality'],
  },
  { icon: FileText, label: '리포트', to: '/admin/reports' },
  { icon: Settings, label: '설정', to: '/admin/settings' },
]

const managementMenuGroups: AdminMenuGroup[] = [
  {
    items: [{ icon: Home, label: '대시보드', to: '/admin' }],
  },
  {
    title: '분석 · 모니터링',
    items: [
      { icon: MapPinned, label: '현황 모니터링', to: '/admin/monitoring' },
      { icon: Route, label: 'AI 추천 경로 분석', to: '/admin/recommendation-analysis' },
      { icon: Map, label: '쉼터 사각지대 분석', to: '/admin/shelter-gaps' },
      {
        icon: CloudSun,
        label: '이상기후 영향 분석',
        to: '/admin/climate-impact',
        aliases: ['/admin/climate-risk-map', '/admin/climate-risk'],
      },
    ],
  },
  {
    title: '시설 · 자원 관리',
    items: [
      { icon: Building2, label: '쉼터 관리', to: '/admin/shelters' },
      {
        icon: ShieldAlert,
        label: '임시쉼터 관리',
        to: '/admin/temporary-shelters',
        aliases: ['/admin/temporary-shelter-candidates'],
      },
      { icon: Landmark, label: '공공시설 관리', to: '/admin/public-facilities' },
    ],
  },
  {
    title: '데이터 관리',
    items: [
      { icon: Activity, label: '데이터 수집 현황', to: '/admin/data-collection' },
      { icon: ClipboardList, label: '데이터 품질 관리', to: '/admin/data-quality' },
      {
        icon: Database,
        label: '공공데이터 관리',
        to: '/admin/data-status',
        aliases: ['/admin/public-data'],
      },
    ],
  },
  {
    title: '알림 · 보고',
    items: [
      { icon: Megaphone, label: '알림 발송', to: '/admin/notifications' },
      { icon: FileText, label: '보고서 관리', to: '/admin/reports' },
    ],
  },
  {
    title: '시스템 관리',
    items: [
      { icon: Users, label: '사용자 관리', to: '/admin/users' },
      { icon: ShieldCheck, label: '권한 관리', to: '/admin/permissions' },
      { icon: Settings, label: '시스템 설정', to: '/admin/settings' },
    ],
  },
]

export function AdminSidebar({ variant = 'compact' }: AdminSidebarProps) {
  const location = useLocation()
  const menuGroups =
    variant === 'management'
      ? managementMenuGroups
      : [{ items: adminMenuItems }]
  const sidebarClassName = `${styles.sidebar} ${
    variant === 'management' ? styles.managementSidebar : styles.compactSidebar
  }`

  return (
    <aside className={sidebarClassName}>
      <nav className={styles.sideMenu} aria-label="관리자 메뉴">
        {menuGroups.map((group, groupIndex) => (
          <div className={styles.menuGroup} key={group.title ?? `admin-root-${groupIndex}`}>
            {group.title ? <p className={styles.groupTitle}>{group.title}</p> : null}

            {group.items.map((item) => {
              const Icon = item.icon
              const isActive = isMenuItemActive(location.pathname, item)

              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={isActive ? styles.activeMenuItem : styles.menuItem}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon size={19} strokeWidth={2.15} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div className={styles.sidebarBottom}>
        {variant === 'management' ? (
          <button type="button" className={styles.collapseButton}>
            <ChevronLeft size={18} strokeWidth={2.2} aria-hidden="true" />
            <ChevronLeft size={18} strokeWidth={2.2} aria-hidden="true" />
            메뉴 접기
          </button>
        ) : (
          <div className={styles.cityCard}>
            <div className={styles.cityLogoMark} aria-hidden="true" />
            <strong>세종특별자치시</strong>
            <p>AI 기반안전 도시, 세종</p>
          </div>
        )}
      </div>
    </aside>
  )
}

function isMenuItemActive(pathname: string, item: AdminMenuItem) {
  if (item.to === '/admin') {
    return pathname === '/admin'
  }

  return (
    pathname === item.to ||
    pathname.startsWith(`${item.to}/`) ||
    Boolean(item.aliases?.some((alias) => pathname === alias || pathname.startsWith(`${alias}/`)))
  )
}
