# Yearly Goals Tracker - Project Resume

## Overview
A comprehensive personal development and financial tracking application built with Next.js 16, React 19, Prisma, and SQLite. This application helps users track yearly goals, monthly journal entries, savings progress, and achievements with an intuitive dark-themed interface.

## Tech Stack

### Frontend Framework
- **Next.js 16.2.12** - React framework with App Router
- **React 19.2.4** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling
- **Framer Motion 12.43.0** - Animations

### Database & Backend
- **Prisma 6.19.3** - ORM for database management
- **SQLite** - Local database for data persistence
- **Zod 4.4.3** - Schema validation

### UI Components & Libraries
- **shadcn/ui** - Component library
- **Base UI 1.6.0** - React component primitives
- **Lucide React 1.28.0** - Icon library
- **Recharts 3.10.1** - Data visualization
- **next-themes 0.4.6** - Theme management
- **Sonner 2.0.7** - Toast notifications
- **date-fns 4.4.0** - Date manipulation
- **html2canvas 1.4.1** - Screenshot functionality
- **jspdf 4.2.1** - PDF generation

## Core Features

### 1. Dashboard
**File:** `src/app/dashboard/page.tsx`
**Components:** `src/components/dashboard/`

- **Hero Section** - Personalized welcome with user name and motivational messaging
- **Stats Grid** - Key metrics including:
  - Total goals count
  - Completed goals percentage
  - Total savings amount
  - Monthly savings needed
  - Current month savings
  - Goal completion streak
- **Live Time Display** - Real-time clock showing current date and time
- **Savings Calculator** - Shows required monthly savings to meet goals
- **Goal Progress Overview** - Visual progress bars for all active goals
- **Recent Activity Feed** - Timeline of recent actions and achievements
- **Interactive Charts:**
  - Savings Chart - Monthly savings trends
  - Goal Chart - Goal completion status
  - Monthly Chart - Monthly completion rates
  - Category Chart - Goals distribution by category

### 2. Goals Management
**File:** `src/app/goals/page.tsx`
**Components:** `src/components/goals/`

- **Goal Creation** - Create new goals with:
  - Title and description
  - Category selection (Personal, Professional, Health, Financial, etc.)
  - Priority levels (High, Medium, Low)
  - Cost estimation
  - Deadline setting
  - Custom color and icon selection
- **Goal Tracking** - Monitor progress with:
  - Funding progress bars
  - Status indicators (Active, Completed)
  - Deadline countdowns
  - Priority sorting
- **Auto-Allocation** - Smart savings distribution:
  - Automatically allocates savings to goals based on priority
  - Prioritizes high-priority goals
  - Redistributes savings when new goals are added
  - Updates goal status when fully funded
- **Goal Feasibility Analysis** - AI-powered analysis of goal achievability
- **Goal Editing/Deletion** - Full CRUD operations with activity logging

### 3. Monthly Journal
**File:** `src/app/journal/page.tsx`
**Components:** `src/components/journal/`

- **Monthly Entries** - Track each month with:
  - Income recording
  - Expense tracking
  - Automatic savings calculation (Income - Expenses)
  - Savings target setting
  - Accomplishments documentation
  - Personal reflections
  - Mood tracking (1-5 scale)
  - Habit tracking
  - Additional notes
- **Monthly History** - View and edit past entries
- **Automatic Savings Allocation** - Journal entries automatically trigger savings distribution to goals
- **Streak Tracking** - Maintains consecutive entry streaks
- **Month Navigation** - Easy switching between months

### 4. Savings Tracker
**File:** `src/app/savings/page.tsx`
**Components:** `src/components/savings/`

- **Savings Overview** - Comprehensive savings dashboard
- **Goal Funding Breakdown** - See exactly how savings are allocated
- **Progress Visualization** - Visual representation of savings vs targets
- **Monthly Savings History** - Track savings patterns over time
- **Savings Target Progress** - Compare against annual savings goals
- **Export Functionality** - Generate PDF reports of savings data

### 5. Analytics
**File:** `src/app/analytics/page.tsx`
**Components:** `src/components/analytics/`

- **Performance Metrics** - Detailed analysis of:
  - Goal completion rates
  - Savings patterns
  - Monthly trends
  - Category distribution
- **Interactive Charts** - Advanced data visualization
- **Year-over-Year Comparisons** - Compare progress across years
- **Insights Generation** - AI-powered insights and recommendations

### 6. Achievements System
**File:** `src/app/achievements/page.tsx`
**Components:** `src/components/achievements/`

- **Achievement Tracking** - Unlock achievements for:
  - First goal created
  - First goal completed
  - Savings milestones
  - Journal streaks
  - Category completions
- **Trophy Display** - Visual representation of unlocked achievements
- **Unlock Timeline** - See when achievements were earned
- **Motivation System** - Gamification elements to encourage progress

### 7. Review Page
**File:** `src/app/review/page.tsx`
**Components:** `src/components/review/`

- **Monthly Reviews** - Structured review process
- **Performance Summary** - Comprehensive monthly overview
- **Goal Progress Review** - Analyze goal achievements
- **Financial Review** - Income, expenses, and savings analysis
- **Reflection Tools** - Guided reflection questions
- **Export Reviews** - Generate PDF reports

### 8. Settings
**File:** `src/app/settings/page.tsx`
**Components:** `src/components/settings/`

- **User Profile** - Personal information management
- **Currency Settings** - Support for multiple currencies (MAD, EUR, USD, etc.)
- **Theme Preferences** - Dark/light theme customization
- **Reminder Settings** - Configure monthly reminder day
- **Savings Target** - Set annual savings goals
- **Data Management** - Database reset and export options

## Database Schema

### Models

**Goal**
- ID, title, description, category, priority
- Cost, funded amount, status
- Deadline, color, icon, year
- Creation and update timestamps

**JournalEntry**
- Month, year (unique constraint)
- Income, expenses, savings, savings target
- Accomplishments, reflection, mood
- Habits, notes
- Creation and update timestamps

**Activity**
- Type, title, detail
- Creation timestamp

**Achievement**
- ID, title, description, icon
- Unlock timestamp, year

**Settings**
- Currency, theme, reminder day
- Savings target, user name

## Key Technical Features

### Server Actions
- All database operations use Next.js Server Actions
- Automatic revalidation of affected pages
- Type-safe with Zod validation
- Activity logging for audit trail

### Smart Allocation Algorithm
- Priority-based savings distribution
- Considers goal deadlines
- Handles goal completion automatically
- Redistributes when goals are added/removed

### Responsive Design
- Mobile-first approach
- Desktop sidebar navigation
- Mobile bottom navigation
- Touch-friendly interactions
- Optimized for all screen sizes

### Performance Optimizations
- Server components for data fetching
- Client components for interactivity
- Prisma connection pooling
- Efficient revalidation strategy

### Security
- Server-side validation
- SQL injection prevention via Prisma
- No client-side secrets
- Secure file handling

## Project Structure

```
src/
├── app/
│   ├── dashboard/page.tsx
│   ├── goals/page.tsx
│   ├── journal/page.tsx
│   ├── savings/page.tsx
│   ├── achievements/page.tsx
│   ├── analytics/page.tsx
│   ├── review/page.tsx
│   ├── settings/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── dashboard/
│   ├── goals/
│   ├── journal/
│   ├── savings/
│   ├── achievements/
│   ├── analytics/
│   ├── review/
│   ├── settings/
│   ├── layout/
│   ├── charts/
│   └── shared/
├── lib/
│   ├── actions.ts
│   ├── db.ts
│   ├── utils.ts
│   └── constants.ts
└── types/
    └── index.ts

prisma/
└── schema.prisma
```

## Development Setup

### Prerequisites
- Node.js 23.9.0+
- npm or yarn

### Installation
```bash
npm install
```

### Database Setup
```bash
npx prisma generate
npx prisma db push
```

### Development Server
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Production
```bash
npm start
```

## Current Issues Fixed

1. **Duplicate App Structure** - Removed conflicting `app/` directory, kept `src/app/`
2. **CSS Import Path** - Fixed globals.css import in layout.tsx
3. **Database Path** - Corrected Prisma database path in schema
4. **Database File Location** - Moved dev.db to correct location
5. **Missing globals.css** - Created comprehensive Tailwind CSS file
6. **Next.js Config** - Added server actions body size limit

## Application Purpose

This Yearly Goals Tracker is designed specifically for **Anas El Jaouhari** to help:
- Set and track yearly personal and professional goals
- Monitor monthly income, expenses, and savings
- Maintain a reflective journal for personal growth
- Visualize progress through interactive charts
- Stay motivated through achievements and gamification
- Make data-driven decisions about financial priorities
- Maintain consistency through habit and streak tracking

## Design Philosophy

- **Dark Theme First** - Modern, eye-friendly dark interface
- **Minimalist** - Clean, clutter-free design
- **Data-Driven** - Insights based on actual data
- **Motivational** - Encourages continued progress
- **Personal** - Tailored to individual user needs