"use client"

import { motion } from "framer-motion"
import { BarChart3, TrendingUp, TrendingDown, Target, CheckCircle2 } from "lucide-react"
import { GlassCard, PageHeader } from "@/src/components/shared/ui-primitives"
import { StatCard as DashboardStatCard } from "@/src/components/dashboard/stat-card"
import { SavingsChart } from "@/src/components/charts/savings-chart"
import { GoalChart } from "@/src/components/charts/goal-chart"
import { CategoryChart } from "@/src/components/charts/category-chart"
import { formatCurrency, formatPercent, getMonthName } from "@/src/lib/utils"
import { CURRENT_YEAR } from "@/src/lib/constants"

interface AnalyticsClientProps {
  data: Awaited<ReturnType<typeof import("@/src/lib/actions").getAnalyticsData>>
}

export function AnalyticsClient({ data }: AnalyticsClientProps) {
  const { avgSavings, highestMonth, lowestMonth, completionRate, monthlySavings, categoryBreakdown, goals, settings } = data

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <PageHeader
        title="Analytics"
        description={`Insights and trends for ${CURRENT_YEAR}`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          title="Avg Monthly Savings"
          value={formatCurrency(avgSavings)}
          icon={BarChart3}
          gradient="bg-indigo-500/20"
          delay={0.1}
        />
        <DashboardStatCard
          title="Highest Month"
          value={highestMonth ? formatCurrency(highestMonth.amount) : "—"}
          subtitle={highestMonth ? getMonthName(highestMonth.month) : undefined}
          icon={TrendingUp}
          gradient="bg-emerald-500/20"
          delay={0.15}
        />
        <DashboardStatCard
          title="Lowest Month"
          value={lowestMonth ? formatCurrency(lowestMonth.amount) : "—"}
          subtitle={lowestMonth ? getMonthName(lowestMonth.month) : undefined}
          icon={TrendingDown}
          gradient="bg-red-500/20"
          delay={0.2}
        />
        <DashboardStatCard
          title="Completion Rate"
          value={formatPercent(completionRate)}
          subtitle={`${goals.filter((g) => g.status === "completed").length} goals done`}
          icon={CheckCircle2}
          gradient="bg-purple-500/20"
          delay={0.25}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SavingsChart data={monthlySavings.map((m) => ({ month: m.month, savings: m.savings }))} />
        <GoalChart goals={goals} />
      </div>

      <CategoryChart data={categoryBreakdown.map((c) => ({ category: c.category, count: c.count }))} />

      <GlassCard className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Target className="size-4" /> Goal Completion by Category
        </h3>
        <div className="space-y-3">
          {categoryBreakdown.map((cat, i) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between rounded-2xl p-3 hover:bg-white/5"
            >
              <span className="text-sm font-medium">{cat.category}</span>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground">{cat.completed}/{cat.count}</span>
                <span className="text-indigo-400">
                  {cat.count > 0 ? formatPercent((cat.completed / cat.count) * 100) : "0%"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
