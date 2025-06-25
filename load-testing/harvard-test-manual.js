#!/usr/bin/env node

// Harvard Event Load Test - Manual Questions Version
// This version requires you to create questions manually in the app
// Usage: node harvard-test-manual.js <QUESTION_ID>

const https = require("https");

const APP_URL = "https://app.graidients.ai";
const QUESTION_ID = process.argv[2];
const NUM_USERS = 200;

if (!QUESTION_ID) {
  console.error("❌ Usage: node harvard-test-manual.js <QUESTION_ID>");
  console.error("\nSteps:");
  console.error("1. Go to your presenter page");
  console.error("2. Create a question");
  console.error("3. Copy the Question ID from the QR code URL");
  console.error("4. Run: node harvard-test-manual.js <QUESTION_ID>");
  process.exit(1);
}

console.log(`🎓 Harvard Event Load Test (Manual Questions)`);
console.log(`📍 URL: ${APP_URL}`);
console.log(`❓ Question ID: ${QUESTION_ID}`);
console.log(`👥 Simulating: ${NUM_USERS} concurrent users`);
console.log("");

const results = {
  success: 0,
  errors: 0,
  responseTimes: [],
};

async function simulateVoting() {
  const votePromises = [];

  // Create all vote promises
  for (let i = 0; i < NUM_USERS; i++) {
    const promise = new Promise((resolve) => {
      const startTime = Date.now();
      const fingerprint = `harvard_test_user_${i}_${Date.now()}`;

      // Simulate realistic vote distribution
      let rating;
      const rand = Math.random();
      if (rand < 0.1)
        rating = 1; // 10% - Totally Fine
      else if (rand < 0.25)
        rating = 2; // 15% - Mostly Okay
      else if (rand < 0.5)
        rating = 3; // 25% - Not Sure
      else if (rand < 0.8)
        rating = 4; // 30% - Feels Sketchy
      else rating = 5; // 20% - Crosses Line

      const data = JSON.stringify({
        questionId: QUESTION_ID,
        rating,
        voterFingerprint: fingerprint,
      });

      const options = {
        hostname: "app.graidients.ai",
        path: "/api/votes",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": data.length,
          "X-User-Fingerprint": fingerprint,
        },
      };

      // Add small random delay to simulate real users (0-3 seconds)
      setTimeout(() => {
        const req = https.request(options, (res) => {
          let body = "";
          res.on("data", (chunk) => (body += chunk));
          res.on("end", () => {
            const responseTime = Date.now() - startTime;
            results.responseTimes.push(responseTime);

            if (res.statusCode === 200) {
              results.success++;
              process.stdout.write("✓");
            } else {
              results.errors++;
              process.stdout.write("✗");
              if (results.errors <= 5) {
                console.error(`\nError: Status ${res.statusCode} - ${body}`);
              }
            }
            resolve();
          });
        });

        req.on("error", (error) => {
          results.errors++;
          process.stdout.write("✗");
          console.error(`\nRequest error: ${error.message}`);
          resolve();
        });

        req.write(data);
        req.end();
      }, Math.random() * 3000);
    });

    votePromises.push(promise);
  }

  // Wait for all votes to complete
  console.log("🗳️  Sending votes...\n");
  await Promise.all(votePromises);

  // Calculate statistics
  const avgResponseTime =
    results.responseTimes.reduce((a, b) => a + b, 0) / results.responseTimes.length;
  const sortedTimes = results.responseTimes.sort((a, b) => a - b);
  const p95 = sortedTimes[Math.floor(sortedTimes.length * 0.95)];
  const p99 = sortedTimes[Math.floor(sortedTimes.length * 0.99)];

  console.log("\n\n📊 Results:");
  console.log(`✅ Successful votes: ${results.success}/${NUM_USERS}`);
  console.log(`❌ Failed votes: ${results.errors}`);
  console.log(`⏱️  Avg response time: ${avgResponseTime.toFixed(0)}ms`);
  console.log(`📈 95th percentile: ${p95}ms`);
  console.log(`📈 99th percentile: ${p99}ms`);

  if (results.errors > 0) {
    console.log("\n⚠️  Some votes failed. This might indicate rate limiting or server issues.");
  }
}

simulateVoting().catch(console.error);
