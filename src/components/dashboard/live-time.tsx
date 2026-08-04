"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

export function LiveTime() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    })
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Clock className="size-4" />
      <span>{formatDate(time)}</span>
      <span className="text-primary font-medium">{formatTime(time)}</span>
    </div>
  )
}
