"use client"

import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { GlassCard } from "@/src/components/shared/ui-primitives"
import type { Goal } from "@/src/types"

interface GoalChartProps {
  goals: Goal[]
}

export function GoalChart({ goals }: GoalChartProps) {
  const chartData = goals.slice(0, 6).map((g) => ({
    name: g.title.length > 15 ? g.title.slice(0, 15) + "…" : g.title,
    progress: g.cost > 0 ? (g.funded / g.cost) * 100 : 0,
    fill: g.color,
  }))

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
      <GlassCard className="p-6">
        <h3 className="font-semibold mb-4">Goal Progress</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis type="number" domain={[0, 100]} stroke="#71717a" fontSize={12} />
              <YAxis type="category" dataKey="name" stroke="#71717a" fontSize={11} width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(24,24,27,0.95)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="progress" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </motion.div>
  )
}
