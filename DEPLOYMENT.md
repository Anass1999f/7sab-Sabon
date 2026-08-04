# Vercel + Supabase Deployment Guide

## Local Development (SQLite)
Your app uses SQLite for local development - this is fast and requires no setup.

```bash
# Local development
DATABASE_URL="file:./dev.db"
npx prisma generate
npx prisma db push
npm run dev
```

## Production Deployment (Supabase)

### Step 1: Update Prisma for Production

For production deployment, create a production Prisma schema:

```bash
# Create production schema
cp prisma/schema.prisma prisma/schema.prisma.production
```

Edit `prisma/schema.prisma.production` to use PostgreSQL:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Step 2: Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push
```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

3. **Add Environment Variables in Vercel**
   - `DATABASE_URL` = your Supabase PostgreSQL connection string
   - Get this from Supabase → Settings → Database → Connection String

4. **Add Build Command in Vercel**
   - Build command: `prisma generate && next build`
   - Output directory: `.next`

### Step 3: Production Database Setup

Vercel will automatically:
- Generate Prisma client for PostgreSQL
- Push schema to Supabase database
- Deploy your app

## Important Notes:

- **Local = SQLite** (fast, no setup needed)
- **Production = Supabase PostgreSQL** (scalable, reliable)
- **Environment differences** are handled automatically
- **Your .env file is in .gitignore** - it won't be pushed to GitHub
- **Vercel environment variables** are set in Vercel dashboard