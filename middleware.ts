import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiter (in production, use Redis or similar)
const rateLimit = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 50; // 50 requests per minute

export function middleware(request: NextRequest) {
  // Only apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'anonymous';
    const now = Date.now();
    
    const userRateLimit = rateLimit.get(ip);
    
    if (!userRateLimit || userRateLimit.resetTime < now) {
      // Reset rate limit
      rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    } else if (userRateLimit.count >= MAX_REQUESTS) {
      // Rate limit exceeded
      return new NextResponse('Too Many Requests', { status: 429 });
    } else {
      // Increment count
      userRateLimit.count++;
    }
    
    // Clean up old entries periodically
    if (Math.random() < 0.01) {
      for (const [key, value] of rateLimit.entries()) {
        if (value.resetTime < now) {
          rateLimit.delete(key);
        }
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};