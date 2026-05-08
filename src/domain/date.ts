export function nowIso() {
  return new Date().toISOString()
}

export function startOfToday(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export function daysUntil(iso: string, from = new Date()) {
  const due = new Date(iso)
  return Math.ceil((due.getTime() - startOfToday(from).getTime()) / 86_400_000)
}

export function relativeDueLabel(iso: string, from = new Date()) {
  const days = daysUntil(iso, from)
  if (days <= 0) return 'Due now'
  if (days === 1) return 'Due tomorrow'
  return `Due in ${days} days`
}
