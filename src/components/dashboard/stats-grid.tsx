"use client"

import {
  Wallet,
  Calendar,
  PiggyBank,
  Target,
  CheckCircle2,
  TrendingUp,
  Coins,
} from "lucide-react"
import { StatCard } from "./stat-card"
import { formatCurrency, formatPercent } from "@/src/lib/utils"
import type { DashboardStats } from "@/src/types"

interface StatsGridProps {
  stats: DashboardStats
  currency: string
}

export function StatsGrid({ stats, currency }: StatsGridProps) {
  const progress = stats.totalCost > 0 ? (stats.totalFunded / stats.totalCost) * 100 : 0

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Total Goals"
        value={String(stats.totalGoals)}
        subtitle={`${stats.goalsCompleted} completed`}
        icon={Target}
        delay={0.1}
      />
      <StatCard
        title="Total Saved"
        value={formatCurrency(stats.totalSavings)}
        subtitle="Year to date"
        icon={Coins}
        delay={0.15}
      />
      <StatCard
        title="Remaining"
        value={formatCurrency(stats.remainingTarget)}
        subtitle="To complete goals"
        icon={PiggyBank}
        delay={0.2}
      />
    </div>
  )
}
