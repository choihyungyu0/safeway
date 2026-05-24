import { AuthBreadcrumb } from '@/features/auth/components/AuthBreadcrumb'
import { AuthFooter } from '@/features/auth/components/AuthFooter'
import { SignUpCard } from '@/features/auth/components/SignUpCard'
import styles from '@/pages/AuthPage.module.css'

export function SignUpPage() {
  return (
    <div className={styles.authPage}>
      <main className={styles.authMain}>
        <section className={styles.authHero} aria-labelledby="signup-title">
          <div className={styles.authHeroOverlay}>
            <div className={styles.authContainer}>
              <AuthBreadcrumb />
              <SignUpCard />
            </div>
          </div>
        </section>
      </main>
      <AuthFooter />
    </div>
  )
}
