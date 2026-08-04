const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function setupDatabase() {
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
    
    console.log('Database setup completed successfully')
  } catch (error) {
    console.error('Error setting up database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupDatabase()