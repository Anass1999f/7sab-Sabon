import { getAchievements } from "@/src/lib/actions"
import { AchievementsClient } from "@/src/components/achievements/achievements-client"

export default async function AchievementsPage() {
  const achievements = await getAchievements()
  return <AchievementsClient achievements={achievements} />
}
