import { format, formatDistanceToNow } from "date-fns"

export function formatCurrency(amount: number, currency = "Dh"): string {
  // Format number with thousand separators
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
  return `${formatted} Dh`
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good Morning"
  if (hour < 18) return "Good Afternoon"
  return "Good Evening"
}

export function getMonthName(month: number): string {
  return format(new Date(2026, month - 1, 1), "MMMM")
}

export function getShortMonthName(month: number): string {
  return format(new Date(2026, month - 1, 1), "MMM")
}

export function timeAgo(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function calculateProgress(current: number, target: number): number {
  if (target <= 0) return 0
  return Math.min(100, Math.round((current / target) * 100))
}

export function calculateSavings(income: number, expenses: number): number {
  return Math.max(0, income - expenses)
}

export function getStreakFromJournals(
  entries: { month: number; year: number }[],
  year: number
): number {
  const monthsWithEntries = new Set(
    entries.filter((e) => e.year === year).map((e) => e.month)
  )
  let streak = 0
  const currentMonth = new Date().getMonth() + 1
  for (let m = currentMonth; m >= 1; m--) {
    if (monthsWithEntries.has(m)) streak++
    else break
  }
  return streak
}

export function getGoalStatusColor(status: string): string {
  switch (status) {
    case "completed":
      return "text-emerald-400"
    case "paused":
      return "text-amber-400"
    case "cancelled":
      return "text-red-400"
    default:
      return "text-blue-400"
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "high":
      return "bg-red-500/20 text-red-400"
    case "low":
      return "bg-zinc-500/20 text-zinc-400"
    default:
      return "bg-amber-500/20 text-amber-400"
  }
}

export function downloadJSON(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
