import { Bell, ChevronDown, LogOut, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import styles from '@/pages/AdminDashboardPage.module.css'

export function AdminTopHeader() {
  const navigate = useNavigate()

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
        <button type="button" className={styles.iconButton} aria-label="알림">
          <Bell size={21} strokeWidth={2.1} aria-hidden="true" />
        </button>

        <div className={styles.profileMenu}>
          <span className={styles.avatar} aria-hidden="true">
            <User size={25} strokeWidth={2} />
          </span>

          <span className={styles.profileText}>
            <strong>김세종 관리자</strong>
            <span>안전정책과</span>
          </span>

          <button type="button" className={styles.chevronButton} aria-label="관리자 메뉴 열기">
            <ChevronDown size={17} aria-hidden="true" />
          </button>
        </div>

        <button type="button" className={styles.logoutButton} onClick={() => navigate('/login')}>
          <LogOut size={17} aria-hidden="true" />
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
