import { Link } from 'react-router-dom'
import { Info } from 'lucide-react'
import styles from '@/pages/HomePage.module.css'

export function ServiceInfoBanner() {
  return (
    <section className={styles.serviceBanner}>
      <span className={styles.bannerIcon} aria-hidden="true">
        <Info size={24} />
      </span>
      <p>
        세종 세이프웨이는 기온, 습도, 미세먼지, 안개 등 기후요소와 그늘, 녹지,
        쉼터 등 환경요소를 종합해 가장 안전하고 쾌적한 경로를 AI가 추천해
        드립니다.
      </p>
      <Link to="#" className={styles.bannerButton}>
        서비스 안내
      </Link>
    </section>
  )
}
