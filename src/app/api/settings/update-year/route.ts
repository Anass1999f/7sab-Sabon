import { NextResponse } from "next/server"
import { updateSettings } from "@/src/lib/actions"

export async function POST(request: Request) {
  try {
    const { year } = await request.json()
    await updateSettings({ currentYear: year })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating year:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}