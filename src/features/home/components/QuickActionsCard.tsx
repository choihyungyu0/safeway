import { Link } from 'react-router-dom'
import type { QuickActionItem } from '@/features/home/home.types'
import styles from '@/pages/HomePage.module.css'

const quickActions: QuickActionItem[] = [
  {
    id: 'route',
    label: '추천 경로 보기',
    description: 'AI 추천 결과 확인',
    href: '/recommendations',
    imageSrc: '/assets/home/icon-route.png',
    imageAlt: '추천 경로 보기 아이콘',
  },
  {
    id: 'location',
    label: '지도에서 찾기',
    description: '지도로 경로 탐색',
    href: '/map',
    imageSrc: '/assets/home/icon-location.png',
    imageAlt: '지도에서 찾기 아이콘',
  },
  {
    id: 'shelter',
    label: '내 주변 쉼터',
    description: '가까운 쉼터 찾기',
    href: '/shelters/shelter-001',
    imageSrc: '/assets/home/icon-shelter.png',
    imageAlt: '내 주변 쉼터 아이콘',
  },
  {
    id: 'weather',
    label: '기상·위험 정보',
    description: '실시간 정보 확인',
    href: '/',
    imageSrc: '/assets/home/icon-weather.png',
    imageAlt: '기상·위험 정보 아이콘',
  },
]

export function QuickActionsCard() {
  return (
    <section className={styles.infoCard} aria-labelledby="quick-actions-title">
      <div className={styles.cardTitleRow}>
        <h2 id="quick-actions-title">빠른 이용</h2>
      </div>

      <div className={styles.quickActionGrid}>
        {quickActions.map((action) => (
          <Link key={action.id} to={action.href} className={styles.quickActionLink}>
            <img src={action.imageSrc} alt={action.imageAlt} />
            <strong>{action.label}</strong>
            <span>{action.description}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
