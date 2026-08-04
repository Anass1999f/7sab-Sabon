import { getJournalEntries, getSettings } from "@/src/lib/actions"
import { JournalClient } from "@/src/components/journal/journal-client"

export default async function JournalPage() {
  const entries = await getJournalEntries()
  return <JournalClient initialEntries={entries} currency="Dh" />
}
