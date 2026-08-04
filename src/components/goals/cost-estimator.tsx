"use client"

import { useMemo } from "react"
import { Calculator, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"
import { GlassCard } from "@/src/components/shared/ui-primitives"
import { formatCurrency } from "@/src/lib/utils"
import type { Goal } from "@/src/types"

interface CostEstimatorProps {
  goals: Goal[]
  monthlySavingsCapacity: number
}

export function CostEstimator({ goals, monthlySavingsCapacity }: CostEstimatorProps) {
  const analysis = useMemo(() => {
    const activeGoals = goals.filter(g => g.status === "active")
    const totalCost = activeGoals.reduce((sum, g) => sum + g.cost, 0)
    const totalFunded = activeGoals.reduce((sum, g) => sum + g.funded, 0)
    const remaining = totalCost - totalFunded

    // Find earliest deadline
    const goalsWithDeadlines = activeGoals.filter(g => g.deadline)
    const earliestDeadline = goalsWithDeadlines.length > 0 
      ? new Date(Math.min(...goalsWithDeadlines.map(g => new Date(g.deadline!).getTime())))
      : null

    // Calculate months remaining based on deadline or default to 12 months
    const monthsRemaining = earliestDeadline
      ? Math.max(1, Math.ceil((earliestDeadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)))
      : 12

    // Calculate required monthly savings
    const requiredMonthly = monthsRemaining > 0 ? remaining / monthsRemaining : remaining

    // Determine feasibility
    const isFeasible = requiredMonthly <= monthlySavingsCapacity
    const monthsToComplete = monthlySavingsCapacity > 0 ? Math.ceil(remaining / monthlySavingsCapacity) : Infinity

    return {
      totalCost,
      totalFunded,
      remaining,
      monthsRemaining,
      requiredMonthly,
      isFeasible,
      monthsToComplete,
      activeGoalsCount: activeGoals.length,
      earliestDeadline
    }
  }, [goals, monthlySavingsCapacity])

  if (analysis.activeGoalsCount === 0) {
    return (
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Calculator className="size-5" />
          <p className="text-sm">No active goals to analyze</p>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard className="p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="size-5 text-indigo-400" />
        <h3 className="font-semibold">Cost Analysis</h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Total Cost</p>
          <p className="text-lg font-semibold">{formatCurrency(analysis.totalCost)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Already Funded</p>
          <p className="text-lg font-semibold text-emerald-400">{formatCurrency(analysis.totalFunded)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Remaining Needed</p>
          <p className="text-lg font-semibold text-amber-400">{formatCurrency(analysis.remaining)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Required Monthly</p>
          <p className={`text-lg font-semibold ${analysis.isFeasible ? 'text-emerald-400' : 'text-red-400'}`}>
            {formatCurrency(analysis.requiredMonthly)}
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-white/10">
        {analysis.isFeasible ? (
          <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle className="size-5 text-emerald-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-emerald-300">Feasible</p>
              <p className="text-xs text-muted-foreground mt-1">
                With your current savings capacity, you can complete your goals in {analysis.monthsToComplete} months.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <AlertCircle className="size-5 text-red-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-300">Not Feasible</p>
              <p className="text-xs text-muted-foreground mt-1">
                You need {formatCurrency(analysis.requiredMonthly - monthlySavingsCapacity)} more per month. 
                Consider extending deadlines or reducing goal costs.
              </p>
            </div>
          </div>
        )}
      </div>

      {analysis.earliestDeadline && (
        <div className="text-xs text-muted-foreground">
          Based on earliest deadline: {analysis.earliestDeadline.toLocaleDateString()}
        </div>
      )}
    </GlassCard>
  )
}