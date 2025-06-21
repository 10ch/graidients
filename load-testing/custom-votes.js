// Custom voting patterns for Graidients
// Usage: node custom-votes.js <APP_URL> <QUESTION_ID> <NUM_VOTES> <PATTERN>

const https = require('https');
const http = require('http');

const APP_URL = process.argv[2] || 'http://localhost:3000';
const QUESTION_ID = process.argv[3];
const NUM_VOTES = parseInt(process.argv[4]) || 100;
const PATTERN = process.argv[5] || 'random';

if (!QUESTION_ID) {
  console.error('❌ Usage: node custom-votes.js <APP_URL> <QUESTION_ID> <NUM_VOTES> <PATTERN>');
  console.error('Patterns: random, skew-low, skew-high, bimodal, polarized, normal');
  console.error('Example: node custom-votes.js http://localhost:3000 abc-123 100 bimodal');
  process.exit(1);
}

// Vote distribution functions
const distributions = {
  random: () => Math.floor(Math.random() * 5) + 1,
  
  'skew-low': () => {
    // Heavily skewed towards "Totally Fine" (1)
    const rand = Math.random();
    if (rand < 0.5) return 1;
    if (rand < 0.75) return 2;
    if (rand < 0.9) return 3;
    if (rand < 0.97) return 4;
    return 5;
  },
  
  'skew-high': () => {
    // Heavily skewed towards "Crosses a Line" (5)
    const rand = Math.random();
    if (rand < 0.5) return 5;
    if (rand < 0.75) return 4;
    if (rand < 0.9) return 3;
    if (rand < 0.97) return 2;
    return 1;
  },
  
  bimodal: () => {
    // Peaks at both extremes (1 and 5)
    const rand = Math.random();
    if (rand < 0.4) return 1;
    if (rand < 0.8) return 5;
    if (rand < 0.9) return 2;
    if (rand < 0.95) return 4;
    return 3;
  },
  
  polarized: () => {
    // Only extremes, no middle ground
    return Math.random() < 0.5 ? 1 : 5;
  },
  
  normal: () => {
    // Bell curve centered on 3
    const rand = Math.random();
    if (rand < 0.1) return 1;
    if (rand < 0.3) return 2;
    if (rand < 0.7) return 3;
    if (rand < 0.9) return 4;
    return 5;
  }
};

const getVote = distributions[PATTERN] || distributions.random;

console.log(`🎯 Creating ${NUM_VOTES} votes with "${PATTERN}" distribution`);
console.log(`📍 URL: ${APP_URL}`);
console.log(`❓ Question ID: ${QUESTION_ID}`);
console.log('');

const voteCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

async function createVote(index) {
  const fingerprint = `custom_voter_${index}_${Date.now()}`;
  const rating = getVote();
  voteCounts[rating]++;
  
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

  return new Promise((resolve) => {
    const req = module.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          process.stdout.write('✓');
        } else {
          process.stdout.write('✗');
        }
        resolve();
      });
    });

    req.on('error', () => {
      process.stdout.write('✗');
      resolve();
    });

    req.write(data);
    req.end();
  });
}

async function run() {
  // Create votes with small delays to avoid rate limiting
  for (let i = 0; i < NUM_VOTES; i++) {
    await createVote(i);
    // Small delay between votes
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Progress indicator
    if ((i + 1) % 10 === 0) {
      process.stdout.write(` ${i + 1}/${NUM_VOTES}\n`);
    }
  }
  
  console.log('\n\n📊 Vote Distribution:');
  console.log('====================');
  console.log(`1 (Totally Fine):    ${'█'.repeat(Math.floor(voteCounts[1] / NUM_VOTES * 40))} ${voteCounts[1]} (${(voteCounts[1] / NUM_VOTES * 100).toFixed(1)}%)`);
  console.log(`2 (Mostly Okay):     ${'█'.repeat(Math.floor(voteCounts[2] / NUM_VOTES * 40))} ${voteCounts[2]} (${(voteCounts[2] / NUM_VOTES * 100).toFixed(1)}%)`);
  console.log(`3 (Either Way):      ${'█'.repeat(Math.floor(voteCounts[3] / NUM_VOTES * 40))} ${voteCounts[3]} (${(voteCounts[3] / NUM_VOTES * 100).toFixed(1)}%)`);
  console.log(`4 (Feels Sketchy):   ${'█'.repeat(Math.floor(voteCounts[4] / NUM_VOTES * 40))} ${voteCounts[4]} (${(voteCounts[4] / NUM_VOTES * 100).toFixed(1)}%)`);
  console.log(`5 (Crosses a Line):  ${'█'.repeat(Math.floor(voteCounts[5] / NUM_VOTES * 40))} ${voteCounts[5]} (${(voteCounts[5] / NUM_VOTES * 100).toFixed(1)}%)`);
}

run().catch(console.error);