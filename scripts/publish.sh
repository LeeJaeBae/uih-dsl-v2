#!/bin/bash
# UIH DSL v2 - Publishing Script
# 
# Publishes all packages to NPM registry
# Usage: ./scripts/publish.sh

set -e

echo "🚀 UIH DSL v2 - NPM Publishing Script"
echo "======================================"

# Check if logged in to NPM
if ! npm whoami &>/dev/null; then
  echo "❌ Not logged in to NPM. Please run: npm login"
  exit 1
fi

echo "✅ NPM login verified"
echo ""

# Navigate to compiler directory
cd "$(dirname "$0")/../compiler" || exit 1

echo "📦 Building all packages..."
pnpm -r build

if [ $? -ne 0 ]; then
  echo "❌ Build failed"
  exit 1
fi

echo "✅ Build successful"
echo ""

echo "🔍 Running dry-run..."
pnpm -r publish --dry-run --no-git-checks

echo ""
read -p "Continue with actual publish? (y/N) " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Publishing cancelled"
  exit 1
fi

echo "📤 Publishing to NPM..."
pnpm -r publish --access public --no-git-checks

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ All packages published successfully!"
  echo ""
  echo "Verify with:"
  echo "  npm view @uih-dsl/cli"
  echo "  npm view @uih-dsl/tokenizer"
else
  echo "❌ Publishing failed"
  exit 1
fi
