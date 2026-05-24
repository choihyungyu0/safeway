import { useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, Send } from 'lucide-react'
import { feedbackSchema, type FeedbackFormValues } from '@/features/feedback/schema'
import { submitFeedback } from '@/shared/api/safewayApi'
import { PageHeader } from '@/shared/ui/PageHeader'

type FeedbackErrors = Partial<Record<keyof FeedbackFormValues, string>>

export function FeedbackPage() {
  const { routeLogId = 'log-safeway-001' } = useParams()
  const [form, setForm] = useState<FeedbackFormValues>({
    routeLogId,
    satisfaction: 5,
    actualTravelMinutes: 32,
    perceivedRisk: 'LOW',
    shelterUsed: true,
    helpfulness: 5,
    comment: '',
  })
  const [errors, setErrors] = useState<FeedbackErrors>({})
  const mutation = useMutation({
    mutationFn: submitFeedback,
  })

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const result = feedbackSchema.safeParse({ ...form, routeLogId })

    if (!result.success) {
      const nextErrors = Object.entries(result.error.flatten().fieldErrors).reduce<FeedbackErrors>(
        (acc, [field, messages]) => ({
          ...acc,
          [field]: messages?.[0],
        }),
        {},
      )
      setErrors(nextErrors)
      return
    }

    setErrors({})
    mutation.mutate(result.data)
  }

  if (mutation.isSuccess) {
    return (
      <section className="page feedback-success">
        <CheckCircle2 size={48} />
        <h1>피드백이 접수되었습니다</h1>
        <p>시민 의견은 쉼터 공백 분석과 다음 추천 품질 개선에 반영됩니다.</p>
        <Link className="button button-primary" to="/">
          새 경로 검색하기
        </Link>
      </section>
    )
  }

  return (
    <section className="page">
      <PageHeader
        eyebrow="이동 후 평가"
        title="추천 경로가 도움이 되었나요?"
        description="실제 이동 경험을 남기면 기후위험 낮음 경로와 쉼터 안내 품질을 개선할 수 있습니다."
      />

      <form className="feedback-form" onSubmit={submit} noValidate>
        <label>
          <span>만족도</span>
          <input
            type="range"
            min="1"
            max="5"
            value={form.satisfaction}
            onChange={(event) =>
              setForm({ ...form, satisfaction: Number(event.target.value) })
            }
          />
          <strong>{form.satisfaction}점</strong>
        </label>

        <label>
          <span>실제 이동 시간</span>
          <input
            type="number"
            min="1"
            max="240"
            value={form.actualTravelMinutes}
            onChange={(event) =>
              setForm({ ...form, actualTravelMinutes: Number(event.target.value) })
            }
          />
          {errors.actualTravelMinutes ? (
            <small className="form-error">{errors.actualTravelMinutes}</small>
          ) : null}
        </label>

        <label>
          <span>체감 위험</span>
          <select
            value={form.perceivedRisk}
            onChange={(event) =>
              setForm({
                ...form,
                perceivedRisk: event.target.value as FeedbackFormValues['perceivedRisk'],
              })
            }
          >
            <option value="LOW">낮음</option>
            <option value="MODERATE">보통</option>
            <option value="HIGH">높음</option>
          </select>
        </label>

        <label className="toggle-row">
          <input
            type="checkbox"
            checked={form.shelterUsed}
            onChange={(event) => setForm({ ...form, shelterUsed: event.target.checked })}
          />
          <span>추천된 쉼터를 이용했어요</span>
        </label>

        <label>
          <span>도움 정도</span>
          <input
            type="range"
            min="1"
            max="5"
            value={form.helpfulness}
            onChange={(event) =>
              setForm({ ...form, helpfulness: Number(event.target.value) })
            }
          />
          <strong>{form.helpfulness}점</strong>
        </label>

        <label>
          <span>추가 의견</span>
          <textarea
            value={form.comment}
            maxLength={300}
            onChange={(event) => setForm({ ...form, comment: event.target.value })}
            placeholder="쉼터 위치, 그늘, 안전시설, 실제 소요 시간에 대한 의견을 남겨 주세요."
          />
          <small>{form.comment?.length ?? 0}/300</small>
          {errors.comment ? <small className="form-error">{errors.comment}</small> : null}
        </label>

        <button type="submit" className="button button-primary button-wide">
          <Send size={18} />
          피드백 제출
        </button>
      </form>
    </section>
  )
}
