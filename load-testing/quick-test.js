// Quick Node.js load test for Graidients
// Usage: node quick-test.js <APP_URL> <QUESTION_ID> <NUM_USERS>

const https = require('https');
const http = require('http');

const APP_URL = process.argv[2] || 'http://localhost:3000';
const QUESTION_ID = process.argv[3];
const NUM_USERS = parseInt(process.argv[4]) || 150;

if (!QUESTION_ID) {
  console.error('❌ Usage: node quick-test.js <APP_URL> <QUESTION_ID> <NUM_USERS>');
  console.error('Example: node quick-test.js http://localhost:3000 abc-123-def 150');
  process.exit(1);
}

console.log(`🚀 Starting quick load test`);
console.log(`📍 URL: ${APP_URL}`);
console.log(`❓ Question ID: ${QUESTION_ID}`);
console.log(`👥 Users: ${NUM_USERS}`);
console.log('');

const results = {
  success: 0,
  errors: 0,
  totalTime: 0,
  responseTimes: []
};

function makeVoteRequest(userId) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const fingerprint = `device_quicktest_${userId}_${Date.now()}`;
    const rating = Math.floor(Math.random() * 5) + 1;
    
    const data = JSON.stringify({
      questionId: QUESTION_ID,
      rating: rating,
      voterFingerprint: fingerprint
    });

    const url = new URL(`${APP_URL}/api/votes`);
    const module = url.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'X-User-Fingerprint': fingerprint
      }
    };

    const req = module.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        results.responseTimes.push(responseTime);
        
        if (res.statusCode === 200) {
          results.success++;
          process.stdout.write('✓');
        } else {
          results.errors++;
          process.stdout.write('✗');
          console.error(`\nError: Status ${res.statusCode} - ${body}`);
        }
        
        results.totalTime += responseTime;
        resolve();
      });
    });

    req.on('error', (error) => {
      results.errors++;
      process.stdout.write('✗');
      console.error(`\nError: ${error.message}`);
      resolve();
    });

    req.write(data);
    req.end();
  });
}

async function runTest() {
  const startTime = Date.now();
  
  // Run requests in batches to avoid overwhelming
  const batchSize = 50;
  for (let i = 0; i < NUM_USERS; i += batchSize) {
    const batch = [];
    for (let j = 0; j < batchSize && i + j < NUM_USERS; j++) {
      batch.push(makeVoteRequest(i + j));
    }
    await Promise.all(batch);
    
    // Brief pause between batches
    if (i + batchSize < NUM_USERS) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  const totalDuration = Date.now() - startTime;
  
  // Calculate statistics
  results.responseTimes.sort((a, b) => a - b);
  const avgResponseTime = results.totalTime / NUM_USERS;
  const p95 = results.responseTimes[Math.floor(results.responseTimes.length * 0.95)];
  const p99 = results.responseTimes[Math.floor(results.responseTimes.length * 0.99)];
  
  console.log('\n\n📊 Test Results:');
  console.log('================');
  console.log(`✅ Successful: ${results.success}`);
  console.log(`❌ Errors: ${results.errors}`);
  console.log(`⏱️  Total Duration: ${(totalDuration / 1000).toFixed(2)}s`);
  console.log(`📈 Avg Response Time: ${avgResponseTime.toFixed(0)}ms`);
  console.log(`📈 95th Percentile: ${p95}ms`);
  console.log(`📈 99th Percentile: ${p99}ms`);
  console.log(`📈 Success Rate: ${((results.success / NUM_USERS) * 100).toFixed(1)}%`);
  
  if (results.errors > 0) {
    console.log('\n⚠️  Warning: Some requests failed. Check your rate limiting settings.');
  }
  
  if (avgResponseTime > 1000) {
    console.log('\n⚠️  Warning: Average response time is high. Consider optimization.');
  }
}

runTest().catch(console.error);