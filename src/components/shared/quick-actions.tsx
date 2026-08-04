"use client"

import { useEffect, useState } from "react"
import { Plus, BookOpen, Target, Keyboard, Command } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { KEYBOARD_SHORTCUTS } from "@/src/lib/constants"

interface QuickActionsProps {
  onNewGoal: () => void
  onNewJournal: () => void
  onSearch: () => void
}

export function QuickActions({ onNewGoal, onNewJournal, onSearch }: QuickActionsProps) {
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [isPressed, setIsPressed] = useState<string | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Alt key combinations
      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case 'n':
            e.preventDefault()
            setIsPressed('newGoal')
            onNewGoal()
            setTimeout(() => setIsPressed(null), 200)
            break
          case 'm':
            e.preventDefault()
            setIsPressed('newJournal')
            onNewJournal()
            setTimeout(() => setIsPressed(null), 200)
            break
          case '/':
            e.preventDefault()
            setIsPressed('search')
            onSearch()
            setTimeout(() => setIsPressed(null), 200)
            break
        }
      }

      // Escape to close shortcuts modal
      if (e.key === 'Escape') {
        setShowShortcuts(false)
      }

      // ? to show shortcuts
      if (e.key === '?' && !e.altKey && !e.ctrlKey && !e.metaKey) {
        setShowShortcuts(!showShortcuts)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onNewGoal, onNewJournal, onSearch, showShortcuts])

  const shortcuts = [
    { key: KEYBOARD_SHORTCUTS.newGoal, label: "New Goal", action: onNewGoal },
    { key: KEYBOARD_SHORTCUTS.newJournal, label: "New Journal Entry", action: onNewJournal },
    { key: KEYBOARD_SHORTCUTS.search, label: "Search", action: onSearch },
    { key: KEYBOARD_SHORTCUTS.goToDashboard, label: "Go to Dashboard" },
    { key: KEYBOARD_SHORTCUTS.goToGoals, label: "Go to Goals" },
    { key: KEYBOARD_SHORTCUTS.goToJournal, label: "Go to Journal" },
    { key: KEYBOARD_SHORTCUTS.goToSavings, label: "Go to Savings" },
    { key: KEYBOARD_SHORTCUTS.goToSettings, label: "Go to Settings" },
    { key: "?", label: "Show Shortcuts" },
  ]

  return (
    <>
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNewGoal}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 transition-colors",
            isPressed === 'newGoal' && "bg-indigo-500/40"
          )}
          title={`New Goal (${KEYBOARD_SHORTCUTS.newGoal})`}
        >
          <Plus className="size-4 text-indigo-400" />
          <span className="text-sm font-medium hidden sm:inline">Goal</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNewJournal}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 transition-colors",
            isPressed === 'newJournal' && "bg-emerald-500/40"
          )}
          title={`New Journal (${KEYBOARD_SHORTCUTS.newJournal})`}
        >
          <BookOpen className="size-4 text-emerald-400" />
          <span className="text-sm font-medium hidden sm:inline">Journal</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowShortcuts(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] transition-colors"
          title="Keyboard Shortcuts (?)"
        >
          <Keyboard className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium hidden sm:inline">Shortcuts</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {showShortcuts && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShortcuts(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 flex items-center justify-center z-[100] p-4"
            >
              <div className="bg-zinc-900 border border-white/[0.08] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[600px] overflow-hidden">
                <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-500/20">
                      <Command className="size-5 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Keyboard Shortcuts</h3>
                      <p className="text-sm text-muted-foreground">Quick actions for power users</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowShortcuts(false)}
                    className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors"
                  >
                    <kbd className="px-2 py-1 rounded bg-white/[0.05] text-xs">ESC</kbd>
                  </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[400px]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {shortcuts.map((shortcut) => (
                      <div
                        key={shortcut.key}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
                      >
                        <span className="text-sm text-foreground">{shortcut.label}</span>
                        <kbd className="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-xs font-mono">
                          {shortcut.key}
                        </kbd>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                    <p className="text-sm text-indigo-300">
                      <strong>Tip:</strong> Press <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] text-xs">?</kbd> anytime to show this panel
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}