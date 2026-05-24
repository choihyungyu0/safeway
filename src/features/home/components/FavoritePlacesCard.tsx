import { Building2, Home, Plus, School } from 'lucide-react'
import type { FavoritePlaceItem } from '@/features/home/home.types'
import styles from '@/pages/HomePage.module.css'

const favoritePlaces: FavoritePlaceItem[] = [
  {
    id: 'home',
    label: '집',
    address: '세종시 새롬동',
    icon: <Home size={22} />,
  },
  {
    id: 'office',
    label: '회사',
    address: '세종시 나성동',
    icon: <Building2 size={22} />,
  },
  {
    id: 'school',
    label: '세종고등학교',
    address: '세종시 보람동',
    icon: <School size={22} />,
  },
]

export function FavoritePlacesCard() {
  return (
    <section className={styles.infoCard} aria-labelledby="favorite-places-title">
      <div className={styles.cardTitleRow}>
        <h2 id="favorite-places-title">자주 사용하는 장소</h2>
        <button type="button">관리</button>
      </div>

      <div className={styles.favoriteGrid}>
        {favoritePlaces.map((place) => (
          <button key={place.id} type="button" className={styles.favoriteButton}>
            <span aria-hidden="true">{place.icon}</span>
            <strong>{place.label}</strong>
            <small>{place.address}</small>
          </button>
        ))}
        <button type="button" className={styles.favoriteButton}>
          <span aria-hidden="true">
            <Plus size={22} />
          </span>
          <strong>추가하기</strong>
          <small>새 장소 등록</small>
        </button>
      </div>
    </section>
  )
}
