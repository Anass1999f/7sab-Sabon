"use client"

import { motion } from "framer-motion"
import { PiggyBank, TrendingUp, TrendingDown, Target } from "lucide-react"
import { GlassCard, PageHeader, ProgressBar } from "@/src/components/shared/ui-primitives"
import { SavingsChart } from "@/src/components/charts/savings-chart"
import { formatCurrency, getMonthName } from "@/src/lib/utils"
import { CURRENT_YEAR } from "@/src/lib/constants"
import type { JournalEntry } from "@/src/types"

interface SavingsClientProps {
  entries: JournalEntry[]
  currency: string
  savingsTarget: number
}

export function SavingsClient({ entries, savingsTarget }: SavingsClientProps) {
  const totalSavings = entries.reduce((sum, e) => sum + e.savings, 0)
  const monthlyAvg = entries.length > 0 ? totalSavings / entries.length : 0
  const remaining = Math.max(0, savingsTarget - totalSavings)
  const progress = savingsTarget > 0 ? (totalSavings / savingsTarget) * 100 : 0

  const sorted = [...entries].sort((a, b) => b.savings - a.savings)
  const best = sorted[0]
  const worst = sorted[sorted.length - 1]

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <PageHeader
        title="Savings"
        description={`Track your ${CURRENT_YEAR} savings progress`}
      />

      <GlassCard className="p-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Savings</p>
            <p className="text-4xl font-bold mt-1">{formatCurrency(totalSavings)}</p>
          </div>
          <div className="flex size-14 items-center justify-center rounded-3xl bg-purple-500/20">
            <PiggyBank className="size-7 text-purple-400" />
          </div>
        </div>
        <ProgressBar value={Math.min(100, progress)} color="#8b5cf6" className="h-3" />
        <p className="text-sm text-muted-foreground mt-2">
          {formatCurrency(remaining)} remaining to reach {formatCurrency(savingsTarget)} target
        </p>
      </GlassCard>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { title: "Monthly Average", value: formatCurrency(monthlyAvg), icon: TrendingUp, color: "bg-blue-500/20" },
          { title: "Best Month", value: best ? `${getMonthName(best.month)}: ${formatCurrency(best.savings)}` : "—", icon: TrendingUp, color: "bg-emerald-500/20" },
          { title: "Lowest Month", value: worst ? `${getMonthName(worst.month)}: ${formatCurrency(worst.savings)}` : "—", icon: TrendingDown, color: "bg-amber-500/20" },
        ].map((stat, i) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <GlassCard className="p-5">
              <div className="flex items-center gap-3">
                <div className={`flex size-10 items-center justify-center rounded-2xl ${stat.color}`}>
                  <stat.icon className="size-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                  <p className="text-sm font-semibold">{stat.value}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <SavingsChart data={entries.map((e) => ({ month: e.month, savings: e.savings }))} />

      <GlassCard className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Target className="size-4" /> Monthly Breakdown
        </h3>
        <div className="space-y-3">
          {entries.map((entry) => {
            const diff = entry.savings - entry.savingsTarget
            return (
              <div key={entry.month} className="flex items-center justify-between rounded-2xl p-3 hover:bg-white/5">
                <span className="text-sm font-medium">{getMonthName(entry.month)}</span>
                <div className="flex items-center gap-4 text-sm">
                  <span>{formatCurrency(entry.savings)}</span>
                  <span className={diff >= 0 ? "text-emerald-400" : "text-red-400"}>
                    {diff >= 0 ? "+" : ""}{formatCurrency(diff)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </GlassCard>
    </div>
  )
}
