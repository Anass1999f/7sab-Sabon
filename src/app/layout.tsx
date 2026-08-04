import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/src/components/shared/theme-provider"
import { AppToaster } from "@/src/components/shared/app-toaster"
import { AppShell } from "@/src/components/layout/app-shell"
import prisma from "@/src/lib/db"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Yearly Goals Tracker",
  description: "Personal yearly goals, savings, and journal tracker for Anas El Jaouhari",
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Initialize database on first load
  try {
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
      update: { currency: 'Dh' }
    })
  } catch (error) {
    console.error('Error initializing database:', error)
  }

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-zinc-950 text-foreground" suppressHydrationWarning>
        <ThemeProvider>
          <AppShell>{children}</AppShell>
          <AppToaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
