import styles from '@/pages/MapPage.module.css'

export function MapMountArea() {
  return (
    <section className={styles.mapCard} aria-label="지도 표시 영역">
      {/* The real map SDK will be mounted in this container in a later task. */}
      <div
        className={styles.mapMountArea}
        role="region"
        aria-label="지도 표시 영역"
        data-testid="map-mount-area"
      />
    </section>
  )
}
