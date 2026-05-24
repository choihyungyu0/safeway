import { useState } from 'react'
import type { FormEvent } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CalendarClock, CloudFog, MapPin, Navigation, Sparkles, Sun } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { RoutePreference, TransportMode } from '@/entities/route/types'
import { routePreferences, transportModes } from '@/entities/route/types'
import { routeSearchSchema, type RouteSearchFormValues } from '@/features/route-search/schema'
import { useRouteSearchStore } from '@/features/route-search/routeSearchStore'
import { favoritePlaces } from '@/mocks/fixtures/places'
import { getCurrentClimate } from '@/shared/api/safewayApi'
import { routePreferenceLabels, transportModeLabels } from '@/shared/constants/labels'
import { Badge } from '@/shared/ui/Badge'
import { MetricCard } from '@/shared/ui/MetricCard'

type FormErrors = Partial<Record<keyof RouteSearchFormValues, string>>

const climateIcons = {
  HEAT: Sun,
  FINE_DUST: Sparkles,
  FOG: CloudFog,
  COLD: CloudFog,
  OZONE: Sun,
}

export function HomePage() {
  const navigate = useNavigate()
  const { searchParams, setSearchParams } = useRouteSearchStore()
  const [form, setForm] = useState<RouteSearchFormValues>(searchParams)
  const [errors, setErrors] = useState<FormErrors>({})
  const { data: climate } = useQuery({
    queryKey: ['climate', 'current'],
    queryFn: getCurrentClimate,
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const result = routeSearchSchema.safeParse(form)

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      const nextErrors = Object.entries(fieldErrors).reduce<FormErrors>(
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
    setSearchParams(result.data)
    navigate('/user-type')
  }

  return (
    <section className="page page-home">
      <div className="home-layout">
        <div className="home-copy">
          <Badge tone="blue">세종시 기후안전 이동</Badge>
          <h1>세종 세이프웨이</h1>
          <p>
            폭염, 미세먼지, 안개처럼 오늘의 위험을 반영해 쉬어갈 수 있는 곳과
            안전시설이 가까운 경로를 추천합니다.
          </p>
          <div className="climate-grid" aria-label="현재 기후위험 요약">
            {(climate?.risks ?? []).map((risk) => {
              const Icon = climateIcons[risk.type]

              return (
                <MetricCard
                  key={risk.type}
                  label={risk.label}
                  value={risk.value}
                  detail={risk.summary}
                  icon={<Icon size={20} />}
                />
              )
            })}
            {!climate
              ? ['폭염', '미세먼지', '안개'].map((label) => (
                  <MetricCard key={label} label={label} value="확인 중" detail="공공데이터 연결 대기" />
                ))
              : null}
          </div>
        </div>

        <form className="route-form" onSubmit={handleSubmit} noValidate>
          <div className="form-heading">
            <Navigation size={22} />
            <div>
              <h2>AI 경로 조건</h2>
              <p>출발지와 목적지를 입력하면 사용자 유형에 맞춰 다시 계산합니다.</p>
            </div>
          </div>

          <label>
            <span>출발지</span>
            <input
              value={form.startPlace}
              onChange={(event) => setForm({ ...form, startPlace: event.target.value })}
              placeholder="예: 정부세종청사"
              aria-invalid={Boolean(errors.startPlace)}
            />
            {errors.startPlace ? <small className="form-error">{errors.startPlace}</small> : null}
          </label>

          <label>
            <span>목적지</span>
            <input
              value={form.destination}
              onChange={(event) => setForm({ ...form, destination: event.target.value })}
              placeholder="예: 세종시청"
              aria-invalid={Boolean(errors.destination)}
            />
            {errors.destination ? (
              <small className="form-error">{errors.destination}</small>
            ) : null}
          </label>

          <label>
            <span>출발일시</span>
            <input
              type="datetime-local"
              value={form.departureAt}
              onChange={(event) => setForm({ ...form, departureAt: event.target.value })}
              aria-invalid={Boolean(errors.departureAt)}
            />
            {errors.departureAt ? (
              <small className="form-error">{errors.departureAt}</small>
            ) : null}
          </label>

          <div className="form-grid">
            <label>
              <span>이동수단</span>
              <select
                value={form.transportMode}
                onChange={(event) =>
                  setForm({ ...form, transportMode: event.target.value as TransportMode })
                }
              >
                {transportModes.map((mode) => (
                  <option key={mode} value={mode}>
                    {transportModeLabels[mode]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>이동 우선조건</span>
              <select
                value={form.preference}
                onChange={(event) =>
                  setForm({ ...form, preference: event.target.value as RoutePreference })
                }
              >
                {routePreferences.map((preference) => (
                  <option key={preference} value={preference}>
                    {routePreferenceLabels[preference]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="toggle-row">
            <input
              type="checkbox"
              checked={form.lowVisibilitySafety}
              onChange={(event) =>
                setForm({ ...form, lowVisibilitySafety: event.target.checked })
              }
            />
            <span>야간·저시정 안전을 우선 반영</span>
          </label>

          <div className="quick-places" aria-label="자주 찾는 장소">
            <p>빠른 목적지</p>
            <div>
              {favoritePlaces.map((place) => (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => setForm({ ...form, destination: place.name })}
                >
                  <MapPin size={16} />
                  {place.name === 'Government Complex Sejong'
                    ? '정부세종청사'
                    : place.name === 'Sejong Lake Park'
                      ? '세종호수공원'
                      : '세종시청'}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="button button-primary button-wide">
            <CalendarClock size={18} />
            AI 경로 추천받기
          </button>
        </form>
      </div>
    </section>
  )
}
