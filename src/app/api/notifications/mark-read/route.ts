import { NextResponse } from "next/server"
import { markNotificationRead } from "@/src/lib/actions"

export async function POST(request: Request) {
  try {
    const { id } = await request.json()
    await markNotificationRead(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}