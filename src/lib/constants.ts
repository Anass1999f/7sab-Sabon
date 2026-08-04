export const APP_NAME = "Yearly Goals Tracker"
export const USER_NAME = "Anas El Jaouhari"
export const CURRENT_YEAR = new Date().getFullYear()
export const DEFAULT_CURRENCY = "Dh"

export const GOAL_CATEGORIES = [
  "Career",
  "Finance",
  "Health",
  "Learning",
  "Personal",
  "Relationships",
] as const

export const GOAL_PRIORITIES = ["low", "medium", "high"] as const
export const GOAL_STATUSES = ["active", "completed", "paused", "cancelled"] as const

export const MOOD_LABELS = ["😞", "😕", "😐", "🙂", "😄"] as const

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/goals", label: "Goals", icon: "Target" },
  { href: "/journal", label: "Journal", icon: "BookOpen" },
  { href: "/savings", label: "Savings", icon: "PiggyBank" },
  { href: "/analytics", label: "Analytics", icon: "BarChart3" },
  { href: "/achievements", label: "Achievements", icon: "Trophy" },
  { href: "/review", label: "Year Review", icon: "FileText" },
  { href: "/settings", label: "Settings", icon: "Settings" },
] as const

export const GOAL_ICONS = [
  "target",
  "rocket",
  "heart",
  "brain",
  "dumbbell",
  "book",
  "wallet",
  "star",
  "flag",
  "zap",
] as const

export const GOAL_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
] as const

export const NOTIFICATION_TYPES = [
  "reminder",
  "achievement",
  "deadline",
  "milestone",
  "system",
] as const

export const KEYBOARD_SHORTCUTS = {
  goToDashboard: "Alt+D",
  goToGoals: "Alt+G",
  goToJournal: "Alt+J",
  goToSavings: "Alt+S",
  goToSettings: "Alt+,",
  newGoal: "Alt+N",
  newJournal: "Alt+M",
  quickAdd: "Alt+Q",
  search: "Alt+/",
} as const
