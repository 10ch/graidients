module.exports = {
  generateVoteData: function (userContext, events, done) {
    // Generate unique fingerprint for each virtual user
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    userContext.vars.fingerprint = `device_loadtest_${timestamp}_${randomId}`;

    // Random rating between 1-5 (matching your Likert scale)
    userContext.vars.rating = Math.floor(Math.random() * 5) + 1;

    // IMPORTANT: Replace with your actual test question ID
    // You'll get this after creating a test session and question
    userContext.vars.questionId = process.env.TEST_QUESTION_ID || "REPLACE_WITH_ACTUAL_QUESTION_ID";

    // Log for debugging (remove in production test)
    console.log(`User ${userContext.vars.fingerprint} will vote ${userContext.vars.rating}`);

    return done();
  },
};
