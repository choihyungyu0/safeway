import { CurrentConditionCard } from '@/features/home/components/CurrentConditionCard'
import { FavoritePlacesCard } from '@/features/home/components/FavoritePlacesCard'
import { HeroSection } from '@/features/home/components/HeroSection'
import { QuickActionsCard } from '@/features/home/components/QuickActionsCard'
import { RouteSearchCard } from '@/features/home/components/RouteSearchCard'
import { ServiceInfoBanner } from '@/features/home/components/ServiceInfoBanner'
import styles from '@/pages/HomePage.module.css'

export function HomePage() {
  return (
    <div className={styles.homePage}>
      <HeroSection />

      <div className={styles.homeContent}>
        <RouteSearchCard />

        <div className={styles.cardGrid}>
          <FavoritePlacesCard />
          <QuickActionsCard />
          <CurrentConditionCard />
        </div>

        <ServiceInfoBanner />
      </div>
    </div>
  )
}
