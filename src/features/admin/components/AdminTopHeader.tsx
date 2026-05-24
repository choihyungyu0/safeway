import { useState } from 'react'
import { Bell, ChevronDown, LogOut, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import styles from '@/pages/AdminDashboardPage.module.css'

export function AdminTopHeader() {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className={styles.adminHeader}>
      <div className={styles.headerBrandGroup}>
        <AdminLogo />
        <h1>
          세종 <span>세이프웨이</span> 관리자
        </h1>
      </div>

      <p className={styles.headerSubtitle}>세종특별자치시 공공데이터 기반 운영현황</p>

      <div className={styles.headerActions}>
        <button type="button" className={styles.alarmButton} aria-label="알림 12건">
          <Bell size={22} aria-hidden="true" />
          <span>알림</span>
          <strong>12</strong>
        </button>

        <div className={styles.headerDivider} aria-hidden="true" />

        <div className={styles.profileMenu}>
          <div className={styles.avatar} aria-hidden="true">
            <UserRound size={28} />
          </div>
          <div className={styles.profileText}>
            <strong>김세종 관리자</strong>
            <span>안전정책과</span>
          </div>
          <button
            type="button"
            className={styles.chevronButton}
            aria-label="관리자 메뉴 열기"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            <ChevronDown size={18} aria-hidden="true" />
          </button>

          {isMenuOpen ? (
            <div className={styles.userDropdown} role="menu">
              <button type="button" role="menuitem" onClick={() => setIsMenuOpen(false)}>
                관리자 정보
              </button>
              <button type="button" role="menuitem" onClick={() => navigate('/login')}>
                로그아웃
              </button>
            </div>
          ) : null}
        </div>

        <div className={styles.headerDivider} aria-hidden="true" />

        <button type="button" className={styles.logoutButton} onClick={() => navigate('/login')}>
          <LogOut size={18} aria-hidden="true" />
          로그아웃
        </button>
      </div>
    </header>
  )
}

function AdminLogo() {
  return (
    <div className={styles.logo} aria-hidden="true">
      <div className={styles.logoCircle} />
      <div className={`${styles.logoLeaf} ${styles.leafOne}`} />
      <div className={`${styles.logoLeaf} ${styles.leafTwo}`} />
      <div className={`${styles.logoLeaf} ${styles.leafThree}`} />
    </div>
  )
}
