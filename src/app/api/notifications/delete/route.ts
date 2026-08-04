import { NextResponse } from "next/server"
import { deleteNotification } from "@/src/lib/actions"

export async function POST(request: Request) {
  try {
    const { id } = await request.json()
    await deleteNotification(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting notification:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}