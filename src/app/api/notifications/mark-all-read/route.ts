import { NextResponse } from "next/server"
import { markAllNotificationsRead } from "@/src/lib/actions"

export async function POST() {
  try {
    await markAllNotificationsRead()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}