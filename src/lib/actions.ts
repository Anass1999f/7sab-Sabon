"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/src/lib/db"
import { CURRENT_YEAR } from "@/src/lib/constants"
import type { GoalFormData, JournalFormData, NotificationFormData } from "@/src/types"

async function logActivity(type: string, title: string, detail?: string) {
  await prisma.activity.create({ data: { type, title, detail } })
}

// Goals
export async function getGoals(year = CURRENT_YEAR) {
  try {
    return prisma.goal.findMany({ where: { year }, orderBy: [{ status: "asc" }, { priority: "desc" }] })
  } catch (error) {
    console.error("Error getting goals:", error)
    return []
  }
}

// Auto-allocate savings to goals based on priority
export async function autoAllocateSavings(amount: number, year?: number) {
  const settings = await getSettings()
  const targetYear = year || settings.currentYear
  const goals = await prisma.goal.findMany({ 
    where: { year: targetYear, status: "active" },
    orderBy: [{ priority: "desc" }, { createdAt: "asc" }]
  })

  const priorityOrder = { high: 3, medium: 2, low: 1 }
  const sortedGoals = goals.sort((a, b) => {
    const priorityDiff = priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder]
    if (priorityDiff !== 0) return priorityDiff
    return (a.cost - a.funded) - (b.cost - b.funded) // Fund cheaper goals first if same priority
  })

  let remaining = amount
  for (const goal of sortedGoals) {
    if (remaining <= 0) break
    const needed = goal.cost - goal.funded
    if (needed <= 0) continue

    const allocation = Math.min(remaining, needed)
    await prisma.goal.update({
      where: { id: goal.id },
      data: { funded: goal.funded + allocation, status: goal.funded + allocation >= goal.cost ? "completed" : "active" }
    })
    remaining -= allocation
  }

  revalidatePath("/goals")
  revalidatePath("/dashboard")
}

// Redistribute all existing savings when a new goal is created
export async function redistributeSavings(year?: number) {
  const settings = await getSettings()
  const targetYear = year || settings.currentYear
  const journals = await prisma.journalEntry.findMany({ where: { year: targetYear } })
  const totalSavings = journals.reduce((sum, j) => sum + j.savings, 0)
  
  // Reset only active goals for this year to 0 funded
  await prisma.goal.updateMany({
    where: { year: targetYear, status: "active" },
    data: { funded: 0 }
  })
  
  // Re-allocate all savings
  await autoAllocateSavings(totalSavings, targetYear)
  
  revalidatePath("/goals")
  revalidatePath("/dashboard")
}

export async function getGoal(id: string) {
  return prisma.goal.findUnique({ where: { id } })
}

export async function createGoal(data: GoalFormData) {
  const settings = await getSettings()
  const goalYear = data.year || settings.currentYear
  const goal = await prisma.goal.create({
    data: { ...data, deadline: data.deadline ? new Date(data.deadline) : null, year: goalYear, funded: 0 },
  })
  
  // Redistribute existing savings to include the new goal
  await redistributeSavings(goalYear)
  
  await logActivity("goal", `Created goal: ${goal.title}`)
  revalidatePath("/goals")
  revalidatePath("/dashboard")
  return goal
}

export async function updateGoal(id: string, data: Partial<GoalFormData>) {
  const goal = await prisma.goal.update({
    where: { id },
    data: {
      ...data,
      deadline: data.deadline !== undefined ? (data.deadline ? new Date(data.deadline) : null) : undefined,
    },
  })
  if (data.status === "completed") {
    await logActivity("goal", `Completed goal: ${goal.title}`)
    // Generate notification for achievement
    const settings = await getSettings()
    await createNotification({
      type: "achievement",
      title: "Goal Completed! 🎉",
      message: `Congratulations! You've completed your goal: ${goal.title}`,
      year: settings.currentYear
    })
  }
  revalidatePath("/goals")
  revalidatePath("/dashboard")
  return goal
}

export async function deleteGoal(id: string) {
  const goal = await prisma.goal.delete({ where: { id } })
  await logActivity("goal", `Deleted goal: ${goal.title}`)
  revalidatePath("/goals")
  revalidatePath("/dashboard")
}

// Journal
export async function getJournalEntries(year = CURRENT_YEAR) {
  try {
    return prisma.journalEntry.findMany({ where: { year }, orderBy: { month: "asc" } })
  } catch (error) {
    console.error("Error getting journal entries:", error)
    return []
  }
}

export async function getJournalEntry(month: number, year = CURRENT_YEAR) {
  return prisma.journalEntry.findUnique({ where: { month_year: { month, year } } })
}

export async function upsertJournalEntry(data: JournalFormData) {
  const settings = await getSettings()
  const savings = Math.max(0, data.income - data.expenses)
  const entry = await prisma.journalEntry.upsert({
    where: { month_year: { month: data.month, year: data.year } },
    create: { ...data, savings },
    update: { ...data, savings },
  })
  
  // Auto-allocate savings to goals
  await autoAllocateSavings(savings, data.year)
  
  await logActivity("journal", `Updated journal for ${data.month}/${data.year}`)
  revalidatePath("/journal")
  revalidatePath("/savings")
  revalidatePath("/dashboard")
  revalidatePath("/analytics")
  return entry
}

export async function deleteJournalEntry(month: number, year = CURRENT_YEAR) {
  await prisma.journalEntry.delete({ where: { month_year: { month, year } } })
  revalidatePath("/journal")
  revalidatePath("/savings")
  revalidatePath("/dashboard")
}

// Activities
export async function getRecentActivities(limit = 10) {
  return prisma.activity.findMany({ orderBy: { createdAt: "desc" }, take: limit })
}

// Achievements
export async function getAchievements(year = CURRENT_YEAR) {
  return prisma.achievement.findMany({ where: { year }, orderBy: { unlockedAt: "desc" } })
}

// Settings
export async function getSettings() {
  try {
    let settings = await prisma.settings.findUnique({ where: { id: "default" } })
    if (!settings) {
      settings = await prisma.settings.create({ data: { id: "default", currency: "Dh", savingsTarget: 120000 } })
    }
    // Force currency to Dh
    return { ...settings, currency: "Dh" }
  } catch (error) {
    console.error("Error getting settings:", error)
    return { id: "default", currency: "Dh", savingsTarget: 120000 }
  }
}

export async function updateSettings(data: {
  currency?: string
  theme?: string
  reminderDay?: number
  savingsTarget?: number
  currentYear?: number
  notificationsEnabled?: boolean
  emailNotifications?: string
}) {
  const settings = await prisma.settings.upsert({
    where: { id: "default" },
    create: { id: "default", ...data },
    update: data,
  })
  revalidatePath("/settings")
  revalidatePath("/dashboard")
  revalidatePath("/savings")
  return settings
}

// Dashboard stats
export async function getDashboardStats() {
  try {
    const settings = await getSettings()
    const year = settings.currentYear
    const [goals, journals, activities, notifications] = await Promise.all([
      prisma.goal.findMany({ where: { year } }),
      prisma.journalEntry.findMany({ where: { year }, orderBy: { month: "asc" } }),
      prisma.activity.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
      prisma.notification.findMany({ where: { year, read: false }, orderBy: { createdAt: "desc" }, take: 5 }),
    ])

    const totalGoals = goals.length
    const goalsCompleted = goals.filter((g) => g.status === "completed").length
    const totalCost = goals.reduce((sum, g) => sum + g.cost, 0)
    const totalFunded = goals.reduce((sum, g) => sum + g.funded, 0)
    const totalSavings = journals.reduce((sum, j) => sum + j.savings, 0)
    const currentMonth = new Date().getMonth() + 1
    const currentMonthEntry = journals.find((j) => j.month === currentMonth)
    const currentMonthSavings = currentMonthEntry?.savings ?? 0
    const remainingTarget = Math.max(0, totalCost - totalFunded)

    // Calculate monthly savings needed based on goal deadlines or year-end
    const now = new Date()
    let monthlyNeeded = 0
    
    if (goals.length > 0) {
      // For each goal, calculate how much is needed per month until its deadline
      const monthlyRequirements = goals.map(goal => {
        if (goal.status === "completed") return 0
        
        const remaining = goal.cost - goal.funded
        if (remaining <= 0) return 0
        
        const deadline = goal.deadline ? new Date(goal.deadline) : new Date(year, 11, 31) // year-end if no deadline
        const monthsRemaining = Math.max(1, Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)))
        
        return remaining / monthsRemaining
      })
      
      monthlyNeeded = monthlyRequirements.reduce((sum, req) => sum + req, 0)
    }

    const monthsWithEntries = new Set(journals.map((j) => j.month))
    let streak = 0
    for (let m = currentMonth; m >= 1; m--) {
      if (monthsWithEntries.has(m)) streak++
      else break
    }

    return {
      stats: {
        totalCost,
        totalFunded,
        totalSavings,
        remainingTarget,
        goalsCompleted,
        totalGoals,
        currentMonthSavings,
        monthlyNeeded,
        currentStreak: streak,
        onTrack: currentMonthSavings >= monthlyNeeded,
      },
      goals,
      journals,
      activities,
      notifications,
      settings,
    }
  } catch (error) {
    console.error("Error getting dashboard stats:", error)
    return {
      stats: {
        totalCost: 0,
        totalFunded: 0,
        totalSavings: 0,
        remainingTarget: 0,
        goalsCompleted: 0,
        totalGoals: 0,
        currentMonthSavings: 0,
        monthlyNeeded: 0,
        currentStreak: 0,
        onTrack: false,
      },
      goals: [],
      journals: [],
      activities: [],
      settings: { id: "default", currency: "MAD", savingsTarget: 120000 },
    }
  }
}

export async function getAnalyticsData() {
  const settings = await getSettings()
  const year = CURRENT_YEAR
  const [goals, journals] = await Promise.all([
    prisma.goal.findMany({ where: { year } }),
    prisma.journalEntry.findMany({ where: { year }, orderBy: { month: "asc" } }),
  ])

  const monthlySavings = journals.map((j) => ({
    month: j.month,
    savings: j.savings,
    target: j.savingsTarget,
  }))

  const savingsAmounts = journals.map((j) => j.savings)
  const avgSavings = savingsAmounts.length > 0 ? savingsAmounts.reduce((a, b) => a + b, 0) / savingsAmounts.length : 0

  let highestMonth = null as { month: number; amount: number } | null
  let lowestMonth = null as { month: number; amount: number } | null
  for (const j of journals) {
    if (!highestMonth || j.savings > highestMonth.amount) highestMonth = { month: j.month, amount: j.savings }
    if (!lowestMonth || j.savings < lowestMonth.amount) lowestMonth = { month: j.month, amount: j.savings }
  }

  const totalGoals = goals.length
  const completedGoals = goals.filter((g) => g.status === "completed").length
  const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0

  const categoryMap = new Map<string, { count: number; completed: number }>()
  for (const g of goals) {
    const existing = categoryMap.get(g.category) ?? { count: 0, completed: 0 }
    existing.count++
    if (g.status === "completed") existing.completed++
    categoryMap.set(g.category, existing)
  }

  return {
    avgSavings,
    highestMonth,
    lowestMonth,
    completionRate,
    monthlySavings,
    categoryBreakdown: Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      ...data,
    })),
    goals,
    journals,
    settings,
  }
}

export async function getYearReviewData() {
  const settings = await getSettings()
  const year = CURRENT_YEAR
  const [goals, journals, achievements] = await Promise.all([
    prisma.goal.findMany({ where: { year } }),
    prisma.journalEntry.findMany({ where: { year }, orderBy: { month: "asc" } }),
    prisma.achievement.findMany({ where: { year } }),
  ])

  return {
    year,
    completedGoals: goals.filter((g) => g.status === "completed"),
    incompleteGoals: goals.filter((g) => g.status !== "completed"),
    totalSavings: journals.reduce((sum, j) => sum + j.savings, 0),
    savingsTarget: settings.savingsTarget,
    monthlyEntries: journals,
    achievements,
    settings,
  }
}

export async function exportAllData() {
  const [goals, journals, activities, achievements, settings] = await Promise.all([
    prisma.goal.findMany(),
    prisma.journalEntry.findMany(),
    prisma.activity.findMany(),
    prisma.achievement.findMany(),
    prisma.settings.findMany(),
  ])
  return { goals, journals, activities, achievements, settings, exportedAt: new Date().toISOString() }
}

export async function importAllData(data: {
  goals?: Parameters<typeof prisma.goal.create>[0]["data"][]
  journals?: Parameters<typeof prisma.journalEntry.create>[0]["data"][]
  achievements?: Parameters<typeof prisma.achievement.create>[0]["data"][]
  settings?: Parameters<typeof prisma.settings.create>[0]["data"][]
}) {
  await prisma.$transaction([
    prisma.goal.deleteMany(),
    prisma.journalEntry.deleteMany(),
    prisma.activity.deleteMany(),
    prisma.achievement.deleteMany(),
  ])

  if (data.goals?.length) {
    for (const goal of data.goals) {
      await prisma.goal.create({ data: goal })
    }
  }
  if (data.journals?.length) {
    for (const journal of data.journals) {
      await prisma.journalEntry.create({ data: journal })
    }
  }
  if (data.achievements?.length) {
    for (const achievement of data.achievements) {
      await prisma.achievement.create({ data: achievement })
    }
  }
  if (data.settings?.length) {
    for (const setting of data.settings) {
      if (!setting) continue
      await prisma.settings.upsert({
        where: { id: setting.id ?? "default" },
        create: { id: "default", ...setting },
        update: setting,
      })
    }
  }

  revalidatePath("/", "layout")
}

export async function resetAllData() {
  await prisma.$transaction([
    prisma.goal.deleteMany(),
    prisma.journalEntry.deleteMany(),
    prisma.activity.deleteMany(),
    prisma.achievement.deleteMany(),
  ])
  revalidatePath("/", "layout")
}

export async function seedDatabase() {
  try {
    // Force update settings to ensure currency is Dh
    await prisma.settings.upsert({
      where: { id: "default" },
      create: { id: "default", currency: "Dh", savingsTarget: 120000 },
      update: { currency: "Dh" },
    })
  } catch (error) {
    console.error("Error seeding database:", error)
  }
}

// Multi-Year Support
export async function getYears() {
  const goals = await prisma.goal.findMany({ select: { year: true }, distinct: ["year"] })
  const journals = await prisma.journalEntry.findMany({ select: { year: true }, distinct: ["year"] })
  const years = new Set([...goals.map(g => g.year), ...journals.map(j => j.year)])
  return Array.from(years).sort((a, b) => b - a)
}

export async function getYearData(year: number) {
  const [goals, journals, achievements] = await Promise.all([
    prisma.goal.findMany({ where: { year } }),
    prisma.journalEntry.findMany({ where: { year }, orderBy: { month: "asc" } }),
    prisma.achievement.findMany({ where: { year } }),
  ])
  return { goals, journals, achievements }
}

// Notification System
export async function getNotifications(year?: number) {
  const settings = await getSettings()
  const targetYear = year || settings.currentYear
  return prisma.notification.findMany({ 
    where: { year: targetYear }, 
    orderBy: { createdAt: "desc" },
    take: 20
  })
}

export async function createNotification(data: NotificationFormData) {
  const notification = await prisma.notification.create({ data })
  revalidatePath("/dashboard")
  revalidatePath("/settings")
  return notification
}

export async function markNotificationRead(id: string) {
  await prisma.notification.update({ where: { id }, data: { read: true } })
  revalidatePath("/dashboard")
  revalidatePath("/settings")
}

export async function markAllNotificationsRead(year?: number) {
  const settings = await getSettings()
  const targetYear = year || settings.currentYear
  await prisma.notification.updateMany({ where: { year: targetYear, read: false }, data: { read: true } })
  revalidatePath("/dashboard")
  revalidatePath("/settings")
}

export async function deleteNotification(id: string) {
  await prisma.notification.delete({ where: { id } })
  revalidatePath("/dashboard")
  revalidatePath("/settings")
}

export async function generateReminderNotifications() {
  const settings = await getSettings()
  if (!settings.notificationsEnabled) return

  const currentMonth = new Date().getMonth() + 1
  const currentYear = settings.currentYear

  // Check if journal entry exists for current month
  const journalEntry = await prisma.journalEntry.findUnique({
    where: { month_year: { month: currentMonth, year: currentYear } }
  })

  if (!journalEntry) {
    await createNotification({
      type: "reminder",
      title: "Monthly Journal Entry Due",
      message: `Don't forget to complete your journal entry for ${currentMonth}/${currentYear}`,
      year: currentYear
    })
  }

  // Check for upcoming goal deadlines
  const goals = await prisma.goal.findMany({ 
    where: { year: currentYear, status: "active" },
    orderBy: { deadline: "asc" }
  })

  const now = new Date()
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  for (const goal of goals) {
    if (goal.deadline) {
      const deadline = new Date(goal.deadline)
      if (deadline <= nextWeek && deadline > now) {
        await createNotification({
          type: "deadline",
          title: `Goal Deadline Approaching: ${goal.title}`,
          message: `Your goal "${goal.title}" is due on ${deadline.toLocaleDateString()}`,
          year: currentYear
        })
      }
    }
  }
}
