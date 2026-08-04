import type { Goal, JournalEntry, Activity, Achievement, Settings, Notification } from "@prisma/client"

export type { Goal, JournalEntry, Activity, Achievement, Settings, Notification }

export type GoalFormData = {
  title: string
  description?: string
  category: string
  priority: string
  cost: number
  deadline?: string | null
  status: string
  color: string
  icon: string
  year?: number
}

export type JournalFormData = {
  month: number
  year: number
  income: number
  expenses: number
  savingsTarget: number
  accomplishments?: string
  reflection?: string
  mood: number
  habits?: string
  notes?: string
}

export type DashboardStats = {
  totalCost: number
  totalFunded: number
  totalSavings: number
  remainingTarget: number
  goalsCompleted: number
  totalGoals: number
  currentMonthSavings: number
  monthlyNeeded: number
  currentStreak: number
  onTrack: boolean
}

export type AnalyticsData = {
  avgSavings: number
  highestMonth: { month: string; amount: number } | null
  lowestMonth: { month: string; amount: number } | null
  completionRate: number
  monthlySavings: { month: string; savings: number; target: number }[]
  categoryBreakdown: { category: string; count: number; completed: number }[]
}

export type YearReviewData = {
  year: number
  completedGoals: Goal[]
  incompleteGoals: Goal[]
  totalSavings: number
  savingsTarget: number
  monthlyEntries: JournalEntry[]
  achievements: Achievement[]
}

export type NotificationFormData = {
  type: string
  title: string
  message: string
  year: number
}

export type QuickAction = {
  id: string
  label: string
  icon: string
  shortcut: string
  action: () => void
}
