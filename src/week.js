export function getStartOfWeek(date = new Date()) {
  const currentDate = new Date(date)
  currentDate.setHours(0, 0, 0, 0)

  const dayOfWeek = currentDate.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek

  currentDate.setDate(currentDate.getDate() + mondayOffset)
  return currentDate
}

export function shiftWeek(date, offset) {
  const shiftedDate = new Date(date)
  shiftedDate.setHours(0, 0, 0, 0)
  shiftedDate.setDate(shiftedDate.getDate() + offset * 7)
  return shiftedDate
}

export function formatWeekLabel(date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date)
}
