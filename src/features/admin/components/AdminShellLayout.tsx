import type { ReactNode } from 'react'
import { SejongAdminShell } from '@/shared/ui/SejongAdminShell'

type AdminShellLayoutProps = {
  children: ReactNode
  headerSubtitle?: string
  headerVariant?: 'compact' | 'management'
  sidebarVariant?: 'compact' | 'management'
}

export function AdminShellLayout({
  children,
  headerSubtitle,
  headerVariant,
  sidebarVariant,
}: AdminShellLayoutProps) {
  return (
    <SejongAdminShell
      headerSubtitle={headerSubtitle}
      headerVariant={headerVariant}
      sidebarVariant={sidebarVariant}
    >
      {children}
    </SejongAdminShell>
  )
}
