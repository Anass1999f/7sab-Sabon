"use client"

import { useMemo } from "react"
import { Check, AlertTriangle, X } from "lucide-react"
import { formatCurrency } from "@/src/lib/utils"

interface GoalFeasibilityProps {
  cost: number
  deadline?: string | null
  monthlySavingsCapacity?: number
}

export function GoalFeasibility({ cost, deadline, monthlySavingsCapacity = 10000 }: GoalFeasibilityProps) {
  const feasibility = useMemo(() => {
    if (!cost || cost <= 0) return { level: "none", message: "Enter a cost", color: "text-muted-foreground", icon: null }
    
    const now = new Date()
    const targetDate = deadline ? new Date(deadline) : new Date(now.getFullYear(), 11, 31)
    const monthsRemaining = Math.max(1, Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)))
    const requiredMonthly = cost / monthsRemaining
    
    if (requiredMonthly <= monthlySavingsCapacity * 0.5) {
      return { 
        level: "easy", 
        message: `Easily achievable (${formatCurrency(requiredMonthly)}/month needed)`, 
        color: "text-emerald-400", 
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/20",
        icon: Check 
      }
    } else if (requiredMonthly <= monthlySavingsCapacity) {
      return { 
        level: "moderate", 
        message: `Achievable (${formatCurrency(requiredMonthly)}/month needed)`, 
        color: "text-amber-400", 
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/20",
        icon: AlertTriangle 
      }
    } else if (requiredMonthly <= monthlySavingsCapacity * 1.5) {
      return { 
        level: "challenging", 
        message: `Challenging (${formatCurrency(requiredMonthly)}/month needed)`, 
        color: "text-orange-400", 
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-500/20",
        icon: AlertTriangle 
      }
    } else {
      return { 
        level: "difficult", 
        message: `Very difficult (${formatCurrency(requiredMonthly)}/month needed)`, 
        color: "text-red-400", 
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/20",
        icon: X 
      }
    }
  }, [cost, deadline, monthlySavingsCapacity])

  if (feasibility.level === "none") return null

  const Icon = feasibility.icon

  return (
    <div className={`flex items-center gap-2 text-xs p-2 rounded-lg border ${feasibility.bgColor} ${feasibility.borderColor} ${feasibility.color}`}>
      {Icon && <Icon className="size-3.5" />}
      <span>{feasibility.message}</span>
    </div>
  )
}
