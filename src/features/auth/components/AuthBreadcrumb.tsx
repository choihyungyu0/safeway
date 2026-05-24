import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import styles from '@/pages/AuthPage.module.css'

export function AuthBreadcrumb() {
  return (
    <nav className={styles.breadcrumb} aria-label="현재 위치">
      <Link to="/">
        <Home size={16} aria-hidden="true" />홈
      </Link>
      <ChevronRight size={15} aria-hidden="true" />
      <span>회원가입</span>
    </nav>
  )
}
