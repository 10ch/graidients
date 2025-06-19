#!/bin/bash

# Load test runner script for Graidients

echo "🚀 Graidients Load Test Runner"
echo "=============================="

# Check if artillery is installed
if ! command -v artillery &> /dev/null; then
    echo "❌ Artillery not found. Installing..."
    npm install -g artillery
fi

# Get test parameters
read -p "Enter your app URL (default: http://localhost:3000): " APP_URL
APP_URL=${APP_URL:-http://localhost:3000}

read -p "Enter test question ID: " QUESTION_ID
if [ -z "$QUESTION_ID" ]; then
    echo "❌ Question ID is required!"
    echo "1. Start your app"
    echo "2. Create a test session"
    echo "3. Create a test question"
    echo "4. Copy the question ID from the URL"
    exit 1
fi

# Update the test configuration
sed -i.bak "s|http://localhost:3000|$APP_URL|g" vote-test.yml
sed -i.bak "s|REPLACE_WITH_ACTUAL_QUESTION_ID|$QUESTION_ID|g" vote-processor.js

# Create results directory
mkdir -p results
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo ""
echo "📊 Starting load test..."
echo "Target: $APP_URL"
echo "Question ID: $QUESTION_ID"
echo "Simulating up to 150 concurrent users"
echo ""

# Run the test
TEST_QUESTION_ID=$QUESTION_ID artillery run vote-test.yml --output results/test-$TIMESTAMP.json

# Generate HTML report
artillery report results/test-$TIMESTAMP.json --output results/report-$TIMESTAMP.html

# Restore original files
mv vote-test.yml.bak vote-test.yml
mv vote-processor.js.bak vote-processor.js

echo ""
echo "✅ Test complete!"
echo "📄 Results saved to: results/report-$TIMESTAMP.html"
echo ""
echo "Open the report with:"
echo "open results/report-$TIMESTAMP.html"

# Quick summary
echo ""
echo "Quick Summary:"
artillery report results/test-$TIMESTAMP.json | grep -E "(Scenarios launched|completed|Mean response|p95|p99|Errors)"