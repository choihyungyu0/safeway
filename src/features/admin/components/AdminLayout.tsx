import type { ReactNode } from 'react'
import { AdminSidebar } from '@/features/admin/components/AdminSidebar'
import { AdminTopHeader } from '@/features/admin/components/AdminTopHeader'
import styles from '@/pages/AdminDashboardPage.module.css'

type AdminLayoutProps = {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className={styles.adminPage}>
      <AdminTopHeader />
      <div className={styles.bodyLayout}>
        <AdminSidebar />
        {children}
      </div>
    </div>
  )
}
