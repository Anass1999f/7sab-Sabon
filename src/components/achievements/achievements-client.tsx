"use client"

import { motion } from "framer-motion"
import { Trophy, Star, Target, Lock } from "lucide-react"
import { GlassCard, PageHeader, EmptyState } from "@/src/components/shared/ui-primitives"
import { CURRENT_YEAR } from "@/src/lib/constants"
import type { Achievement } from "@/src/types"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  trophy: Trophy, star: Star, target: Target,
}

const lockedAchievements = [
  { title: "Savings Master", description: "Save €10,000 in a year", icon: "trophy" },
  { title: "Journal Streak", description: "12 consecutive journal entries", icon: "star" },
  { title: "Goal Crusher", description: "Complete 20 goals", icon: "target" },
]

interface AchievementsClientProps {
  achievements: Achievement[]
}

export function AchievementsClient({ achievements }: AchievementsClientProps) {
  const unlockedTitles = new Set(achievements.map((a) => a.title))

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHeader
        title="Achievements"
        description={`Your ${CURRENT_YEAR} milestones and badges`}
      />

      {achievements.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No achievements yet"
          description="Complete goals and track your progress to unlock achievements."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {achievements.map((ach, i) => {
            const Icon = iconMap[ach.icon] ?? Trophy
            return (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="p-6 border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent">
                  <div className="flex items-center gap-4">
                    <div className="flex size-14 items-center justify-center rounded-3xl bg-amber-500/20">
                      <Icon className="size-7 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{ach.title}</h3>
                      <p className="text-sm text-muted-foreground">{ach.description}</p>
                      <p className="text-xs text-amber-400 mt-1">
                        Unlocked {new Date(ach.unlockedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>
      )}

      <div>
        <h3 className="font-semibold mb-4 text-muted-foreground">Locked</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {lockedAchievements
            .filter((a) => !unlockedTitles.has(a.title))
            .map((ach) => (
              <GlassCard key={ach.title} className="p-6 opacity-50">
                <div className="flex items-center gap-4">
                  <div className="flex size-14 items-center justify-center rounded-3xl bg-white/5">
                    <Lock className="size-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{ach.title}</h3>
                    <p className="text-sm text-muted-foreground">{ach.description}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
        </div>
      </div>
    </div>
  )
}
