"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string
  subtitle?: string
  icon: LucideIcon
  gradient?: string
  delay?: number
}

export function StatCard({ title, value, subtitle, icon: Icon, gradient, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="rounded-xl border border-white/[0.1] bg-white/[0.05] p-6 hover:bg-white/[0.08] transition-colors">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <div className="flex size-10 items-center justify-center rounded-lg bg-white/[0.1]">
            <Icon className="size-5 text-muted-foreground" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
