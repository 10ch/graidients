import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiter that considers both IP and user fingerprint
const rateLimit = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_IP = 1000; // Higher limit for shared IPs
const MAX_REQUESTS_PER_USER = 10; // Per user fingerprint

export function middleware(request: NextRequest) {
  // Only apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous';
    const userFingerprint = request.headers.get('x-user-fingerprint') || '';
    const now = Date.now();
    
    // For votes API, use combined key for better rate limiting
    let rateLimitKey = ip;
    if (request.nextUrl.pathname === '/api/votes' && userFingerprint) {
      rateLimitKey = `${ip}:${userFingerprint}`;
    }
    
    const userRateLimit = rateLimit.get(rateLimitKey);
    const maxRequests = userFingerprint ? MAX_REQUESTS_PER_USER : MAX_REQUESTS_PER_IP;
    
    if (!userRateLimit || userRateLimit.resetTime < now) {
      // Reset rate limit
      rateLimit.set(rateLimitKey, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    } else if (userRateLimit.count >= maxRequests) {
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