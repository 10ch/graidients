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
- Next.js 14 with TypeScript
- Supabase for database and real-time
- Tailwind CSS for styling
- QR code generation with qrcode.js
- Rate limiting middleware
- Optimized for 500+ concurrent users

## Database Schema
- `sessions`: Container for presentations
- `questions`: Individual ethical dilemmas
- `votes`: User responses (1-5 rating)
- `vote_summary`: Aggregated view for fast results

## Security Measures
- Input sanitization to prevent XSS
- Rate limiting (1000 requests/minute per IP for shared WiFi)
- Vote validation (1-5 range only)
- Duplicate vote prevention
- Questions cannot be edited after creation

## User Flow
1. Presenter starts session → Creates session ID
2. Presenter enters AI use case → Generates QR code
3. Audience scans QR → Opens mobile voting page
4. Users select rating → Vote recorded with fingerprint
5. Presenter closes voting → Shows animated results
6. Can add more questions or view session summary

## Performance Optimizations
- Debounced real-time updates (2000ms for large audiences)
- Database indexes on critical queries
- Static generation for vote pages
- Connection pooling for Supabase
- Optimistic UI updates
- Reduced real-time events (1/sec)
- Verified ready for 200+ concurrent users at Harvard event

## UI Improvements (Latest)
- **Chart Labels**: Bold, larger (text-sm), darker (gray-900) for visibility
- **Vote Options**: Simplified to "Totally Fine", "Mostly Okay", "Not Sure", "Feels Sketchy", "Crosses Line"
- **Vote Confirmation**: Clean design showing "Your vote has been recorded" with inline display of choice
- **Persistent Vote Display**: Vote choices saved in localStorage and displayed on confirmation
- Increased logo size and made it clickable (links to home)
- Reduced whitespace in presenter view
- Taller charts (500px) for better visibility
- Question prompt: "Describe a use of AI..."
- QR view shows: "How do you feel about using AI to [use case]?"
- Results show: "Using AI to [use case]."
- Vote count displayed below question on QR screen
- Centered question text in matching-height boxes
- Professional favicon and logo SVGs

## Testing Tools
- **Load testing**: `node load-testing/quick-test.js <URL> <QUESTION_ID> <NUM_USERS>`
- **Harvard event test**: `node load-testing/harvard-test.js <SESSION_ID>` - Simulates 200 users voting on 7 questions
- **Custom vote distributions**: `node load-testing/custom-votes.js <URL> <QUESTION_ID> <NUM_VOTES> <PATTERN>`
  - Patterns: `random`, `skew-low`, `skew-high`, `bimodal`, `polarized`, `normal`
  - Example: `node load-testing/custom-votes.js https://app.graidients.ai abc-123 100 bimodal`

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:coverage` - Run tests with coverage

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (no line breaks!)
- `NEXT_PUBLIC_APP_URL` - Application URL for QR codes

## Deployment
- Deployed on Vercel at `app.graidients.ai`
- Environment variables must be properly formatted (no line breaks)
- Supabase authentication URLs configured for production domain
- DNS: CNAME record pointing to Vercel deployment