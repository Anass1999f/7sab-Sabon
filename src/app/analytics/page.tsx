import { getAnalyticsData } from "@/src/lib/actions"
import { AnalyticsClient } from "@/src/components/analytics/analytics-client"

export default async function AnalyticsPage() {
  const data = await getAnalyticsData()
  return <AnalyticsClient data={data} />
}
