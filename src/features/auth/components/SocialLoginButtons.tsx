import styles from '@/pages/LoginPage.module.css'

type SocialLoginButtonsProps = {
  onDemoMessage: (message: string) => void
}

export function SocialLoginButtons({ onDemoMessage }: SocialLoginButtonsProps) {
  return (
    <div className={styles.socialLoginRow}>
      <button
        type="button"
        className={`${styles.socialButton} ${styles.googleButton}`}
        onClick={() => onDemoMessage('구글 로그인은 데모 화면입니다.')}
      >
        <span aria-hidden="true">G</span>
        구글로 로그인
      </button>

      <button
        type="button"
        className={`${styles.socialButton} ${styles.kakaoButton}`}
        onClick={() => onDemoMessage('카카오 로그인은 데모 화면입니다.')}
      >
        <span className={styles.kakaoMark} aria-hidden="true">
          K
        </span>
        카카오로 로그인
      </button>
    </div>
  )
}
