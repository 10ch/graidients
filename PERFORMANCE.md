# Performance Guide for Large Audiences (500+ Users)

## Current Optimizations

### 1. **Rate Limiting** ✅

- Increased to 1000 requests/minute per IP for shared WiFi
- Per-user fingerprint limiting (10 req/min) to prevent individual abuse
- Prevents single bad actor while allowing legitimate large audiences

### 2. **Real-time Updates** ✅

- Increased debounce to 2 seconds (was 500ms)
- Reduces database queries from 1000/sec to 1 every 2 seconds
- `eventsPerSecond: 2` in Supabase config limits subscription updates

### 3. **Database Optimizations**

- Using `vote_summary` view for aggregated results
- Single query instead of counting each vote
- Database indexes on critical fields (already in schema)

## Remaining Bottlenecks & Solutions

### 1. **Supabase Connection Limits**

**Problem**: Default Supabase plans have connection limits
**Solutions**:

- Upgrade to Pro plan (supports more connections)
- Use Supabase connection pooling (Supavisor)
- Consider self-hosted Supabase for unlimited connections

### 2. **Network Congestion**

**Problem**: 500 devices on same WiFi
**Solutions**:

- Use enterprise-grade access points
- Set up multiple WiFi networks (split audience)
- Reduce QR code image size
- Enable HTTP/2 on hosting platform

### 3. **Client-Side Optimizations**

**Implement these changes**:

```javascript
// Reduce real-time connection overhead
const supabase = createClient(url, key, {
  realtime: {
    params: {
      eventsPerSecond: 1, // Further reduce for large audiences
    },
  },
  db: {
    schema: "public",
  },
  global: {
    headers: { "x-connection-pool": "true" },
  },
});
```

### 4. **Caching Strategy**

- Cache QR code images with long TTL
- Use CDN for static assets
- Enable Next.js ISR for vote pages

## Deployment Recommendations

### For 500+ Person Events:

1. **Infrastructure**:
   - Deploy on Vercel Pro (better performance)
   - Use Supabase Pro plan minimum
   - Consider dedicated Supabase instance

2. **Network Setup**:
   - Test WiFi capacity beforehand
   - Have IT support on standby
   - Provide alternative connection method (cellular)

3. **Testing Protocol**:

   ```bash
   # Load test with Apache Bench
   ab -n 500 -c 100 https://your-app.vercel.app/api/votes

   # Monitor during event
   - Supabase dashboard for connections
   - Vercel analytics for response times
   - Error tracking (Sentry)
   ```

4. **Fallback Plan**:
   - Manual vote collection if system fails
   - Export results capability
   - Presenter can show static results

## Database Connection Pooling

Add to Supabase:

```sql
-- Increase connection pool size
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';

-- Add index for faster real-time queries
CREATE INDEX CONCURRENTLY idx_votes_question_created
ON votes(question_id, created_at DESC);
```

## Monitoring During Events

Watch for:

- Response times > 3 seconds
- 429 errors (rate limiting)
- Database connection errors
- WebSocket disconnections

## Alternative Architecture for 1000+ Users

Consider moving to:

1. **Redis** for real-time vote counting
2. **WebSockets** server (Socket.io) instead of Supabase real-time
3. **Write-through cache** for vote results
4. **Queue system** (Bull/BullMQ) for vote processing
