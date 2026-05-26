import type { ReactNode } from 'react'
import { AdminChrome } from '@/features/admin/AdminChrome'

type SejongAdminShellProps = {
  children: ReactNode
  headerSubtitle?: string
  headerVariant?: 'compact' | 'management'
  sidebarVariant?: 'compact' | 'management' | 'settings'
  showLogout?: boolean
}

export function SejongAdminShell({
  children,
  headerSubtitle,
  headerVariant,
  sidebarVariant,
  showLogout,
}: SejongAdminShellProps) {
  return (
    <AdminChrome
      headerSubtitle={headerSubtitle}
      headerVariant={headerVariant}
      sidebarVariant={sidebarVariant}
      showLogout={showLogout}
    >
      {children}
    </AdminChrome>
  )
}
