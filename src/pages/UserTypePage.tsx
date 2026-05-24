import { ArrowRight, CheckCircle2, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { UserType } from '@/entities/user/types'
import { useRouteSearchStore } from '@/features/route-search/routeSearchStore'
import { userTypeOptions } from '@/features/user-type/options'
import { PageHeader } from '@/shared/ui/PageHeader'

export function UserTypePage() {
  const navigate = useNavigate()
  const { userType, setUserType } = useRouteSearchStore()

  const selectUserType = (nextUserType: UserType) => {
    setUserType(nextUserType)
  }

  return (
    <section className="page">
      <PageHeader
        eyebrow="사용자 맞춤 보정"
        title="누구의 이동인가요?"
        description="사용자 유형에 따라 쉼터 접근성, 실외 노출, 야간 안전, 대중교통 접근성의 가중치를 다르게 계산합니다."
        actions={
          <button
            type="button"
            className="button button-primary"
            onClick={() => navigate('/recommendations')}
          >
            추천 결과 보기
            <ArrowRight size={18} />
          </button>
        }
      />

      <div className="user-type-grid">
        {userTypeOptions.map((option) => {
          const selected = userType === option.type

          return (
            <button
              key={option.type}
              type="button"
              className={`user-type-card ${selected ? 'is-selected' : ''}`}
              onClick={() => selectUserType(option.type)}
            >
              <span className="user-type-card__icon">
                {selected ? <CheckCircle2 size={22} /> : <UserRound size={22} />}
              </span>
              <strong>{option.label}</strong>
              <span>{option.description}</span>
            </button>
          )
        })}
      </div>

      <div className="inline-actions">
        <button
          type="button"
          className="button button-secondary"
          onClick={() => {
            setUserType('GENERAL')
            navigate('/recommendations')
          }}
        >
          일반으로 건너뛰기
        </button>
      </div>
    </section>
  )
}
