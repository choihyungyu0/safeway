import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserRound } from 'lucide-react'
import { PasswordInput } from '@/features/auth/components/PasswordInput'
import { SocialLoginButtons } from '@/features/auth/components/SocialLoginButtons'
import { loginSchema } from '@/features/auth/login.schema'
import type { LoginFieldName, LoginFormValues } from '@/features/auth/login.types'
import styles from '@/pages/LoginPage.module.css'

type LoginErrors = Partial<Record<LoginFieldName, string>>

const initialValues: LoginFormValues = {
  emailOrId: '',
  password: '',
}

export function LoginCard() {
  const navigate = useNavigate()
  const [values, setValues] = useState<LoginFormValues>(initialValues)
  const [errors, setErrors] = useState<LoginErrors>({})
  const [statusMessage, setStatusMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const updateValue = (key: LoginFieldName, value: string) => {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
    setStatusMessage('')
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const result = loginSchema.safeParse(values)

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      setErrors({
        emailOrId: fieldErrors.emailOrId?.[0],
        password: fieldErrors.password?.[0],
      })
      setStatusMessage('')
      return
    }

    setErrors({})
    setStatusMessage('로그인되었습니다.')
    window.setTimeout(() => navigate('/'), 650)
  }

  return (
    <section className={styles.loginCard} aria-labelledby="login-title">
      <div className={styles.cardHeader}>
        <h1 id="login-title">로그인</h1>
        <p>세종 세이프웨이에 오신 것을 환영합니다.</p>
      </div>

      <form className={styles.loginForm} onSubmit={submit} noValidate>
        <div className={styles.fieldGroup}>
          <div className={styles.inputBox}>
            <UserRound className={styles.fieldIcon} size={25} aria-hidden="true" />
            <label htmlFor="login-email-or-id" className={styles.visuallyHidden}>
              아이디 또는 이메일
            </label>
            <input
              id="login-email-or-id"
              type="text"
              value={values.emailOrId}
              placeholder="아이디 또는 이메일"
              onChange={(event) => updateValue('emailOrId', event.target.value)}
              aria-invalid={Boolean(errors.emailOrId)}
              aria-describedby={errors.emailOrId ? 'login-email-error' : undefined}
            />
          </div>
          {errors.emailOrId ? (
            <p id="login-email-error" className={styles.fieldError}>
              {errors.emailOrId}
            </p>
          ) : null}
        </div>

        <div className={styles.fieldGroup}>
          <PasswordInput
            id="login-password"
            label="비밀번호"
            value={values.password}
            placeholder="비밀번호"
            visible={showPassword}
            error={errors.password}
            describedBy={errors.password ? 'login-password-error' : undefined}
            onChange={(value) => updateValue('password', value)}
            onToggleVisible={() => setShowPassword((current) => !current)}
          />
          {errors.password ? (
            <p id="login-password-error" className={styles.fieldError}>
              {errors.password}
            </p>
          ) : null}
        </div>

        <button type="submit" className={styles.mainLoginButton}>
          로그인
        </button>
      </form>

      {statusMessage ? (
        <p className={styles.statusMessage} role="status">
          {statusMessage}
        </p>
      ) : null}

      <nav className={styles.findMenu} aria-label="로그인 도움말">
        <Link to="#">아이디 찾기</Link>
        <span aria-hidden="true" />
        <Link to="#">비밀번호 찾기</Link>
        <span aria-hidden="true" />
        <Link to="/signup" className={styles.joinLink}>
          회원가입
        </Link>
      </nav>

      <div className={styles.simpleLoginDivider}>
        <span aria-hidden="true" />
        <p>간편 로그인</p>
        <span aria-hidden="true" />
      </div>

      <SocialLoginButtons onDemoMessage={setStatusMessage} />
    </section>
  )
}
