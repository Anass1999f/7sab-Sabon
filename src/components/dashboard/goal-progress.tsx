"use client"

import { motion } from "framer-motion"
import { Target } from "lucide-react"
import { GlassCard, ProgressBar } from "@/src/components/shared/ui-primitives"
import { formatCurrency } from "@/src/lib/utils"
import type { Goal } from "@/src/types"

interface GoalProgressProps {
  goals: Goal[]
}

export function GoalProgress({ goals }: GoalProgressProps) {
  const activeGoals = goals.filter((g) => g.status !== "cancelled").slice(0, 3)

  return (
    <GlassCard className="p-6">
      <h3 className="font-semibold mb-4">Active Goals</h3>
      <div className="space-y-3">
        {activeGoals.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active goals yet</p>
        ) : (
          activeGoals.map((goal, i) => {
            const progress = goal.cost > 0 ? (goal.funded / goal.cost) * 100 : 0
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{goal.title}</p>
                    <p className="text-xs text-muted-foreground">{goal.category}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatCurrency(goal.funded)} / {formatCurrency(goal.cost)}
                  </span>
                </div>
                <ProgressBar value={progress} color="#6366f1" className="h-2" />
              </motion.div>
            )
          })
        )}
      </div>
    </GlassCard>
  )
}
