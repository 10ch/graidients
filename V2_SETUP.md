# Graidients V2 Development Setup

This guide helps you set up parallel development for Graidients v2 while keeping the current production version running.

## Setup Steps

### 1. Create Supabase V2 Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Name it something like "graidients-v2" or "graidients-dev"
3. Once created, run the schema from `/supabase/schema-v2.sql` in the SQL editor (this is the clean schema for new projects)
4. Copy your project URL and anon key from Settings > API

### 2. Set Up Vercel V2 Project

1. Go to [vercel.com](https://vercel.com) and create a new project
2. Import your GitHub repository
3. **IMPORTANT**: Configure it to deploy from the `v2-development` branch
4. Name it "graidients-v2" or similar
5. Add these environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` (from step 1)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (from step 1)
   - `NEXT_PUBLIC_APP_URL` (will be your-project-name.vercel.app)

### 3. Local Development Setup

```bash
# First time setup
cp .env.local.v2.example .env.local.v2
cp .env.local.prod.example .env.local.prod

# Edit .env.local.v2 with your v2 Supabase credentials
# Edit .env.local.prod with your production credentials (optional)
```

### 4. Development Workflow

```bash
# Working on V2
git checkout v2-development
cp .env.local.v2 .env.local
npm run dev

# Checking production code
git checkout main
cp .env.local.prod .env.local
npm run dev

# Switching back to V2
git checkout v2-development
cp .env.local.v2 .env.local
```

### 5. Deployment

- **V2 Deployment**: Push to `v2-development` branch → Auto-deploys to v2 Vercel project
- **Production**: Push to `main` branch → Auto-deploys to production

### 6. Testing V2

Your v2 app will be available at:

- Local: http://localhost:3000 (when on v2-development branch)
- Staging: https://graidients-v2.vercel.app (or your custom domain)

## Important Notes

- **Database Isolation**: V2 uses a completely separate Supabase project
- **No Risk**: Changes to v2 won't affect production
- **Easy Rollback**: Just switch branches
- **Gradual Migration**: Cherry-pick features from v2 to main when ready

## Syncing Changes

If you need to sync changes from main to v2:

```bash
git checkout v2-development
git merge main
# Resolve any conflicts
```

## Going Live with V2

When v2 is ready to replace production:

1. Update production Vercel environment variables
2. Either merge v2-development to main, or
3. Point production domain to v2 Vercel project
