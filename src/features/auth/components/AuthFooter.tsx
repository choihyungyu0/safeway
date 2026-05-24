import { ExternalLink } from 'lucide-react'
import styles from '@/features/auth/components/AuthFooter.module.css'

const footerLinks = ['이용약관', '개인정보처리방침', '이메일무단수집거부', '고객센터']

const socialItems = [
  { label: 'Facebook', icon: 'F' },
  { label: 'Blog', icon: 'B' },
  { label: 'Instagram', icon: 'I' },
  { label: 'YouTube', icon: 'Y' },
]

export function AuthFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerMain}>
          <strong className={styles.cityBrand}>세종특별자치시</strong>
          <nav className={styles.footerLinks} aria-label="하단 메뉴">
            {footerLinks.map((link) => (
              <a href="#" key={link}>
                {link}
              </a>
            ))}
          </nav>
          <p>세종특별자치시 도움6로 11 정부세종청사</p>
          <p>대표전화 044-300-2114</p>
          <p>© Sejong City. All rights reserved.</p>
        </div>

        <div className={styles.footerAside}>
          <a href="#" className={styles.cityHomepageButton}>
            세종시 홈페이지
            <ExternalLink size={16} aria-hidden="true" />
          </a>
          <div className={styles.socialList} aria-label="소셜 링크">
            {socialItems.map((item) => (
              <a href="#" key={item.label} aria-label={item.label}>
                {item.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
