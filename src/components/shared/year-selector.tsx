"use client"

import { useState } from "react"
import { ChevronDown, Calendar } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface YearSelectorProps {
  currentYear: number
  availableYears: number[]
  onYearChange: (year: number) => void
}

export function YearSelector({ currentYear, availableYears, onYearChange }: YearSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative z-[60]">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] transition-colors"
      >
        <Calendar className="size-4 text-indigo-400" />
        <span className="font-medium">{currentYear}</span>
        <ChevronDown className={cn("size-4 transition-transform", isOpen && "rotate-180")} />
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
              className="absolute right-0 top-12 w-40 bg-zinc-900/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl z-[60] overflow-hidden"
            >
              <div className="p-2">
                {availableYears.length === 0 ? (
                  <div className="text-center py-4 text-sm text-muted-foreground">
                    No years available
                  </div>
                ) : (
                  availableYears.map((year) => (
                    <button
                      key={year}
                      onClick={() => {
                        onYearChange(year)
                        setIsOpen(false)
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors block",
                        year === currentYear
                          ? "bg-indigo-500/20 text-indigo-300 font-medium"
                          : "hover:bg-white/[0.05] text-foreground"
                      )}
                    >
                      {year}
                    </button>
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