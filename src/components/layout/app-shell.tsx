"use client"

import { AppSidebar, MobileNav } from "./app-sidebar"
import { AppHeader } from "./app-header"
import { useState, useEffect } from "react"
import type { Notification } from "@/src/types"

export function AppShell({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [availableYears, setAvailableYears] = useState([new Date().getFullYear()])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load initial data
    async function loadData() {
      try {
        const response = await fetch('/api/init-data')
        if (response.ok) {
          const data = await response.json()
          setNotifications(data.notifications || [])
          setCurrentYear(data.currentYear || new Date().getFullYear())
          setAvailableYears(data.availableYears || [new Date().getFullYear()])
        }
      } catch (error) {
        console.error('Failed to load initial data:', error)
      }
    }
    loadData()
  }, [])

  const handleMarkRead = async (id: string) => {
    try {
      await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', { method: 'POST' })
      setNotifications(notifications.map(n => ({ ...n, read: true })))
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  const handleDeleteNotification = async (id: string) => {
    try {
      await fetch('/api/notifications/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      setNotifications(notifications.filter(n => n.id !== id))
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  const handleYearChange = async (year: number) => {
    try {
      await fetch('/api/settings/update-year', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year })
      })
      setCurrentYear(year)
      window.location.reload()
    } catch (error) {
      console.error('Failed to update year:', error)
    }
  }

  if (!mounted) {
    return (
      <div className="flex min-h-screen bg-zinc-950">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-purple-500/5 to-zinc-950 pointer-events-none" />
        <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBMMDQwIDBIMjBMMCAyMHpNMjAgNDBMMjAgMjBNMCAyMEw0MCAyME0yMCAyMEw0MCA0MCIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4wMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20 pointer-events-none" />
        <AppSidebar />
        <div className="flex flex-1 flex-col relative">
          <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/[0.08] bg-zinc-950/80 backdrop-blur-xl px-6" />
          <main className="flex-1 overflow-auto p-6 pb-24 lg:pb-6">{children}</main>
          <MobileNav />
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-purple-500/5 to-zinc-950 pointer-events-none" />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBMMDQwIDBIMjBMMCAyMHpNMjAgNDBMMjAgMjBNMCAyMEw0MCAyME0yMCAyMEw0MCA0MCIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4wMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20 pointer-events-none" />
      <AppSidebar />
      <div className="flex flex-1 flex-col relative">
        <AppHeader
          notifications={notifications}
          currentYear={currentYear}
          availableYears={availableYears}
          onMarkRead={handleMarkRead}
          onMarkAllRead={handleMarkAllRead}
          onDeleteNotification={handleDeleteNotification}
          onYearChange={handleYearChange}
        />
        <main className="flex-1 overflow-auto p-6 pb-24 lg:pb-6">{children}</main>
        <MobileNav />
      </div>
    </div>
  )
}
