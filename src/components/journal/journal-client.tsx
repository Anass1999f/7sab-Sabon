"use client"

import { useState, useTransition } from "react"
import { motion } from "framer-motion"
import { BookOpen, Save } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { GlassCard, PageHeader } from "@/src/components/shared/ui-primitives"
import { MOOD_LABELS, CURRENT_YEAR } from "@/src/lib/constants"
import { getMonthName, formatCurrency, calculateSavings } from "@/src/lib/utils"
import { upsertJournalEntry } from "@/src/lib/actions"
import type { JournalEntry, JournalFormData } from "@/src/types"

interface JournalClientProps {
  initialEntries: JournalEntry[]
  currency: string
}

export function JournalClient({ initialEntries }: JournalClientProps) {
  const currency = "Dh"
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [isPending, startTransition] = useTransition()

  const existing = initialEntries.find((e) => e.month === selectedMonth)
  const [form, setForm] = useState<JournalFormData>({
    month: selectedMonth,
    year: CURRENT_YEAR,
    income: existing?.income ?? 0,
    expenses: existing?.expenses ?? 0,
    savingsTarget: existing?.savingsTarget ?? 1000,
    accomplishments: existing?.accomplishments ?? "",
    reflection: existing?.reflection ?? "",
    mood: existing?.mood ?? 3,
    habits: existing?.habits ?? "",
    notes: existing?.notes ?? "",
  })

  const selectMonth = (month: number) => {
    setSelectedMonth(month)
    const entry = initialEntries.find((e) => e.month === month)
    setForm({
      month,
      year: CURRENT_YEAR,
      income: entry?.income ?? 0,
      expenses: entry?.expenses ?? 0,
      savingsTarget: entry?.savingsTarget ?? 1000,
      accomplishments: entry?.accomplishments ?? "",
      reflection: entry?.reflection ?? "",
      mood: entry?.mood ?? 3,
      habits: entry?.habits ?? "",
      notes: entry?.notes ?? "",
    })
  }

  const savings = calculateSavings(form.income, form.expenses)

  const handleSave = () => {
    startTransition(async () => {
      try {
        await upsertJournalEntry({ ...form, month: selectedMonth })
        toast.success(`Saved ${getMonthName(selectedMonth)} entry`)
      } catch {
        toast.error("Failed to save")
      }
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Monthly Journal"
        description="Track income, expenses, and reflections each month"
      />

      <div className="flex gap-2 overflow-x-auto pb-2">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
          const hasEntry = initialEntries.some((e) => e.month === month)
          return (
            <button
              key={month}
              onClick={() => selectMonth(month)}
              className={`shrink-0 rounded-2xl px-4 py-2 text-sm font-medium transition-colors ${
                selectedMonth === month
                  ? "bg-indigo-500 text-white"
                  : hasEntry
                    ? "bg-white/10 text-white"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10"
              }`}
            >
              {getMonthName(month).slice(0, 3)}
            </button>
          )
        })}
      </div>

      <motion.div key={selectedMonth} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard className="p-6 space-y-6">
          <h2 className="text-xl font-semibold">{getMonthName(selectedMonth)} {CURRENT_YEAR}</h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-sm text-muted-foreground">Income</label>
              <input
                type="number"
                value={form.income || ""}
                onChange={(e) => setForm({ ...form, income: Number(e.target.value) })}
                className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Expenses</label>
              <input
                type="number"
                value={form.expenses || ""}
                onChange={(e) => setForm({ ...form, expenses: Number(e.target.value) })}
                className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Savings (auto)</label>
              <div className="mt-1 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">
                {formatCurrency(savings)}
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Savings Target</label>
            <input
              type="number"
              value={form.savingsTarget || ""}
              onChange={(e) => setForm({ ...form, savingsTarget: Number(e.target.value) })}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Mood</label>
            <div className="flex gap-3 mt-2">
              {MOOD_LABELS.map((emoji, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setForm({ ...form, mood: i + 1 })}
                  className={`text-2xl rounded-2xl p-2 transition-transform hover:scale-110 ${form.mood === i + 1 ? "bg-white/10 ring-2 ring-indigo-400" : ""}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {(["accomplishments", "reflection", "habits", "notes"] as const).map((field) => (
            <div key={field}>
              <label className="text-sm text-muted-foreground capitalize">{field}</label>
              <textarea
                value={form[field] ?? ""}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                rows={3}
                className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm focus:outline-none resize-none"
              />
            </div>
          ))}

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isPending} className="rounded-2xl gap-2">
              <Save className="size-4" /> Save Entry
            </Button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}
