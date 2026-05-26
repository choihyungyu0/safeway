import type { ReactNode } from 'react'
import { AdminSidebar } from '@/features/admin/components/AdminSidebar'
import { AdminTopHeader } from '@/features/admin/components/AdminTopHeader'
import styles from '@/pages/AdminDashboardPage.module.css'

type AdminChromeProps = {
  children: ReactNode
  headerSubtitle?: string
  headerVariant?: 'compact' | 'management'
  sidebarVariant?: 'compact' | 'management' | 'settings'
  showLogout?: boolean
}

export function AdminChrome({
  children,
  headerSubtitle,
  headerVariant = 'compact',
  sidebarVariant = 'compact',
  showLogout = true,
}: AdminChromeProps) {
  const bodyLayoutClassName = `${styles.bodyLayout} ${
    sidebarVariant === 'settings' ? styles.settingsBodyLayout : ''
  }`

  return (
    <div className={styles.adminPage}>
      <AdminTopHeader
        subtitle={headerSubtitle}
        variant={headerVariant}
        showLogout={showLogout}
      />
      <div className={bodyLayoutClassName}>
        <AdminSidebar variant={sidebarVariant} />
        {children}
      </div>
    </div>
  )
}
