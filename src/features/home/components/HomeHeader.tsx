import { Link, NavLink } from 'react-router-dom'
import { LogIn, ShieldCheck } from 'lucide-react'
import styles from '@/pages/HomePage.module.css'

const navItems = [
  { to: '/', label: '경로 검색' },
  { to: '/recommendations', label: '추천 결과' },
  { to: '/map', label: '지도 보기' },
  { to: '/shelters/shelter-001', label: '쉼터' },
  { to: '#', label: '마이페이지' },
]

export function HomeHeader() {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logoLink} aria-label="세종 세이프웨이 홈">
        <span className={styles.logoMark} aria-hidden="true">
          <ShieldCheck size={22} />
        </span>
        <strong>세종 세이프웨이</strong>
      </Link>

      <nav className={styles.headerNav} aria-label="주요 메뉴">
        {navItems.map((item) => (
          <NavLink key={item.label} to={item.to} className={styles.headerNavLink}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.authActions}>
        <Link to="#" className={styles.loginLink}>
          <LogIn size={18} />
          로그인
        </Link>
        <Link to="#" className={styles.signupButton}>
          회원가입
        </Link>
      </div>
    </header>
  )
}
