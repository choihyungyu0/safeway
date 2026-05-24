import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, Eye, EyeOff, Lock, Mail, Phone, UserRound } from 'lucide-react'
import { authSchema } from '@/features/auth/auth.schema'
import type { AuthFieldName, AuthFormValues } from '@/features/auth/auth.types'
import styles from '@/pages/AuthPage.module.css'

type AuthErrors = Partial<Record<AuthFieldName | 'terms', string>>

const initialValues: AuthFormValues = {
  name: '',
  emailOrId: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  serviceTerms: false,
  privacyTerms: false,
  marketingTerms: false,
}

const fieldItems = [
  {
    name: 'name',
    label: '이름',
    placeholder: '이름을 입력해주세요',
    icon: UserRound,
    type: 'text',
  },
  {
    name: 'emailOrId',
    label: '이메일 또는 아이디',
    placeholder: '이메일 또는 아이디를 입력해주세요',
    icon: Mail,
    type: 'text',
  },
  {
    name: 'phoneNumber',
    label: '휴대폰 번호',
    placeholder: '- 없이 휴대폰 번호를 입력해주세요',
    icon: Phone,
    type: 'tel',
  },
  {
    name: 'password',
    label: '비밀번호',
    placeholder: '영문, 숫자, 특수문자 포함 8~20자',
    icon: Lock,
    type: 'password',
  },
  {
    name: 'confirmPassword',
    label: '비밀번호 확인',
    placeholder: '비밀번호를 다시 입력해주세요',
    icon: Lock,
    type: 'password',
  },
] as const

export function SignUpCard() {
  const navigate = useNavigate()
  const [values, setValues] = useState<AuthFormValues>(initialValues)
  const [errors, setErrors] = useState<AuthErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const updateValue = <Key extends AuthFieldName>(key: Key, value: AuthFormValues[Key]) => {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined, terms: undefined }))
    setSuccessMessage('')
  }

  const showTermsPreview = (title: string) => {
    window.alert(`${title}\n\n세종 세이프웨이 데모 약관 미리보기입니다.`)
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const result = authSchema.safeParse(values)

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      setErrors({
        name: fieldErrors.name?.[0],
        emailOrId: fieldErrors.emailOrId?.[0],
        phoneNumber: fieldErrors.phoneNumber?.[0],
        password: fieldErrors.password?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
        terms: fieldErrors.serviceTerms?.[0] ?? fieldErrors.privacyTerms?.[0],
      })
      setSuccessMessage('')
      return
    }

    setErrors({})
    setSuccessMessage('가입이 완료되었습니다.')
    window.setTimeout(() => navigate('/'), 800)
  }

  return (
    <section className={styles.authCard} aria-labelledby="signup-title">
      <div className={styles.cardHeader}>
        <h1 id="signup-title">회원가입</h1>
        <p>
          <span>세종 세이프웨이와 함께</span>
          <span>더 안전한 세종을 만들어가요.</span>
        </p>
      </div>

      <form className={styles.authForm} onSubmit={submit} noValidate>
        {fieldItems.map((field) => {
          const Icon = field.icon
          const isPassword = field.name === 'password'
          const isConfirmPassword = field.name === 'confirmPassword'
          const visible = isPassword ? showPassword : showConfirmPassword
          const inputType =
            isPassword || isConfirmPassword ? (visible ? 'text' : 'password') : field.type

          return (
            <div key={field.name} className={styles.fieldGroup}>
              <label htmlFor={field.name} className={styles.authField}>
                <span className={styles.fieldLabel}>
                  <Icon size={19} aria-hidden="true" />
                  {field.label}
                </span>
                <input
                  id={field.name}
                  type={inputType}
                  value={values[field.name]}
                  placeholder={field.placeholder}
                  onChange={(event) => updateValue(field.name, event.target.value)}
                  aria-invalid={Boolean(errors[field.name])}
                />
                {isPassword || isConfirmPassword ? (
                  <button
                    type="button"
                    className={styles.eyeButton}
                    aria-label={`${field.label} 보기 전환`}
                    onClick={() =>
                      isPassword
                        ? setShowPassword((current) => !current)
                        : setShowConfirmPassword((current) => !current)
                    }
                  >
                    {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                ) : null}
              </label>
              {errors[field.name] ? (
                <p className={styles.fieldError}>{errors[field.name]}</p>
              ) : null}
            </div>
          )
        })}

        <div className={styles.termsPanel}>
          <label className={styles.termRow}>
            <input
              type="checkbox"
              checked={values.serviceTerms}
              onChange={(event) => updateValue('serviceTerms', event.target.checked)}
            />
            <span>[필수] 서비스 이용약관 동의</span>
            <button type="button" onClick={() => showTermsPreview('서비스 이용약관')}>
              보기
              <ChevronRight size={15} />
            </button>
          </label>

          <label className={styles.termRow}>
            <input
              type="checkbox"
              checked={values.privacyTerms}
              onChange={(event) => updateValue('privacyTerms', event.target.checked)}
            />
            <span>[필수] 개인정보 수집 및 이용 동의</span>
            <button type="button" onClick={() => showTermsPreview('개인정보 수집 및 이용')}>
              보기
              <ChevronRight size={15} />
            </button>
          </label>

          <label className={styles.termRow}>
            <input
              type="checkbox"
              checked={values.marketingTerms}
              onChange={(event) => updateValue('marketingTerms', event.target.checked)}
            />
            <span>(선택) 맞춤 추천 알림 수신 동의</span>
          </label>
          {errors.terms ? <p className={styles.fieldError}>{errors.terms}</p> : null}
        </div>

        <button type="submit" className={styles.submitButton}>
          가입하기
        </button>
        {successMessage ? <p className={styles.successMessage}>{successMessage}</p> : null}
      </form>

      <p className={styles.loginPrompt}>
        이미 계정이 있으신가요? <Link to="/login">로그인</Link>
      </p>
    </section>
  )
}
