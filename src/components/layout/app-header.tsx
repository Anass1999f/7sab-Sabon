"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { getGreeting } from "@/src/lib/utils"
import { USER_NAME } from "@/src/lib/constants"
import { NotificationCenter } from "@/src/components/notifications/notification-center"
import { YearSelector } from "@/src/components/shared/year-selector"
import { QuickActions } from "@/src/components/shared/quick-actions"
import type { Notification } from "@/src/types"

interface AppHeaderProps {
  notifications?: Notification[]
  currentYear?: number
  availableYears?: number[]
  onMarkRead?: (id: string) => void
  onMarkAllRead?: () => void
  onDeleteNotification?: (id: string) => void
  onYearChange?: (year: number) => void
}

export function AppHeader({
  notifications = [],
  currentYear = new Date().getFullYear(),
  availableYears = [new Date().getFullYear()],
  onMarkRead = () => {},
  onMarkAllRead = () => {},
  onDeleteNotification = () => {},
  onYearChange = () => {},
}: AppHeaderProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleNewGoal = () => {
    router.push("/goals#new")
  }

  const handleNewJournal = () => {
    router.push("/journal#new")
  }

  const handleSearch = () => {
    // Implement search functionality
    console.log("Searching for:", searchQuery)
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/[0.08] bg-zinc-950/80 backdrop-blur-xl px-6">
      <div className="lg:hidden">
        <p className="text-sm text-muted-foreground">{getGreeting()}</p>
        <p className="font-semibold tracking-tight">{USER_NAME.split(" ")[0]} 👋</p>
      </div>

      <div className="hidden lg:flex items-center gap-4 flex-1 max-w-lg">
        <YearSelector 
          currentYear={currentYear} 
          availableYears={availableYears} 
          onYearChange={onYearChange}
        />
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search goals, journal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-2 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <QuickActions 
          onNewGoal={handleNewGoal}
          onNewJournal={handleNewJournal}
          onSearch={handleSearch}
        />
        <NotificationCenter
          notifications={notifications}
          onMarkRead={onMarkRead}
          onMarkAllRead={onMarkAllRead}
          onDelete={onDeleteNotification}
        />
        <div className="size-8 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">
          AE
        </div>
      </div>
    </header>
  )
}
