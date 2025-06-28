#!/bin/bash

# Helper script to switch between v1 and v2 environments

if [ "$1" = "v2" ]; then
    echo "Switching to V2 development environment..."
    git checkout v2-development
    if [ -f .env.local.v2 ]; then
        cp .env.local.v2 .env.local
        echo "✅ Switched to V2 environment"
        echo "📍 Branch: v2-development"
        echo "🔧 Using .env.local.v2"
    else
        echo "❌ .env.local.v2 not found!"
        echo "📝 Copy .env.local.v2.example to .env.local.v2 and add your credentials"
    fi
elif [ "$1" = "v1" ] || [ "$1" = "prod" ]; then
    echo "Switching to production environment..."
    git checkout main
    if [ -f .env.local.prod ]; then
        cp .env.local.prod .env.local
        echo "✅ Switched to production environment"
        echo "📍 Branch: main"
        echo "🔧 Using .env.local.prod"
    else
        echo "⚠️  .env.local.prod not found, using existing .env.local"
        echo "📍 Branch: main"
    fi
else
    echo "Usage: ./switch-env.sh [v1|v2|prod]"
    echo ""
    echo "Examples:"
    echo "  ./switch-env.sh v2    # Switch to v2 development"
    echo "  ./switch-env.sh v1    # Switch to production/v1"
    echo "  ./switch-env.sh prod  # Same as v1"
fi