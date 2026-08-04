import { getSettings } from "@/src/lib/actions"
import { SettingsClient } from "@/src/components/settings/settings-client"

export default async function SettingsPage() {
  const settings = await getSettings()
  return <SettingsClient initialSettings={settings} />
}
