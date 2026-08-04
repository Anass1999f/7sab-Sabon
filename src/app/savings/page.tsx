import { getJournalEntries, getSettings } from "@/src/lib/actions"
import { SavingsClient } from "@/src/components/savings/savings-client"

export default async function SavingsPage() {
  const [entries, settings] = await Promise.all([getJournalEntries(), getSettings()])
  return (
    <SavingsClient
      entries={entries}
      currency="Dh"
      savingsTarget={settings.savingsTarget}
    />
  )
}
