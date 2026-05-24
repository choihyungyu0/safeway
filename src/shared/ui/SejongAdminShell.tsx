import type { ReactNode } from 'react'
import { AdminChrome } from '@/features/admin/AdminChrome'

type SejongAdminShellProps = {
  children: ReactNode
  headerSubtitle?: string
  headerVariant?: 'compact' | 'management'
  sidebarVariant?: 'compact' | 'management'
}

export function SejongAdminShell({
  children,
  headerSubtitle,
  headerVariant,
  sidebarVariant,
}: SejongAdminShellProps) {
  return (
    <AdminChrome
      headerSubtitle={headerSubtitle}
      headerVariant={headerVariant}
      sidebarVariant={sidebarVariant}
    >
      {children}
    </AdminChrome>
  )
}
