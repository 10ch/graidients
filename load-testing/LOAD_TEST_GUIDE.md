# Load Testing Guide for Graidients

## Quick Start (150 Users)

### Option 1: Using Artillery (Recommended)

1. **Install Artillery**:

```bash
npm install -g artillery
```

2. **Create test scenario**:

```bash
mkdir load-testing
cd load-testing
```

3. **Create `vote-test.yml`**:

```yaml
config:
  target: "https://your-app.vercel.app"
  phases:
    - duration: 30
      arrivalRate: 5
      name: "Warm up"
    - duration: 60
      arrivalRate: 50
      name: "Ramp up to 150 users"
    - duration: 120
      arrivalRate: 150
      name: "Sustained 150 users voting"
  processor: "./vote-processor.js"

scenarios:
  - name: "User votes on question"
    flow:
      - function: "generateVoteData"
      - post:
          url: "/api/votes"
          headers:
            Content-Type: "application/json"
            X-User-Fingerprint: "{{ fingerprint }}"
          json:
            questionId: "{{ questionId }}"
            rating: "{{ rating }}"
            voterFingerprint: "{{ fingerprint }}"
          expect:
            - statusCode: 200
```

4. **Create `vote-processor.js`**:

```javascript
module.exports = {
  generateVoteData: function (userContext, events, done) {
    // Generate unique fingerprint for each virtual user
    userContext.vars.fingerprint = `device_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Random rating between 1-5
    userContext.vars.rating = Math.floor(Math.random() * 5) + 1;

    // Use your actual question ID from a test session
    userContext.vars.questionId = "YOUR_TEST_QUESTION_ID";

    return done();
  },
};
```

5. **Run the test**:

```bash
artillery run vote-test.yml --output results.json
artillery report results.json --output results.html
```

### Option 2: Using k6 (More Advanced)

1. **Install k6**:

```bash
# macOS
brew install k6

# Or download from https://k6.io/docs/getting-started/installation/
```

2. **Create `k6-vote-test.js`**:

```javascript
import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

const errorRate = new Rate("errors");

export const options = {
  stages: [
    { duration: "30s", target: 50 }, // Ramp up to 50 users
    { duration: "1m", target: 150 }, // Ramp up to 150 users
    { duration: "2m", target: 150 }, // Stay at 150 users
    { duration: "30s", target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ["p(95)<3000"], // 95% of requests must complete below 3s
    errors: ["rate<0.1"], // Error rate must be below 10%
  },
};

const BASE_URL = "https://your-app.vercel.app";
const QUESTION_ID = "YOUR_TEST_QUESTION_ID"; // Replace with actual ID

export default function () {
  const fingerprint = `device_k6_${__VU}_${Date.now()}`;
  const rating = Math.floor(Math.random() * 5) + 1;

  const payload = JSON.stringify({
    questionId: QUESTION_ID,
    rating: rating,
    voterFingerprint: fingerprint,
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
      "X-User-Fingerprint": fingerprint,
    },
  };

  const res = http.post(`${BASE_URL}/api/votes`, payload, params);

  // Check response
  const success = check(res, {
    "status is 200": (r) => r.status === 200,
    "response has success": (r) => JSON.parse(r.body).success === true,
  });

  errorRate.add(!success);

  // Simulate user think time
  sleep(Math.random() * 2 + 1);
}
```

3. **Run k6 test**:

```bash
k6 run k6-vote-test.js
```

### Option 3: Simple Bash Script (Quick & Dirty)

Create `simple-load-test.sh`:

```bash
#!/bin/bash

URL="https://your-app.vercel.app/api/votes"
QUESTION_ID="YOUR_TEST_QUESTION_ID"
CONCURRENT=150
TOTAL=300

echo "Starting load test with $CONCURRENT concurrent users..."

for i in $(seq 1 $TOTAL); do
  (
    FINGERPRINT="device_bash_${i}_$(date +%s)"
    RATING=$((1 + RANDOM % 5))

    curl -X POST $URL \
      -H "Content-Type: application/json" \
      -H "X-User-Fingerprint: $FINGERPRINT" \
      -d "{\"questionId\":\"$QUESTION_ID\",\"rating\":$RATING,\"voterFingerprint\":\"$FINGERPRINT\"}" \
      -w "%{http_code} - %{time_total}s\n" \
      -o /dev/null \
      -s
  ) &

  # Control concurrency
  if [ $((i % CONCURRENT)) -eq 0 ]; then
    wait
  fi
done

wait
echo "Load test completed!"
```

## Before Running Tests

1. **Set up a test session**:
   - Create a new session in your app
   - Create a test question
   - Note the question ID from the URL

2. **Notify Supabase** (if on free tier):
   - They might throttle unexpected traffic
   - Consider upgrading first

3. **Monitor during test**:
   - Watch Supabase dashboard
   - Check Vercel logs
   - Monitor your app's presenter view

## What to Look For

### Good Signs ✅

- Response times < 2 seconds
- Success rate > 95%
- Real-time updates working (check presenter view)
- No 429 (rate limit) errors

### Warning Signs ⚠️

- Response times > 3 seconds
- Error rate > 5%
- 429 errors (rate limiting triggered)
- Database connection errors
- WebSocket disconnections

## Interpreting Results

### Artillery Results:

```
Summary report @ 10:23:45
  Scenarios launched:  150
  Scenarios completed: 150
  Requests completed:  150
  Mean response time: 245.7ms  ← Good!
  Response time p95:  890.2ms  ← Good!
  Response time p99:  1945.3ms ← Acceptable
  Errors:             0        ← Excellent!
```

### k6 Results:

```
✓ status is 200
✓ response has success

checks.........................: 100.00% ✓ 300   ✗ 0
data_received..................: 45 kB   375 B/s
data_sent......................: 60 kB   500 B/s
http_req_duration..............: avg=234ms  p(95)=1.2s ← Good!
errors.........................: 0.00%   ✓ 0     ✗ 300
```

## Quick Fixes if Tests Fail

1. **Too many 429 errors**:
   - Rate limiting too strict
   - Already fixed in middleware.ts

2. **Slow response times**:
   - Check Supabase connection count
   - Increase debounce time
   - Enable caching

3. **Real-time not updating**:
   - Too many WebSocket connections
   - Reduce eventsPerSecond further

4. **Database errors**:
   - Connection pool exhausted
   - Upgrade Supabase plan

## Testing Checklist for Your Event

- [ ] Run load test with 200 users (150 + buffer)
- [ ] Test from actual venue WiFi if possible
- [ ] Test with various devices (iOS, Android)
- [ ] Test QR code scanning distance
- [ ] Have backup plan ready
- [ ] Brief presenter on manual fallback
