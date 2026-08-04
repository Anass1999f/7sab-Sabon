"use client"

import { useState } from "react"
import { Bell, X, Check, Calendar, Trophy, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import type { Notification } from "@/src/types"

interface NotificationCenterProps {
  notifications: Notification[]
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
  onDelete: (id: string) => void
}

export function NotificationCenter({ notifications, onMarkRead, onMarkAllRead, onDelete }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = notifications.filter(n => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "reminder":
        return <Calendar className="size-4 text-blue-400" />
      case "achievement":
        return <Trophy className="size-4 text-yellow-400" />
      case "deadline":
        return <AlertCircle className="size-4 text-red-400" />
      default:
        return <Bell className="size-4 text-indigo-400" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "reminder":
        return "border-blue-500/20 bg-blue-500/5"
      case "achievement":
        return "border-yellow-500/20 bg-yellow-500/5"
      case "deadline":
        return "border-red-500/20 bg-red-500/5"
      default:
        return "border-indigo-500/20 bg-indigo-500/5"
    }
  }

  return (
    <div className="relative z-[60]">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] transition-colors"
      >
        <Bell className="size-5 text-foreground" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 size-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-medium"
          >
            {unreadCount}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[55]"
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-12 w-96 max-h-[500px] bg-zinc-900/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl z-[60] overflow-hidden"
            >
              <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
                <h3 className="font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={() => {
                      onMarkAllRead()
                      setIsOpen(false)
                    }}
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="overflow-y-auto max-h-[400px] p-2">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="size-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No notifications</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn(
                        "p-3 rounded-xl border mb-2 transition-all",
                        getNotificationColor(notification.type),
                        !notification.read && "bg-white/[0.05]"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{notification.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {!notification.read && (
                            <button
                              onClick={() => onMarkRead(notification.id)}
                              className="p-1 rounded hover:bg-white/[0.1] transition-colors"
                              title="Mark as read"
                            >
                              <Check className="size-3 text-green-400" />
                            </button>
                          )}
                          <button
                            onClick={() => onDelete(notification.id)}
                            className="p-1 rounded hover:bg-white/[0.1] transition-colors"
                            title="Delete"
                          >
                            <X className="size-3 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}