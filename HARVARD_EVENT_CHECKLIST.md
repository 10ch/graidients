# Harvard Event Performance Checklist

## Pre-Event Setup (Day Before)

### 1. Create Test Session
- [ ] Go to https://app.graidients.ai
- [ ] Start a new session and note the Session ID
- [ ] Create a test question to get a valid Question ID
- [ ] Run this load test: `node load-testing/quick-test.js https://app.graidients.ai <QUESTION_ID> 200`
- [ ] Verify all 200 votes succeed (expect ~5-10 seconds total)

### 2. Network Considerations
- [ ] Harvard WiFi can handle 200 devices, but consider:
  - Having backup: Ask attendees to use cellular if WiFi is slow
  - QR codes work offline once loaded
  - Each vote is only ~1KB of data

### 3. Performance Metrics to Monitor
- **Expected Response Times**: 200-800ms per vote
- **Success Rate**: Should be 100% with current rate limits
- **Total Time**: 200 users voting simultaneously should complete in <10 seconds

## Day of Event

### Before Presentation
1. **Test Connectivity**
   ```bash
   # Quick connectivity test (run from venue)
   curl -s -w "Response time: %{time_total}s\n" https://app.graidients.ai/api/votes -o /dev/null
   ```
   - Should be <500ms

2. **Pre-create Session**
   - Start your session 10 minutes early
   - Have first question ready to go

### During Presentation
1. **Voting Flow**
   - Show QR code on screen
   - Keep voting open for 60-90 seconds
   - Watch live results update every 2 seconds
   - Close voting before discussing results

2. **If Issues Arise**
   - Rate limit errors: Wait 60 seconds and retry
   - Slow loading: Ask some users to use cellular data
   - No updates: Refresh presenter view

### Current Performance Limits
- ✅ 1000 requests/minute per shared IP (plenty for 200 users)
- ✅ Database indexes optimized for concurrent reads
- ✅ Real-time updates debounced to prevent overload
- ✅ Vote deduplication prevents double-voting

## Emergency Fallback
If technical issues occur:
1. Take screenshot of current results
2. Ask for show of hands
3. Continue with presentation
4. Results are always available at: https://app.graidients.ai/summary/[SESSION_ID]

## Post-Event
- All results available at dashboard: https://app.graidients.ai/dashboard
- Export capabilities built into summary view
- Session data persists indefinitely