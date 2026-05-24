import styles from '@/pages/HomePage.module.css'

const conditionRows = [
  { label: '폭염', value: '주의 32°C', tone: 'warning' },
  { label: '미세먼지 (PM2.5)', value: '좋음 18', tone: 'success' },
  { label: '안개', value: '낮음 10km+', tone: 'calm' },
]

export function CurrentConditionCard() {
  return (
    <section className={styles.infoCard} aria-labelledby="current-condition-title">
      <div className={styles.cardTitleRow}>
        <h2 id="current-condition-title">현재 상황 한눈에</h2>
      </div>

      <dl className={styles.conditionList}>
        {conditionRows.map((row) => (
          <div key={row.label} className={styles.conditionRow}>
            <dt>
              <span className={`${styles.statusDot} ${styles[row.tone]}`} aria-hidden="true" />
              {row.label}
            </dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
