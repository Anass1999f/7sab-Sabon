import { getDashboardStats } from "@/src/lib/actions"
import { Hero } from "@/src/components/dashboard/hero"
import { StatsGrid } from "@/src/components/dashboard/stats-grid"
import { SavingsChart } from "@/src/components/charts/savings-chart"
import { GoalChart } from "@/src/components/charts/goal-chart"
import { MonthlyChart } from "@/src/components/charts/monthly-chart"
import { CategoryChart } from "@/src/components/charts/category-chart"
import { RecentActivity } from "@/src/components/dashboard/recent-activity"
import { GoalProgress } from "@/src/components/dashboard/goal-progress"

export default async function DashboardPage() {
  const { stats, goals, journals, activities, settings } = await getDashboardStats()
  
  // Filter goals by current year
  const currentYearGoals = goals.filter(g => g.year === settings.currentYear)

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <Hero />
      <StatsGrid stats={stats} currency="Dh" />
      <div className="grid gap-6 lg:grid-cols-2">
        <GoalProgress goals={currentYearGoals} />
        <RecentActivity activities={activities} />
      </div>
    </div>
  )
}
