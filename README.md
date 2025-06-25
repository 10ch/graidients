# Graidients AI Ethics Polling App

An interactive real-time polling application for AI ethics presentations, allowing presenters to pose ethical dilemmas and collect audience votes via QR codes.

## Setup Instructions

### 1. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Copy your project URL and anon key from Project Settings > API

### 2. Configure Environment

Copy `.env.local.example` to `.env.local` and update with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to start using the app.

## Features

- **Session Management**: Create polling sessions for presentations
- **Real-time Voting**: Audience members vote by scanning QR codes
- **Live Results**: See voting results update in real-time
- **Session Summary**: View all questions and results from a session
- **Mobile Optimized**: Voting interface designed for mobile devices
- **Secure Voting**: One vote per device per question

## Technology Stack

- **Frontend**: Next.js 14 with TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Real-time**: Supabase Subscriptions
- **QR Codes**: qrcode.js
- **Deployment**: Vercel

## Deployment

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Usage

1. Click "Start a Session" on the home page
2. Enter an ethical dilemma question
3. Display the QR code to your audience
4. Audience members scan and vote on their devices
5. Close voting to see real-time results
6. Add more questions or view session summary
