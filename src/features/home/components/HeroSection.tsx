import styles from '@/pages/HomePage.module.css'

export function HeroSection() {
  return (
    <section className={styles.hero} aria-labelledby="home-title">
      <div className={styles.heroOverlay}>
        <p className={styles.trustLine}>세종특별자치시 공공데이터 기반</p>
        <h1 id="home-title">세종 세이프웨이</h1>
        <p className={styles.heroSubtitle}>
          <span>세종시민을 위한 AI 기후안전</span>
          <span>경로·쉼터 안내</span>
        </p>
        <p className={styles.sidePhrase}>오늘도 안전하고 편안한 세종 이동</p>
      </div>
    </section>
  )
}
