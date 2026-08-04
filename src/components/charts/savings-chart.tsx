"use client"

import { motion } from "framer-motion"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { GlassCard } from "@/src/components/shared/ui-primitives"
import { getShortMonthName } from "@/src/lib/utils"

interface SavingsChartProps {
  data: { month: number; savings: number }[]
  currency?: string
}

export function SavingsChart({ data }: SavingsChartProps) {
  const chartData = data.map((d) => ({
    name: getShortMonthName(d.month),
    savings: d.savings,
  }))

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <GlassCard className="p-6">
        <h3 className="font-semibold mb-4">Savings Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="name" stroke="#71717a" fontSize={12} />
              <YAxis stroke="#71717a" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(24,24,27,0.95)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="savings"
                stroke="#6366f1"
                fill="url(#savingsGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </motion.div>
  )
}
