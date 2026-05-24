import { Eye, EyeOff, Lock } from 'lucide-react'
import styles from '@/pages/LoginPage.module.css'

type PasswordInputProps = {
  describedBy?: string
  error?: string
  id: string
  label: string
  onChange: (value: string) => void
  onToggleVisible: () => void
  placeholder: string
  value: string
  visible: boolean
}

export function PasswordInput({
  describedBy,
  error,
  id,
  label,
  onChange,
  onToggleVisible,
  placeholder,
  value,
  visible,
}: PasswordInputProps) {
  return (
    <div className={styles.inputBox}>
      <Lock className={styles.fieldIcon} size={25} aria-hidden="true" />
      <label htmlFor={id} className={styles.visuallyHidden}>
        {label}
      </label>
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
      />
      <button
        type="button"
        className={styles.eyeButton}
        aria-label={visible ? '비밀번호 숨기기' : '비밀번호 보기'}
        onClick={onToggleVisible}
      >
        {visible ? <EyeOff size={22} aria-hidden="true" /> : <Eye size={22} aria-hidden="true" />}
      </button>
    </div>
  )
}
