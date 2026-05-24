import type { ReactNode } from 'react'
import { AdminSidebar } from '@/features/admin/components/AdminSidebar'
import { AdminTopHeader } from '@/features/admin/components/AdminTopHeader'
import styles from '@/pages/AdminDashboardPage.module.css'

type AdminChromeProps = {
  children: ReactNode
  headerSubtitle?: string
  headerVariant?: 'compact' | 'management'
  sidebarVariant?: 'compact' | 'management'
}

export function AdminChrome({
  children,
  headerSubtitle,
  headerVariant = 'compact',
  sidebarVariant = 'compact',
}: AdminChromeProps) {
  return (
    <div className={styles.adminPage}>
      <AdminTopHeader subtitle={headerSubtitle} variant={headerVariant} />
      <div className={styles.bodyLayout}>
        <AdminSidebar variant={sidebarVariant} />
        {children}
      </div>
    </div>
  )
}
