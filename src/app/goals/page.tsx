import { getGoals } from "@/src/lib/actions"
import { GoalsClient } from "@/src/components/goals/goals-client"

export default async function GoalsPage() {
  const goals = await getGoals()
  return <GoalsClient initialGoals={goals} />
}
