export const formatMinutes = (minutes: number) => `${minutes}분`

export const formatMeters = (meters: number) => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)}km`
  }

  return `${meters}m`
}

export const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
