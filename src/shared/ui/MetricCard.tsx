import type { ReactNode } from 'react'

type MetricCardProps = {
  label: string
  value: string | number
  detail?: string
  icon?: ReactNode
}

export function MetricCard({ label, value, detail, icon }: MetricCardProps) {
  return (
    <article className="metric-card">
      <div className="metric-card__icon" aria-hidden="true">
        {icon}
      </div>
      <div>
        <p className="eyebrow">{label}</p>
        <strong>{value}</strong>
        {detail ? <span>{detail}</span> : null}
      </div>
    </article>
  )
}
