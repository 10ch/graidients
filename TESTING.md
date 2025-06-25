# Testing Guide for Graidients

## Automated Tests

Run the test suite:

```bash
npm test                # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage report
```

## Manual Testing Checklist

### Critical User Path Testing

#### 1. Create Question → QR → Vote → Results

- [ ] Start a new session from homepage
- [ ] Enter an ethical dilemma question
- [ ] Verify QR code appears
- [ ] Scan QR code with mobile device
- [ ] Vote on mobile (1-5 scale)
- [ ] Verify results update in real-time on presenter view
- [ ] Close voting and view final results
- [ ] Verify chart animations work correctly

#### 2. Multiple Questions Flow

- [ ] Create first question and complete voting
- [ ] Click "New Question" button
- [ ] Create second question
- [ ] Complete voting for second question
- [ ] Navigate to session summary
- [ ] Verify both questions appear with correct results

### Error Handling Tests

#### Supabase Connection Issues

1. **Test**: Disconnect internet/block Supabase domain
   - Expected: Graceful error messages
   - Vote submission shows "Unable to record vote" message
   - App remains functional when connection restored

#### Duplicate Voting

1. **Test**: Try to vote twice on same question from same device
   - Expected: "You have already voted" message
   - Original vote remains unchanged

#### Empty Question Submission

1. **Test**: Try to submit empty or whitespace-only question
   - Expected: Submit button disabled
   - No API call made

### Browser Compatibility Testing

#### Mobile Browsers

- [ ] **iOS Safari** (iPhone/iPad)
  - QR code scanning works
  - Vote buttons are easily tappable
  - Results display correctly
- [ ] **Chrome Mobile** (Android)
  - QR code scanning works
  - Responsive design adapts properly
  - Real-time updates work

#### Desktop Browsers

- [ ] **Chrome** (Latest version)
  - All features work
  - Console has no errors
- [ ] **Firefox** (Latest version)
  - Real-time subscriptions work
  - CSS renders correctly
- [ ] **Safari** (macOS)
  - LocalStorage for vote tracking works
  - Animations perform smoothly
- [ ] **Edge** (Latest version)
  - Basic functionality verified

### QR Code Testing

1. **Physical Device Test**:
   - Generate QR code on desktop
   - Scan with phone camera app
   - Verify it opens vote page
   - Confirm vote submission works

2. **QR Scanner Apps**:
   - Test with built-in camera apps (iOS/Android)
   - Test with dedicated QR scanner apps

### Performance Testing

- [ ] Test with 50+ concurrent voters
- [ ] Verify real-time updates don't lag
- [ ] Check that rate limiting works (50 requests/minute)

### Security Testing

- [ ] Verify XSS protection: Enter `<script>alert('xss')</script>` as question
- [ ] Verify vote range: Try to submit vote outside 1-5 range via API
- [ ] Verify questions cannot be edited after creation

## Known Limitations

- Rate limiting is per-server instance (not distributed)
- Requires JavaScript enabled
- QR codes require HTTPS in production

## Test Data

Use these sample questions for testing:

1. "Is it ethical for AI to make hiring decisions?"
2. "Should we allow AI to create art for commercial use?"
3. "Is using AI to write code cheating?"
4. "Should AI have access to personal data for personalization?"
