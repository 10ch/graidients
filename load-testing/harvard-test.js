#!/usr/bin/env node

// Harvard Event Load Test - Simulates 200 concurrent voters over 6-8 questions
// Usage: node harvard-test.js <SESSION_ID>

const https = require('https');
const http = require('http');

const APP_URL = 'https://app.graidients.ai';
const SESSION_ID = process.argv[2];
const NUM_USERS = 200;
const NUM_QUESTIONS = 7; // Testing with 7 questions

if (!SESSION_ID) {
  console.error('❌ Usage: node harvard-test.js <SESSION_ID>');
  console.error('\nSteps:');
  console.error('1. Go to https://app.graidients.ai');
  console.error('2. Click "Start Polling Session"');
  console.error('3. Copy the Session ID from the URL');
  console.error('4. Run: node harvard-test.js <SESSION_ID>');
  process.exit(1);
}

console.log(`🎓 Harvard Event Load Test`);
console.log(`📍 URL: ${APP_URL}`);
console.log(`🆔 Session ID: ${SESSION_ID}`);
console.log(`👥 Simulating: ${NUM_USERS} concurrent users`);
console.log(`❓ Questions: ${NUM_QUESTIONS}`);
console.log('');

// Test questions for the event
const testQuestions = [
  "generate personalized learning plans for students",
  "screen job applicants based on social media analysis",
  "diagnose mental health conditions from facial expressions",
  "predict criminal behavior from demographic data",
  "write academic papers for students",
  "make hiring decisions without human oversight",
  "determine insurance premiums based on genetic data"
];

async function createQuestion(sessionId, questionText) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      sessionId,
      questionText
    });

    const options = {
      hostname: 'app.graidients.ai',
      path: '/api/questions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          const question = JSON.parse(body);
          resolve(question.id);
        } else {
          reject(new Error(`Failed to create question: ${res.statusCode}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function simulateVoting(questionId, questionNumber) {
  const results = {
    success: 0,
    errors: 0,
    responseTimes: []
  };

  console.log(`\n📊 Question ${questionNumber}: Testing ${NUM_USERS} votes...`);
  
  const votePromises = [];
  
  // Create all vote promises
  for (let i = 0; i < NUM_USERS; i++) {
    const promise = new Promise((resolve) => {
      const startTime = Date.now();
      const fingerprint = `harvard_test_user_${i}_q${questionNumber}`;
      
      // Simulate realistic vote distribution
      let rating;
      const rand = Math.random();
      if (rand < 0.1) rating = 1;      // 10% - Totally Fine
      else if (rand < 0.25) rating = 2; // 15% - Mostly Fine  
      else if (rand < 0.5) rating = 3;  // 25% - Unsure
      else if (rand < 0.8) rating = 4;  // 30% - Mostly Concerning
      else rating = 5;                  // 20% - Crosses a Line
      
      const data = JSON.stringify({
        questionId,
        rating,
        voterFingerprint: fingerprint
      });

      const options = {
        hostname: 'app.graidients.ai',
        path: '/api/votes',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length,
          'X-User-Fingerprint': fingerprint
        }
      };

      // Add small random delay to simulate real users (0-3 seconds)
      setTimeout(() => {
        const req = https.request(options, (res) => {
          let body = '';
          res.on('data', (chunk) => body += chunk);
          res.on('end', () => {
            const responseTime = Date.now() - startTime;
            results.responseTimes.push(responseTime);
            
            if (res.statusCode === 200) {
              results.success++;
            } else {
              results.errors++;
              console.error(`Vote error: ${res.statusCode}`);
            }
            resolve();
          });
        });

        req.on('error', () => {
          results.errors++;
          resolve();
        });

        req.write(data);
        req.end();
      }, Math.random() * 3000);
    });
    
    votePromises.push(promise);
  }

  // Wait for all votes to complete
  await Promise.all(votePromises);
  
  // Calculate statistics
  results.responseTimes.sort((a, b) => a - b);
  const avgResponseTime = results.responseTimes.reduce((a, b) => a + b, 0) / results.responseTimes.length;
  const p95 = results.responseTimes[Math.floor(results.responseTimes.length * 0.95)];
  
  console.log(`✅ Success: ${results.success}/${NUM_USERS}`);
  console.log(`📈 Avg Response: ${avgResponseTime.toFixed(0)}ms`);
  console.log(`📈 95th Percentile: ${p95}ms`);
  console.log(`✨ Success Rate: ${((results.success / NUM_USERS) * 100).toFixed(1)}%`);
  
  return results;
}

async function runTest() {
  console.log('\n🚀 Starting Harvard event simulation...\n');
  
  const overallResults = {
    totalSuccess: 0,
    totalErrors: 0,
    questionResults: []
  };
  
  try {
    // Test each question sequentially (as would happen in real event)
    for (let i = 0; i < NUM_QUESTIONS; i++) {
      console.log(`\n➡️  Creating Question ${i + 1}: "Using AI to ${testQuestions[i]}"`);
      
      // Create the question
      const questionId = await createQuestion(SESSION_ID, testQuestions[i]);
      console.log(`✅ Question created with ID: ${questionId}`);
      
      // Wait 2 seconds (presenter explaining)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate voting
      const results = await simulateVoting(questionId, i + 1);
      overallResults.totalSuccess += results.success;
      overallResults.totalErrors += results.errors;
      overallResults.questionResults.push(results);
      
      // Wait 5 seconds between questions (discussion time)
      if (i < NUM_QUESTIONS - 1) {
        console.log('\n⏳ Waiting 5 seconds before next question...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
    
    // Final summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 FINAL RESULTS:');
    console.log('='.repeat(50));
    console.log(`✅ Total Successful Votes: ${overallResults.totalSuccess}/${NUM_USERS * NUM_QUESTIONS}`);
    console.log(`❌ Total Errors: ${overallResults.totalErrors}`);
    console.log(`📈 Overall Success Rate: ${((overallResults.totalSuccess / (NUM_USERS * NUM_QUESTIONS)) * 100).toFixed(1)}%`);
    console.log(`\n✨ View results at: ${APP_URL}/summary/${SESSION_ID}`);
    
    if (overallResults.totalSuccess / (NUM_USERS * NUM_QUESTIONS) < 0.95) {
      console.log('\n⚠️  Warning: Success rate below 95%. Check rate limits and network.');
    } else {
      console.log('\n🎉 System is ready for the Harvard event!');
    }
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
runTest().catch(console.error);