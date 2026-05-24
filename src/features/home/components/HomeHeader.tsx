import { Link, NavLink } from 'react-router-dom'
import { UserRound } from 'lucide-react'
import styles from '@/pages/HomePage.module.css'

const navItems = [
  { to: '/', label: '경로 검색' },
  { to: '/recommendations', label: '추천 결과' },
  { to: '/map', label: '지도 보기' },
  { to: '/shelters/shelter-001', label: '쉼터' },
  { to: '#', label: '마이페이지', external: true },
]

export function HomeHeader() {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logoLink} aria-label="세종 세이프웨이 홈">
        <span className={styles.logoMark} aria-hidden="true">
          <span className={styles.logoCircle} />
          <span className={`${styles.logoLeaf} ${styles.leafOne}`} />
          <span className={`${styles.logoLeaf} ${styles.leafTwo}`} />
          <span className={`${styles.logoLeaf} ${styles.leafThree}`} />
        </span>
        <strong>
          세종 <span>세이프웨이</span>
        </strong>
      </Link>

      <nav className={styles.headerNav} aria-label="주요 메뉴">
        {navItems.map((item) =>
          item.external ? (
            <a key={item.label} href={item.to} className={styles.headerNavLink}>
              {item.label}
            </a>
          ) : (
            <NavLink key={item.label} to={item.to} className={styles.headerNavLink}>
              {item.label}
            </NavLink>
          ),
        )}
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
    </header>
  )
}
