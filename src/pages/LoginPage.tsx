import { AuthFooter } from '@/features/auth/components/AuthFooter'
import { LoginCard } from '@/features/auth/components/LoginCard'
import styles from '@/pages/LoginPage.module.css'

export function LoginPage() {
  return (
    <div className={styles.loginPage}>
      <section className={styles.loginHero} aria-labelledby="login-hero-title">
        <div className={styles.heroOverlay}>
          <div className={styles.heroTitle}>
            <h2 id="login-hero-title">안전한 이동, 세종 세이프웨이</h2>
            <p>세종 시민의 기후안전 경로를 안내합니다.</p>
          </div>

          <LoginCard />
        </div>
      </section>

      <AuthFooter />
    </div>
  )
}
