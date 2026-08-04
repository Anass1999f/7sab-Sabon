"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Target,
  BookOpen,
  PiggyBank,
  BarChart3,
  Trophy,
  FileText,
  Settings,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { APP_NAME } from "@/src/lib/constants"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/savings", label: "Savings", icon: PiggyBank },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-white/[0.08] bg-zinc-950/50 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/[0.08]">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 shadow-lg shadow-indigo-500/10 border border-indigo-500/20">
          <Sparkles className="size-5 text-indigo-400" />
        </div>
        <div>
          <p className="font-semibold text-sm tracking-tight">{APP_NAME}</p>
          <p className="text-xs text-muted-foreground">2026</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/[0.08] text-white shadow-sm border border-white/[0.08]"
                    : "text-muted-foreground hover:bg-white/[0.04] hover:text-white"
                )}
              >
                <Icon className={cn("size-4", isActive && "text-indigo-400")} />
                {item.label}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/[0.08]">
        <div className="rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4 border border-indigo-500/10">
          <p className="text-xs font-medium text-indigo-300">Personal Tracker</p>
          <p className="text-xs text-muted-foreground mt-1">Anas El Jaouhari</p>
        </div>
      </div>
    </aside>
  )
}

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 border-t border-white/[0.08] bg-zinc-950/95 backdrop-blur-xl px-2 py-2">
      <div className="flex justify-around">
        {navItems.slice(0, 4).map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 p-2 rounded-xl text-xs font-medium transition-colors",
                isActive ? "text-indigo-400" : "text-muted-foreground"
              )}
            >
              <Icon className="size-5" />
              <span className="truncate max-w-[56px]">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
