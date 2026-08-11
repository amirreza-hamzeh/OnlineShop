export const formatOrderDate = value => {
  if (!value) return 'Date unavailable'
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  const date = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(value)
  return isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleDateString()
}
