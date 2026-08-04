import { NextResponse } from "next/server"
import prisma from "@/src/lib/db"

export async function POST() {
  try {
    // Create default settings
    await prisma.settings.upsert({
      where: { id: 'default' },
      create: { 
        id: 'default', 
        currency: 'Dh', 
        savingsTarget: 120000,
        currentYear: 2026,
        notificationsEnabled: true,
        userName: 'Anas El Jaouhari'
      },
      update: {}
    })
    
    return NextResponse.json({ success: true, message: 'Database initialized' })
  } catch (error) {
    console.error('Error initializing database:', error)
    return NextResponse.json({ success: false, error: 'Failed to initialize database' }, { status: 500 })
  }
}