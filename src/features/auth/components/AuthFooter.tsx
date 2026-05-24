import { ChevronDown, Globe2 } from 'lucide-react'
import styles from '@/features/auth/components/AuthFooter.module.css'

const footerLinks = [
  '이용약관',
  '개인정보처리방침',
  '위치기반서비스 이용약관',
  '도움말센터',
  '문의하기',
]

const socialItems = [
  { label: 'YouTube', icon: 'Y' },
  { label: 'Facebook', icon: 'f' },
  { label: 'Instagram', icon: 'I' },
  { label: 'Naver', icon: 'N' },
]

export function AuthFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <nav className={styles.footerLinks} aria-label="하단 메뉴">
          {footerLinks.map((link, index) => (
            <div key={link} className={styles.footerLinkItem}>
              <a href="#">{link}</a>
              {index !== footerLinks.length - 1 ? <span aria-hidden="true" /> : null}
            </div>
          ))}
        </nav>

        <button type="button" className={styles.languageButton} aria-label="언어 선택">
          <Globe2 size={20} aria-hidden="true" />
          한국어
          <ChevronDown size={17} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.footerBottom}>
        <div className={styles.cityBrand}>
          <div className={styles.cityLogo} aria-hidden="true" />
          <strong>세종특별자치시</strong>
        </div>

        <div className={styles.footerInfo}>
          <p>
            세종특별자치시 한누리대로 2130 (보람동)
            <span aria-hidden="true" />
            대표전화 044-300-2114
          </p>
          <p>© Sejong City. All rights reserved.</p>
        </div>

        <div className={styles.socialList} aria-label="소셜 링크">
          {socialItems.map((item) => (
            <a href="#" key={item.label} aria-label={item.label}>
              {item.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
