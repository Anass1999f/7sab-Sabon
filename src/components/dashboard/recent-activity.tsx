"use client"

import { motion } from "framer-motion"
import { Clock } from "lucide-react"
import { GlassCard } from "@/src/components/shared/ui-primitives"
import { timeAgo } from "@/src/lib/utils"
import type { Activity } from "@/src/types"

interface RecentActivityProps {
  activities: Activity[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const recent = activities.slice(0, 3)

  return (
    <GlassCard className="p-6">
      <h3 className="font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity yet</p>
        ) : (
          recent.map((activity, i) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3 rounded-xl p-3 hover:bg-white/5 transition-colors"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                <Clock className="size-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{activity.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {timeAgo(activity.createdAt)}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </GlassCard>
  )
}
