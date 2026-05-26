import type { ReactNode } from 'react'
import { SejongAdminShell } from '@/shared/ui/SejongAdminShell'

type AdminShellLayoutProps = {
  children: ReactNode
  headerSubtitle?: string
  headerVariant?: 'compact' | 'management'
  sidebarVariant?: 'compact' | 'management' | 'settings'
  showLogout?: boolean
}

export function AdminShellLayout({
  children,
  headerSubtitle,
  headerVariant,
  sidebarVariant,
  showLogout,
}: AdminShellLayoutProps) {
  return (
    <SejongAdminShell
      headerSubtitle={headerSubtitle}
      headerVariant={headerVariant}
      sidebarVariant={sidebarVariant}
      showLogout={showLogout}
    >
      {children}
    </SejongAdminShell>
  )
}
