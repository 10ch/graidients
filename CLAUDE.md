# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Graidients AI Ethics Polling App

## Project Overview

This is an interactive real-time polling application for AI ethics presentations. Presenters can pose ethical dilemmas and collect audience votes via QR codes.

## Key Features

- **Session-based polling**: Each presentation gets a unique session ID
- **QR code voting**: Audience members scan to vote on mobile devices
- **Real-time results**: Live updates using Supabase subscriptions
- **5-point Likert scale**: From "Totally Fine" to "Crosses Line"
- **Secure voting**: One vote per device per question using fingerprinting
- **Summary views**: Session and overall dashboard views
- **Custom branding**: Logo links to home, professional SVG assets

## Tech Stack

- Next.js 15.3 with TypeScript
- Supabase for database and real-time
- Tailwind CSS for styling
- QR code generation with qrcode.js
- Rate limiting middleware
- Optimized for 500+ concurrent users

## Architecture

The app follows Next.js 14+ App Router architecture:

```
/app/                    # Next.js app router pages
  ├── api/votes/        # REST API endpoint for vote submission
  ├── presenter/        # Presenter control panel
  ├── vote/            # Mobile voting interface
  └── summary/         # Results dashboard

/components/            # Reusable React components
  ├── QRCodeDisplay    # QR code generation with logo
  ├── ResultsChart     # Animated bar charts
  └── VotingButton     # Mobile vote interface

/lib/                   # Shared utilities
  ├── supabase.ts      # Database client configuration
  ├── types.ts         # TypeScript interfaces
  └── utils.ts         # Helper functions

/supabase/             # Database schema and migrations
/load-testing/         # Performance testing scripts
```

## Database Schema

- `sessions`: Container for presentations
  - `id` (uuid): Primary key
  - `created_at`: Timestamp
- `questions`: Individual ethical dilemmas
  - `id` (uuid): Primary key
  - `session_id`: Foreign key to sessions
  - `use_case`: The AI use case being evaluated
  - `is_active`: Whether voting is open
  - `created_at`: Timestamp
- `votes`: User responses (1-5 rating)
  - `id` (uuid): Primary key
  - `question_id`: Foreign key to questions
  - `rating`: 1-5 scale value
  - `device_fingerprint`: For duplicate prevention
  - `ip_address`: For rate limiting
- `vote_summary`: Aggregated view for fast results
  - Pre-calculated counts per rating value

## Commands

### Development

```bash
npm run dev          # Start development server
npm run build        # Build for production (MUST run before pushing!)
npm run start        # Start production server
```

### Code Quality

```bash
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix linting issues
npm run format       # Format with Prettier
npm run format:check # Check formatting
```

### Testing

```bash
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

### Load Testing

```bash
# Basic load test
node load-testing/quick-test.js <URL> <QUESTION_ID> <NUM_USERS>

# Harvard event simulation (200 users, 7 questions)
node load-testing/harvard-test.js <SESSION_ID>

# Custom vote distributions
node load-testing/custom-votes.js <URL> <QUESTION_ID> <NUM_VOTES> <PATTERN>
# Patterns: random, skew-low, skew-high, bimodal, polarized, normal
```

## Setup Instructions

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Set up Supabase**:
   - Create a new Supabase project at https://supabase.com
   - Run the SQL from `supabase/schema.sql` in the SQL editor
   - Get your project URL and anon key from project settings

3. **Configure environment variables**:
   Create `.env.local` with:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

   **Important**: Ensure the anon key has no line breaks!

4. **Run development server**:
   ```bash
   npm run dev
   ```

## Security Measures

- Input sanitization to prevent XSS
- Rate limiting (1000 requests/minute per IP for shared WiFi)
- Vote validation (1-5 range only)
- Duplicate vote prevention via device fingerprinting
- Questions cannot be edited after creation
- Row Level Security (RLS) enabled on all tables

## Performance Optimizations

- Debounced real-time updates (2000ms for large audiences)
- Database indexes on critical queries
- Static generation for vote pages
- Connection pooling for Supabase
- Optimistic UI updates
- Reduced real-time events (1/sec)
- Verified ready for 200+ concurrent users at Harvard event

### Performance Expectations

- **50-100 users**: Standard infrastructure handles easily
- **200 users**: Current setup tested and optimized for Harvard event
- **500 users**: May need Supabase Pro plan for connection pooling
- **1000+ users**: Consider Redis caching or dedicated WebSocket server

## UI/UX Guidelines

- **Chart Labels**: Bold, larger (text-sm), darker (gray-900) for visibility
- **Vote Options**: "Totally Fine", "Mostly Okay", "Not Sure", "Feels Sketchy", "Crosses Line"
- **Vote Confirmation**: Shows "Your vote has been recorded" with inline display of choice
- **Persistent Vote Display**: Choices saved in localStorage
- **Question Format**:
  - Prompt: "Describe a use of AI..."
  - QR view: "How do you feel about using AI to [use case]?"
  - Results: "Using AI to [use case]."
- **Chart Height**: 500px for better visibility in presentations
- **Logo**: Clickable, links to home page

## Deployment

- Production URL: `app.graidients.ai`
- Deployed on Vercel
- Environment variables must be properly formatted (no line breaks)
- Supabase authentication URLs configured for production domain
- DNS: CNAME record pointing to Vercel deployment

### Pre-deployment Checklist

1. **Always run `npm run build` before pushing** to ensure Vercel deployment will succeed
2. Verify environment variables in Vercel dashboard
3. Test Supabase connection with production credentials
4. Confirm rate limiting is appropriate for venue WiFi
5. Run load test with expected audience size

## Monitoring & Troubleshooting

### Quick Diagnostics

```bash
# Check Supabase connection
curl https://your-project.supabase.co/rest/v1/sessions

# Monitor real-time connections
# Check Supabase dashboard > Database > Realtime

# Test vote endpoint
curl -X POST https://app.graidients.ai/api/votes \
  -H "Content-Type: application/json" \
  -d '{"questionId":"test","rating":3}'
```

### Common Issues

1. **"Failed to submit vote"**: Check Supabase connection and rate limits
2. **Real-time not updating**: Verify WebSocket connections aren't blocked
3. **QR code not working**: Ensure NEXT_PUBLIC_APP_URL is correct
4. **High latency**: Consider upgrading Supabase plan for more connections

## Code Quality Tools

- **ESLint**: TypeScript-aware linting with Next.js rules
- **Prettier**: Enforces consistent formatting (double quotes, semicolons)
- **Husky**: Pre-commit hooks ensure code quality
- **lint-staged**: Only checks changed files for efficiency

Pre-commit checks run automatically and will:

1. Fix linting issues where possible
2. Format code with Prettier
3. Block commit if errors remain

## Important Notes

- **IMPORTANT**: Always run `npm run build` before pushing to ensure Vercel deployment will succeed
- Never commit sensitive data or API keys
- Test with multiple devices before presentations
- Have a fallback plan for network issues at venues
- Monitor Supabase dashboard during live events
