import { NextResponse } from "next/server"
import { getSettings, getNotifications, getYears } from "@/src/lib/actions"

export async function GET() {
  try {
    const [settings, notifications, years] = await Promise.all([
      getSettings(),
      getNotifications(),
      getYears(),
    ])

    return NextResponse.json({
      notifications,
      currentYear: (settings as any).currentYear || new Date().getFullYear(),
      availableYears: years,
    })
  } catch (error) {
    console.error("Error fetching initial data:", error)
    return NextResponse.json(
      { notifications: [], currentYear: new Date().getFullYear(), availableYears: [new Date().getFullYear()] },
      { status: 500 }
    )
  }
}