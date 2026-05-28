import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Bell,
  Home,
  Route,
  ShieldCheck,
  Star,
  UserRound,
} from 'lucide-react'
import logoSrc from '@/assets/logo.PNG'
import styles from '@/pages/HomePage.module.css'

const navItems = [
  { to: '/', label: '경로 검색', mobileLabel: '홈', icon: Home },
  { to: '/recommendations', label: '추천 결과', mobileLabel: '경로 찾기', icon: Route },
  { to: '/map', label: '지도 보기', mobileLabel: '안전 정보', icon: ShieldCheck },
  { to: '/shelters', label: '쉼터', mobileLabel: '즐겨찾기', icon: Star },
  { to: '/mypage', label: '마이페이지', mobileLabel: '마이페이지', icon: UserRound },
]

export function HomeHeader() {
  const location = useLocation()
  const navigate = useNavigate()
  const showMobileBackButton = !['/', '/mypage'].includes(location.pathname)

  return (
    <header
      className={
        showMobileBackButton ? styles.header : `${styles.header} ${styles.headerNoBack}`
      }
    >
      {showMobileBackButton ? (
        <button
          type="button"
          className={styles.mobileBackButton}
          aria-label="이전 화면"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={28} aria-hidden="true" />
        </button>
      ) : null}

      <Link to="/" className={styles.logoLink} aria-label="세종 세이프웨이 홈">
        <span className={styles.logoMark} aria-hidden="true">
          <img src={logoSrc} alt="" className={styles.logoImage} />
        </span>
        <strong>
          세종 <span>세이프웨이</span>
        </strong>
      </Link>

      <nav className={styles.headerNav} aria-label="주요 메뉴">
        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === '/'}
              className={styles.headerNavLink}
            >
              <Icon className={styles.mobileNavIcon} size={22} aria-hidden="true" />
              <span className={styles.desktopNavLabel}>{item.label}</span>
              <span className={styles.mobileNavLabel}>{item.mobileLabel}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className={styles.authActions}>
        <NavLink
          to="/login"
          className={({ isActive }) =>
            isActive ? `${styles.loginLink} ${styles.loginLinkActive}` : styles.loginLink
          }
        >
          <UserRound size={23} aria-hidden="true" />
          로그인
        </NavLink>
        <Link to="/signup" className={styles.signupButton}>
          회원가입
        </Link>
      </div>

      <button type="button" className={styles.mobileAlarmButton} aria-label="알림">
        <Bell size={24} aria-hidden="true" />
      </button>
    </header>
  )
}
