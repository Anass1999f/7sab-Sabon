import { getYearReviewData } from "@/src/lib/actions"
import { ReviewClient } from "@/src/components/review/review-client"

export default async function ReviewPage() {
  const data = await getYearReviewData()
  return <ReviewClient data={data} />
}
