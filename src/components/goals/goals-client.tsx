"use client"

import { useState, useTransition, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Target, Rocket, Heart, Brain, Dumbbell, Book, Wallet, Star, Flag, Zap,
  Plus, Pencil, Trash2, X,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { GlassCard, ProgressBar, Badge, PageHeader, EmptyState, Select } from "@/src/components/shared/ui-primitives"
import { getPriorityColor, getGoalStatusColor, formatCurrency } from "@/src/lib/utils"
import { GoalFeasibility } from "./goal-feasibility"
import { GOAL_CATEGORIES, GOAL_PRIORITIES, GOAL_STATUSES, GOAL_ICONS, GOAL_COLORS } from "@/src/lib/constants"
import { createGoal, updateGoal, deleteGoal, getSettings } from "@/src/lib/actions"
import { YearSelector } from "@/src/components/shared/year-selector"
import { CostEstimator } from "./cost-estimator"
import type { Goal, GoalFormData } from "@/src/types"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  target: Target, rocket: Rocket, heart: Heart, brain: Brain,
  dumbbell: Dumbbell, book: Book, wallet: Wallet, star: Star, flag: Flag, zap: Zap,
}

const defaultForm: GoalFormData = {
  title: "", description: "", category: "Personal", priority: "medium",
  cost: 0, deadline: null, status: "active", color: "#6366f1", icon: "target",
}

interface GoalsClientProps {
  initialGoals: Goal[]
}

export function GoalsClient({ initialGoals }: GoalsClientProps) {
  const [goals, setGoals] = useState(initialGoals)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<GoalFormData>(defaultForm)
  const [isPending, startTransition] = useTransition()
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [settings, setSettings] = useState<any>(null)

  // Load settings on mount
  useEffect(() => {
    getSettings().then(s => {
      setSettings(s)
      setCurrentYear(s.currentYear || new Date().getFullYear())
    })
  }, [])

  const filteredGoals = goals.filter(g => g.year === currentYear)

  const openCreate = () => {
    setForm(defaultForm)
    setEditingId(null)
    setShowForm(true)
  }

  const openEdit = (goal: Goal) => {
    setForm({
      title: goal.title,
      description: goal.description ?? "",
      category: goal.category,
      priority: goal.priority,
      cost: goal.cost,
      deadline: goal.deadline ? new Date(goal.deadline).toISOString().split("T")[0] : null,
      status: goal.status,
      color: goal.color,
      icon: goal.icon,
    })
    setEditingId(goal.id)
    setShowForm(true)
  }

  const handleSubmit = () => {
    if (!form.title.trim()) {
      toast.error("Title is required")
      return
    }
    startTransition(async () => {
      try {
        const formData = { ...form, year: currentYear }
        if (editingId) {
          const updated = await updateGoal(editingId, formData)
          setGoals((prev) => prev.map((g) => (g.id === editingId ? updated : g)))
          toast.success("Goal updated")
        } else {
          const created = await createGoal(formData)
          setGoals((prev) => [...prev, created])
          toast.success("Goal created")
        }
        setShowForm(false)
      } catch {
        toast.error("Something went wrong")
      }
    })
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteGoal(id)
        setGoals((prev) => prev.filter((g) => g.id !== id))
        toast.success("Goal deleted")
      } catch {
        toast.error("Failed to delete")
      }
    })
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="Goals"
        description="Track and manage your yearly goals"
        action={
          <div className="flex gap-3">
            <YearSelector
              currentYear={currentYear}
              availableYears={[...new Set(goals.map(g => g.year))].sort((a, b) => b - a)}
              onYearChange={setCurrentYear}
            />
            <Button onClick={openCreate} className="rounded-xl gap-2">
              <Plus className="size-4" /> New Goal
            </Button>
          </div>
        }
      />

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <GlassCard className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{editingId ? "Edit Goal" : "New Goal"}</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowForm(false)} className="rounded-xl">
                  <X className="size-4" />
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-sm text-muted-foreground">Title</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm text-muted-foreground">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={2}
                    className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Category</label>
                  <Select
                    value={form.category}
                    onChange={(value) => setForm({ ...form, category: value })}
                    options={GOAL_CATEGORIES.map(c => ({ value: c, label: c }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Priority</label>
                  <Select
                    value={form.priority}
                    onChange={(value) => setForm({ ...form, priority: value })}
                    options={GOAL_PRIORITIES.map(p => ({ value: p, label: p }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Cost (Dh)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.cost || ""}
                    onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })}
                    className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                  <GoalFeasibility cost={form.cost} deadline={form.deadline} monthlySavingsCapacity={settings?.savingsTarget / 12 || 10000} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Status</label>
                  <Select
                    value={form.status}
                    onChange={(value) => setForm({ ...form, status: value })}
                    options={GOAL_STATUSES.map(s => ({ value: s, label: s }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Deadline</label>
                  <input
                    type="date"
                    value={form.deadline ?? ""}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value || null })}
                    className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Color</label>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {GOAL_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setForm({ ...form, color: c })}
                        className={`size-7 rounded-full border-2 ${form.color === c ? "border-white" : "border-transparent"}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Icon</label>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {GOAL_ICONS.map((icon) => {
                      const Icon = iconMap[icon] ?? Target
                      return (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => setForm({ ...form, icon })}
                          className={`flex size-9 items-center justify-center rounded-xl border ${form.icon === icon ? "border-indigo-400 bg-indigo-500/20" : "border-white/10 bg-white/5"}`}
                        >
                          <Icon className="size-4" />
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowForm(false)} className="rounded-2xl">Cancel</Button>
                <Button onClick={handleSubmit} disabled={isPending} className="rounded-2xl">
                  {editingId ? "Update" : "Create"}
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredGoals.length === 0 ? (
        <EmptyState
          icon={Target}
          title={`No goals for ${currentYear}`}
          description="Create your first goal to start tracking your progress."
          action={<Button onClick={openCreate} className="rounded-xl"><Plus className="size-4 mr-2" />Create Goal</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredGoals.map((goal, i) => {
            const Icon = iconMap[goal.icon] ?? Target
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard className="p-5 hover:bg-white/[0.07] transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex size-10 items-center justify-center rounded-2xl"
                        style={{ backgroundColor: `${goal.color}20` }}
                      >
                        <span style={{ color: goal.color }}>
                          <Icon className="size-5" />
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{goal.title}</h3>
                        <p className="text-xs text-muted-foreground">{goal.category}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon-xs" onClick={() => openEdit(goal)} className="rounded-xl">
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon-xs" onClick={() => handleDelete(goal.id)} className="rounded-xl text-red-400">
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                  {goal.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{goal.description}</p>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={getPriorityColor(goal.priority)}>{goal.priority}</Badge>
                    <span className={`text-xs capitalize ${getGoalStatusColor(goal.status)}`}>{goal.status}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Cost: {formatCurrency(goal.cost)}</span>
                    <span className="text-emerald-400">Funded: {formatCurrency(goal.funded)}</span>
                  </div>
                  <ProgressBar value={goal.cost > 0 ? (goal.funded / goal.cost) * 100 : 0} color={goal.color} />
                  <p className="text-xs text-muted-foreground mt-1 text-right">{goal.cost > 0 ? Math.round((goal.funded / goal.cost) * 100) : 0}% complete</p>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>
      )}

      {filteredGoals.length > 0 && (
        <CostEstimator 
          goals={filteredGoals} 
          monthlySavingsCapacity={settings?.savingsTarget / 12 || 10000}
        />
      )}
    </div>
  )
}
