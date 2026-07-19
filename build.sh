#!/bin/bash
set -e

echo "Installing dependencies..."
pnpm install

echo "Building AI Hunt Hub..."
pnpm --filter @workspace/ai-hunt-hub run build

echo "Copying output to public/..."
rm -rf public
cp -r artifacts/ai-hunt-hub/dist public

echo "Build complete. Output in public/"
