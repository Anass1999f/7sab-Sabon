"use client"

import { motion } from "framer-motion"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { GlassCard } from "@/src/components/shared/ui-primitives"

interface CategoryChartProps {
  data: { category: string; count: number }[]
}

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f97316", "#22c55e", "#06b6d4"]

export function CategoryChart({ data }: CategoryChartProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      <GlassCard className="p-6">
        <h3 className="font-semibold mb-4">Category Breakdown</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(24,24,27,0.95)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-2 mt-2 justify-center">
          {data.map((item, i) => (
            <div key={item.category} className="flex items-center gap-1.5 text-xs font-medium">
              <div className="size-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              {item.category}
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  )
}
