import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import {
  BellRing,
  Building2,
  CloudFog,
  Footprints,
  House,
  Info,
  ListChecks,
  Save,
  Sun,
  TriangleAlert,
  UserRoundCog,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { AdminShellLayout as AdminLayout } from '@/features/admin/components/AdminShellLayout'
import { saveAdminSettings } from '@/features/admin/adminSettings.api'
import { safewayUserTypeWeights } from '@/mocks/fixtures/generated/safewayData'
import styles from '@/pages/AdminSettingsPage.module.css'

type WeightId = 'heat' | 'dust' | 'fog' | 'shelter' | 'walking'

type WeightSetting = {
  id: WeightId
  label: string
  description: string
  icon?: LucideIcon
  accent: 'orange' | 'navy' | 'blue' | 'teal' | 'walk'
}

type AdminAccount = {
  id: string
  name: string
  role: string
  lastAccess: string
  roleTone: 'system' | 'operation' | 'monitoring'
}

type NotificationId = 'risk' | 'data' | 'shelter'

type NotificationSetting = {
  id: NotificationId
  title: string
  description: string
  icon: LucideIcon
  accent: 'danger' | 'orange' | 'teal'
}

const weightSettings: WeightSetting[] = [
  {
    id: 'heat',
    label: '폭염 위험',
    description: '폭염으로 인한 온열질환 및 건강 위험 반영 비율',
    icon: Sun,
    accent: 'orange',
  },
  {
    id: 'dust',
    label: '미세먼지',
    description: '미세먼지 노출에 따른 호흡기 위험 반영 비율',
    accent: 'navy',
  },
  {
    id: 'fog',
    label: '안개 위험',
    description: '안개로 인한 시야 저하 및 교통사고 위험 반영 비율',
    icon: CloudFog,
    accent: 'blue',
  },
  {
    id: 'shelter',
    label: '쉼터 반영',
    description: '쉼터 접근성 및 운영 상태 반영 비율',
    icon: House,
    accent: 'teal',
  },
  {
    id: 'walking',
    label: '보행안전',
    description: '보행 환경 및 교통안전 요소 반영 비율',
    icon: Footprints,
    accent: 'walk',
  },
]

const initialWeights: Record<WeightId, number> = {
  heat: 30,
  dust: 25,
  fog: 15,
  shelter: 20,
  walking: 10,
}

const adminAccounts: AdminAccount[] = [
  {
    id: 'kimsejong',
    name: '김세종',
    role: '시스템 관리자',
    lastAccess: '2025.06.21 14:05',
    roleTone: 'system',
  },
  {
    id: 'leeansafe',
    name: '이안전',
    role: '운영 관리자',
    lastAccess: '2025.06.21 11:32',
    roleTone: 'operation',
  },
  {
    id: 'parkpolicy',
    name: '박정책',
    role: '모니터링 관리자',
    lastAccess: '2025.06.21 09:18',
    roleTone: 'monitoring',
  },
]

const notificationSettings: NotificationSetting[] = [
  {
    id: 'risk',
    title: '위험 단계 상승 알림',
    description: '위험 단계가 상위 단계로 상승할 때 알림을 받습니다.',
    icon: TriangleAlert,
    accent: 'danger',
  },
  {
    id: 'data',
    title: '데이터 수집 오류 알림',
    description: '데이터 수집 또는 처리 오류 발생 시 알림을 받습니다.',
    icon: BellRing,
    accent: 'orange',
  },
  {
    id: 'shelter',
    title: '쉼터 운영 상태 변경 알림',
    description: '쉼터의 운영 상태 변경 시 알림을 받습니다.',
    icon: Building2,
    accent: 'teal',
  },
]

const initialNotifications: Record<NotificationId, boolean> = {
  risk: true,
  data: true,
  shelter: true,
}

const generalSafewayUserWeight = safewayUserTypeWeights.find(
  (weight) => weight.userType === 'GENERAL',
)

export function AdminSettingsPage() {
  const [weights, setWeights] = useState(initialWeights)
  const [notifications, setNotifications] = useState(initialNotifications)
  const [saveMessage, setSaveMessage] = useState('')

  const totalWeight = useMemo(
    () => Object.values(weights).reduce((sum, value) => sum + value, 0),
    [weights],
  )

  const updateWeight = (id: WeightId, value: number) => {
    setWeights((current) => ({ ...current, [id]: value }))
  }

  const toggleNotification = (id: NotificationId) => {
    setNotifications((current) => ({ ...current, [id]: !current[id] }))
  }

  const saveSettings = async () => {
    try {
      await saveAdminSettings({
        scoringWeights: weights,
        notificationSettings: notifications,
        userTypeWeights: safewayUserTypeWeights,
      })
      setSaveMessage('설정이 저장되었습니다.')
    } catch {
      setSaveMessage('설정 저장에 실패했습니다.')
    }
  }

  return (
    <AdminLayout
      headerSubtitle="세종특별자치시 공공데이터 기반 운영현황"
      sidebarVariant="settings"
      showLogout={false}
    >
      <main className={styles.page} aria-labelledby="admin-settings-title">
        <header className={styles.pageHeader}>
          <h1 id="admin-settings-title">설정</h1>
          <p>추천 가중치와 관리자 운영 기준 설정</p>
          {generalSafewayUserWeight ? (
            <p>
              SafeWay 사용자유형 가중치 {safewayUserTypeWeights.length}종 · 일반 기후안전{' '}
              {Math.round(generalSafewayUserWeight.climateSafetyWeight * 100)}% · 쉼터접근{' '}
              {Math.round(generalSafewayUserWeight.shelterAccessWeight * 100)}%
            </p>
          ) : null}
        </header>

        <section className={styles.weightCard} aria-labelledby="weight-settings-title">
          <div className={styles.cardTitle}>
            <h2 id="weight-settings-title">
              위험도 가중치 설정
              <Info size={17} strokeWidth={2.3} aria-hidden="true" />
            </h2>
            <p>각 항목의 중요도를 설정하면 추천 연산에 반영됩니다.</p>
          </div>

          <div className={styles.weightList}>
            {weightSettings.map((setting) => (
              <WeightRow
                key={setting.id}
                setting={setting}
                value={weights[setting.id]}
                onChange={(value) => updateWeight(setting.id, value)}
              />
            ))}
          </div>

          <div className={styles.weightNotice}>
            <p>
              <Info size={19} strokeWidth={2.4} aria-hidden="true" />
              가중치 변경 시 다음 추천 연산부터 반영됩니다.
            </p>
            <strong>
              총합계 <span>{totalWeight}</span> %
            </strong>
          </div>
        </section>

        <section className={styles.lowerGrid} aria-label="관리자 운영 설정">
          <section className={styles.accountCard} aria-labelledby="account-settings-title">
            <div className={styles.cardTitle}>
              <h2 id="account-settings-title">
                관리자 계정 관리
                <Info size={17} strokeWidth={2.3} aria-hidden="true" />
              </h2>
              <p>관리자 계정의 역할과 권한을 관리합니다.</p>
            </div>

            <div className={styles.accountTableWrap}>
              <table className={styles.accountTable}>
                <thead>
                  <tr>
                    <th>이름</th>
                    <th>아이디</th>
                    <th>역할</th>
                    <th>최종 접속</th>
                  </tr>
                </thead>
                <tbody>
                  {adminAccounts.map((account) => (
                    <tr key={account.id}>
                      <td>
                        <span className={styles.accountName}>
                          <span className={styles.accountAvatar} aria-hidden="true">
                            <UserRoundCog size={18} strokeWidth={2.15} />
                          </span>
                          {account.name}
                        </span>
                      </td>
                      <td>{account.id}</td>
                      <td>
                        <span className={`${styles.roleBadge} ${styles[account.roleTone]}`}>
                          {account.role}
                        </span>
                      </td>
                      <td>{account.lastAccess}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.accountActions}>
              <button type="button">
                <UserRoundCog size={19} strokeWidth={2.35} aria-hidden="true" />
                권한 보기
              </button>
              <button type="button">
                <ListChecks size={19} strokeWidth={2.35} aria-hidden="true" />
                관리자 목록 보기
              </button>
            </div>
          </section>

          <section className={styles.alertCard} aria-labelledby="alert-settings-title">
            <div className={styles.cardTitle}>
              <h2 id="alert-settings-title">
                알림 기준 설정
                <Info size={17} strokeWidth={2.3} aria-hidden="true" />
              </h2>
              <p>시스템 알림을 받을 항목을 설정합니다.</p>
            </div>

            <div className={styles.notificationList}>
              {notificationSettings.map((setting) => (
                <NotificationRow
                  key={setting.id}
                  setting={setting}
                  enabled={notifications[setting.id]}
                  onToggle={() => toggleNotification(setting.id)}
                />
              ))}
            </div>
          </section>
        </section>

        <div className={styles.saveBar}>
          {saveMessage ? (
            <p className={styles.saveMessage} role="status">
              {saveMessage}
            </p>
          ) : null}
          <button type="button" className={styles.saveButton} onClick={saveSettings}>
            <Save size={22} strokeWidth={2.35} aria-hidden="true" />
            설정 저장
          </button>
        </div>
      </main>
    </AdminLayout>
  )
}

type WeightRowProps = {
  setting: WeightSetting
  value: number
  onChange: (value: number) => void
}

function WeightRow({ setting, value, onChange }: WeightRowProps) {
  const Icon = setting.icon
  const sliderStyle = { '--setting-progress': `${value}%` } as CSSProperties

  return (
    <label className={styles.weightRow} htmlFor={`weight-${setting.id}`}>
      <span className={styles.weightLabel}>
        <span className={`${styles.weightIcon} ${styles[setting.accent]}`} aria-hidden="true">
          {Icon ? <Icon size={30} strokeWidth={2.35} /> : <span className={styles.dustIcon} />}
        </span>
        <strong>{setting.label}</strong>
      </span>

      <input
        id={`weight-${setting.id}`}
        className={styles.sliderInput}
        type="range"
        min="0"
        max="100"
        value={value}
        style={sliderStyle}
        aria-label={`${setting.label} 가중치`}
        onChange={(event) => onChange(Number(event.target.value))}
      />

      <span className={styles.weightValue} aria-hidden="true">
        <strong>{value}</strong>
        <span>%</span>
      </span>
      <span className={styles.weightDescription}>{setting.description}</span>
    </label>
  )
}

type NotificationRowProps = {
  setting: NotificationSetting
  enabled: boolean
  onToggle: () => void
}

function NotificationRow({ setting, enabled, onToggle }: NotificationRowProps) {
  const Icon = setting.icon

  return (
    <article className={styles.notificationRow}>
      <span className={`${styles.notificationIcon} ${styles[setting.accent]}`} aria-hidden="true">
        <Icon size={30} strokeWidth={2.25} />
      </span>
      <div>
        <h3>{setting.title}</h3>
        <p>{setting.description}</p>
      </div>
      <button
        type="button"
        className={`${styles.toggleButton} ${enabled ? styles.toggleOn : ''}`}
        role="switch"
        aria-checked={enabled}
        aria-label={setting.title}
        onClick={onToggle}
      >
        <span />
      </button>
    </article>
  )
}
