"use client"

import { useState, useTransition, useRef } from "react"
import { Save, Download, Upload, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { GlassCard, PageHeader, Select } from "@/src/components/shared/ui-primitives"
import { downloadJSON } from "@/src/lib/utils"
import { updateSettings, exportAllData, importAllData, resetAllData } from "@/src/lib/actions"
import type { Settings as SettingsType } from "@/src/types"

interface SettingsClientProps {
  initialSettings: SettingsType
}

export function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [settings, setSettings] = useState({
    ...initialSettings,
    currentYear: initialSettings.currentYear || new Date().getFullYear(),
  })
  const [isPending, startTransition] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateSettings({
          currency: settings.currency,
          theme: settings.theme,
          savingsTarget: settings.savingsTarget,
          currentYear: (settings as any).currentYear || new Date().getFullYear(),
        })
        toast.success("Settings saved")
      } catch {
        toast.error("Failed to save settings")
      }
    })
  }

  const handleExport = () => {
    startTransition(async () => {
      try {
        const data = await exportAllData()
        downloadJSON(data, `backup-${new Date().toISOString().split("T")[0]}.json`)
        toast.success("Data exported")
      } catch {
        toast.error("Export failed")
      }
    })
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      startTransition(async () => {
        try {
          const data = JSON.parse(reader.result as string)
          await importAllData(data)
          toast.success("Data imported")
          window.location.reload()
        } catch {
          toast.error("Invalid file")
        }
      })
    }
    reader.readAsText(file)
  }

  const handleReset = () => {
    if (!confirm("Delete all data?")) return
    startTransition(async () => {
      try {
        await resetAllData()
        toast.success("Data reset")
        window.location.reload()
      } catch {
        toast.error("Reset failed")
      }
    })
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <PageHeader title="Settings" />

      <GlassCard className="p-6 space-y-4">
        <div>
          <label className="text-sm text-muted-foreground">Current Year</label>
          <input
            type="number"
            value={(settings as any).currentYear || new Date().getFullYear()}
            onChange={(e) => setSettings({ ...settings, currentYear: Number(e.target.value) })}
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Annual Savings Target (Dh)</label>
          <input
            type="number"
            value={settings.savingsTarget}
            onChange={(e) => setSettings({ ...settings, savingsTarget: Number(e.target.value) })}
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Theme</label>
          <Select
            value={settings.theme}
            onChange={(value) => setSettings({ ...settings, theme: value })}
            options={[
              { value: "dark", label: "Dark" },
              { value: "light", label: "Light" }
            ]}
            className="mt-1"
          />
        </div>

        <Button onClick={handleSave} disabled={isPending} className="w-full rounded-xl gap-2">
          <Save className="size-4" /> Save
        </Button>
      </GlassCard>

      <GlassCard className="p-6 space-y-4">
        <h3 className="font-semibold">Data</h3>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport} disabled={isPending} className="rounded-xl gap-2 flex-1">
            <Download className="size-4" /> Export
          </Button>
          <Button variant="outline" onClick={() => fileRef.current?.click()} disabled={isPending} className="rounded-xl gap-2 flex-1">
            <Upload className="size-4" /> Import
          </Button>
          <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
        </div>
        <Button variant="destructive" onClick={handleReset} disabled={isPending} className="w-full rounded-xl gap-2">
          <Trash2 className="size-4" /> Reset All Data
        </Button>
      </GlassCard>
    </div>
  )
}
