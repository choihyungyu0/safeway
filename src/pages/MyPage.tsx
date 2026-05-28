import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  Bell,
  ChevronRight,
  Clock3,
  FileText,
  Headphones,
  Info,
  LockKeyhole,
  LogOut,
  MapPin,
  MoonStar,
  ShieldCheck,
  Sparkles,
  Sun,
  UserCog,
  UserMinus,
  UserRound,
} from 'lucide-react'
import { useRouteSearchStore } from '@/features/route-search/routeSearchStore'
import { userTypeLabels } from '@/shared/constants/labels'
import styles from '@/pages/MyPage.module.css'

type NotificationId = 'climate' | 'route' | 'night'
type NotificationTone = 'climate' | 'route' | 'night'

type NotificationSetting = {
  id: NotificationId
  title: string
  description: string
  icon: LucideIcon
  tone: NotificationTone
}

type MenuItem = {
  label: string
  icon: LucideIcon
  tone?: 'default' | 'danger'
  onSelect?: () => void
}

const notificationSettings: NotificationSetting[] = [
  {
    id: 'climate',
    title: '기후위험 알림',
    description: '폭염, 폭우, 한파 등 기후 위험 알림',
    icon: Sun,
    tone: 'climate',
  },
  {
    id: 'route',
    title: '추천 경로 알림',
    description: 'AI 추천 경로 및 교통 상황 알림',
    icon: Sparkles,
    tone: 'route',
  },
  {
    id: 'night',
    title: '야간 안전 알림',
    description: '야간 안전 정보 및 주의 구간 알림',
    icon: MoonStar,
    tone: 'night',
  },
]

const savedPlaces = ['정부세종청사 1동', '세종호수공원', '나성동 중심상가']

const recentRoutes = [
  {
    id: 'route-government-cityhall',
    start: '정부세종청사 1동',
    end: '세종특별자치시청',
    usedAt: '오늘 14:00',
  },
  {
    id: 'route-school-lake',
    start: '세종고등학교',
    end: '세종호수공원',
    usedAt: '어제 17:30',
  },
]

const notificationIconClassNames: Record<NotificationTone, string> = {
  climate: styles.notificationIconClimate,
  route: styles.notificationIconRoute,
  night: styles.notificationIconNight,
}

function SettingsMenuGroup({
  title,
  icon: Icon,
  items,
}: {
  title: string
  icon: LucideIcon
  items: MenuItem[]
}) {
  const headingId = title === '계정 관리' ? 'account-menu-title' : 'service-menu-title'

  return (
    <section className={`${styles.card} ${styles.menuCard}`} aria-labelledby={headingId}>
      <div className={styles.sectionTitleRow}>
        <Icon size={28} aria-hidden="true" />
        <h2 id={headingId}>{title}</h2>
      </div>

      <div className={styles.menuList}>
        {items.map((item) => {
          const ItemIcon = item.icon

          return (
            <button
              key={item.label}
              type="button"
              className={
                item.tone === 'danger'
                  ? `${styles.menuButton} ${styles.menuButtonDanger}`
                  : styles.menuButton
              }
              onClick={item.onSelect}
            >
              <ItemIcon size={24} aria-hidden="true" />
              <span>{item.label}</span>
              <ChevronRight size={24} aria-hidden="true" />
            </button>
          )
        })}
      </div>
    </section>
  )
}

export function MyPage() {
  const navigate = useNavigate()
  const userType = useRouteSearchStore((state) => state.userType)
  const [notifications, setNotifications] = useState<Record<NotificationId, boolean>>({
    climate: true,
    route: true,
    night: false,
  })

  const accountItems: MenuItem[] = [
    { label: '비밀번호 변경', icon: LockKeyhole },
    { label: '로그아웃', icon: LogOut, onSelect: () => navigate('/login') },
    { label: '회원탈퇴', icon: UserMinus, tone: 'danger' },
  ]

  const serviceItems: MenuItem[] = [
    { label: '이용약관', icon: FileText },
    { label: '개인정보처리방침', icon: ShieldCheck },
    { label: '고객센터', icon: Headphones },
  ]

  const toggleNotification = (id: NotificationId) => {
    setNotifications((current) => ({
      ...current,
      [id]: !current[id],
    }))
  }

  return (
    <div className={styles.myPage}>
      <section className={styles.hero} aria-labelledby="mypage-title">
        <div className={styles.heroContent}>
          <p className={styles.kicker}>마이페이지</p>
          <h1 id="mypage-title">세종시민님</h1>
          <p>안전한 세종 이동을 위한 내 설정</p>
        </div>
      </section>

      <div className={styles.contentStack}>
        <section className={`${styles.card} ${styles.profileCard}`} aria-label="사용자 정보">
          <div className={styles.avatar} aria-hidden="true">
            <UserRound size={56} />
          </div>
          <div className={styles.profileText}>
            <span>현재 사용자 유형</span>
            <strong>{userTypeLabels[userType]}</strong>
          </div>
          <button
            type="button"
            className={styles.outlineButton}
            onClick={() => navigate('/user-type')}
          >
            유형 변경
          </button>
        </section>

        <section
          className={`${styles.card} ${styles.notificationCard}`}
          aria-labelledby="notifications-title"
        >
          <div className={styles.sectionTitleRow}>
            <Bell size={30} aria-hidden="true" />
            <h2 id="notifications-title">내 알림 설정</h2>
          </div>

          <div className={styles.notificationList}>
            {notificationSettings.map((setting) => {
              const Icon = setting.icon
              const isEnabled = notifications[setting.id]

              return (
                <div key={setting.id} className={styles.notificationRow}>
                  <span
                    className={`${styles.notificationIcon} ${
                      notificationIconClassNames[setting.tone]
                    }`}
                    aria-hidden="true"
                  >
                    <Icon size={34} />
                  </span>
                  <div className={styles.notificationCopy}>
                    <strong>{setting.title}</strong>
                    <span>{setting.description}</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isEnabled}
                    aria-label={`${setting.title} ${isEnabled ? '끄기' : '켜기'}`}
                    className={
                      isEnabled ? `${styles.switch} ${styles.switchOn}` : styles.switch
                    }
                    onClick={() => toggleNotification(setting.id)}
                  >
                    <span aria-hidden="true" />
                  </button>
                </div>
              )
            })}
          </div>
        </section>

        <section className={`${styles.card} ${styles.savedCard}`} aria-labelledby="saved-title">
          <div className={styles.sectionTitleRow}>
            <MapPin size={30} aria-hidden="true" />
            <h2 id="saved-title">저장한 장소</h2>
          </div>
          <div className={styles.savedContent}>
            <div className={styles.placeChipRow} aria-label="저장한 장소 목록">
              {savedPlaces.map((place) => (
                <Link key={place} to="/map" className={styles.placeChip}>
                  <MapPin size={22} aria-hidden="true" />
                  <span>{place}</span>
                </Link>
              ))}
            </div>
            <Link to="/map" className={styles.iconLinkButton} aria-label="저장한 장소 지도에서 보기">
              <ChevronRight size={30} aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section
          className={`${styles.card} ${styles.recentCard}`}
          aria-labelledby="recent-routes-title"
        >
          <div className={styles.sectionTitleRow}>
            <Clock3 size={30} aria-hidden="true" />
            <h2 id="recent-routes-title">최근 이용 경로</h2>
          </div>
          <div className={styles.recentRouteList}>
            {recentRoutes.map((route) => (
              <Link key={route.id} to="/map" className={styles.recentRoute}>
                <span className={styles.routeTrail}>
                  <span className={styles.routePoint}>
                    <MapPin size={25} aria-hidden="true" />
                    <span>{route.start}</span>
                  </span>
                  <ArrowRight size={24} aria-hidden="true" />
                  <span className={`${styles.routePoint} ${styles.routePointEnd}`}>
                    <MapPin size={25} aria-hidden="true" />
                    <span>{route.end}</span>
                  </span>
                </span>
                <time>{route.usedAt}</time>
                <ChevronRight size={26} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>

        <div className={styles.supportGrid}>
          <SettingsMenuGroup title="계정 관리" icon={UserCog} items={accountItems} />
          <SettingsMenuGroup title="서비스 정보" icon={Info} items={serviceItems} />
        </div>
      </div>
    </div>
  )
}
