# Graidients AI Ethics Polling App

## Project Overview
This is an interactive real-time polling application for AI ethics presentations. Presenters can pose ethical dilemmas and collect audience votes via QR codes.

## Key Features
- **Session-based polling**: Each presentation gets a unique session ID
- **QR code voting**: Audience members scan to vote on mobile devices
- **Real-time results**: Live updates using Supabase subscriptions
- **5-point Likert scale**: From "Totally Fine" to "Crosses a Line"
- **Secure voting**: One vote per device per question using fingerprinting
- **Summary views**: Session and overall dashboard views

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
- Rate limiting (50 requests/minute per IP)
- Vote validation (1-5 range only)
- Duplicate vote prevention
- Questions cannot be edited after creation

## User Flow
1. Presenter starts session → Creates session ID
2. Presenter enters question → Generates QR code
3. Audience scans QR → Opens mobile voting page
4. Users select rating → Vote recorded with fingerprint
5. Presenter closes voting → Shows animated results
6. Can add more questions or view session summary

## Performance Optimizations
- Debounced real-time updates (500ms)
- Database indexes on critical queries
- Static generation for vote pages
- Connection pooling for Supabase
- Optimistic UI updates

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXT_PUBLIC_APP_URL` - Application URL for QR codes

## Deployment
Ready for Vercel deployment with environment variables configured.