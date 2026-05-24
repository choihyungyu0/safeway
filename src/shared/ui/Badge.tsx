import type { ReactNode } from 'react'

type BadgeTone = 'blue' | 'teal' | 'green' | 'orange' | 'purple' | 'gray'

type BadgeProps = {
  children: ReactNode
  tone?: BadgeTone
}

export function Badge({ children, tone = 'blue' }: BadgeProps) {
  return <span className={`badge badge-${tone}`}>{children}</span>
}
