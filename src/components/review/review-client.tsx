"use client"

import { useRef, useTransition } from "react"
import { motion } from "framer-motion"
import { FileText, Download, CheckCircle2, XCircle, Trophy } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { GlassCard, PageHeader, ProgressBar } from "@/src/components/shared/ui-primitives"
import { formatCurrency, formatPercent, getMonthName } from "@/src/lib/utils"
import { USER_NAME } from "@/src/lib/constants"

interface ReviewClientProps {
  data: Awaited<ReturnType<typeof import("@/src/lib/actions").getYearReviewData>>
}

export function ReviewClient({ data }: ReviewClientProps) {
  const reportRef = useRef<HTMLDivElement>(null)
  const [isPending, startTransition] = useTransition()
  const { year, completedGoals, incompleteGoals, totalSavings, savingsTarget, monthlyEntries, achievements, settings } = data
  const savingsProgress = savingsTarget > 0 ? (totalSavings / savingsTarget) * 100 : 0
  const totalGoals = completedGoals.length + incompleteGoals.length
  const completionRate = totalGoals > 0 ? (completedGoals.length / totalGoals) * 100 : 0

  const handleExportPDF = () => {
    startTransition(async () => {
      try {
        const { default: jsPDF } = await import("jspdf")
        const doc = new jsPDF()
        doc.setFontSize(20)
        doc.text(`${year} Year Review`, 20, 20)
        doc.setFontSize(12)
        doc.text(`Prepared for ${USER_NAME}`, 20, 30)
        doc.text(`Goals Completed: ${completedGoals.length}/${totalGoals} (${formatPercent(completionRate)})`, 20, 45)
        doc.text(`Total Savings: ${formatCurrency(totalSavings)}`, 20, 55)
        doc.text(`Savings Target: ${formatCurrency(savingsTarget)} (${formatPercent(savingsProgress)})`, 20, 65)
        doc.text("Completed Goals:", 20, 80)
        completedGoals.forEach((g, i) => {
          doc.text(`  • ${g.title} (${g.category})`, 25, 90 + i * 8)
        })
        doc.save(`year-review-${year}.pdf`)
        toast.success("PDF exported")
      } catch {
        toast.error("Failed to export PDF")
      }
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHeader
        title="Year Review"
        description={`Your ${year} annual report`}
        action={
          <Button onClick={handleExportPDF} disabled={isPending} className="rounded-2xl gap-2">
            <Download className="size-4" /> Export PDF
          </Button>
        }
      />

      <div ref={reportRef} className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="p-8 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="size-6 text-indigo-400" />
              <h2 className="text-2xl font-bold">{year} Annual Report</h2>
            </div>
            <p className="text-muted-foreground">A summary of your year for {USER_NAME}</p>
            <div className="grid gap-6 sm:grid-cols-2 mt-6">
              <div>
                <p className="text-sm text-muted-foreground">Goal Completion</p>
                <p className="text-3xl font-bold">{formatPercent(completionRate)}</p>
                <ProgressBar value={completionRate} color="#6366f1" className="mt-2" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Savings Progress</p>
                <p className="text-3xl font-bold">{formatCurrency(totalSavings)}</p>
                <ProgressBar value={Math.min(100, savingsProgress)} color="#8b5cf6" className="mt-2" />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2">
          <GlassCard className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="size-4" /> Completed ({completedGoals.length})
            </h3>
            <div className="space-y-2">
              {completedGoals.map((g) => (
                <div key={g.id} className="rounded-2xl p-3 bg-emerald-500/10 text-sm">
                  {g.title} <span className="text-muted-foreground">· {g.category}</span>
                </div>
              ))}
              {completedGoals.length === 0 && <p className="text-sm text-muted-foreground">No completed goals yet</p>}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-amber-400">
              <XCircle className="size-4" /> Incomplete ({incompleteGoals.length})
            </h3>
            <div className="space-y-2">
              {incompleteGoals.map((g) => (
                <div key={g.id} className="rounded-2xl p-3 bg-white/5 text-sm">
                  {g.title} <span className="text-muted-foreground">· {g.cost > 0 ? Math.round((g.funded / g.cost) * 100) : 0}%</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <GlassCard className="p-6">
          <h3 className="font-semibold mb-4">Savings Timeline</h3>
          <div className="space-y-2">
            {monthlyEntries.map((entry, i) => (
              <motion.div
                key={entry.month}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4"
              >
                <div className="w-20 text-sm text-muted-foreground">{getMonthName(entry.month)}</div>
                <div className="flex-1">
                  <ProgressBar
                    value={entry.savingsTarget > 0 ? (entry.savings / entry.savingsTarget) * 100 : 0}
                    color="#22c55e"
                  />
                </div>
                <div className="text-sm font-medium w-24 text-right">
                  {formatCurrency(entry.savings)}
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {achievements.length > 0 && (
          <GlassCard className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Trophy className="size-4 text-amber-400" /> Achievements Unlocked
            </h3>
            <div className="flex flex-wrap gap-2">
              {achievements.map((a) => (
                <span key={a.id} className="rounded-full bg-amber-500/20 px-3 py-1 text-sm text-amber-400">
                  {a.title}
                </span>
              ))}
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  )
}
