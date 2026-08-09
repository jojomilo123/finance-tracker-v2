#!/usr/bin/env bash
# Usage: ./prepare_repo.sh <REMOTE_URL>
set -e
if [ -z "$1" ]; then
  echo "Usage: $0 <REMOTE_URL>"
  exit 1
fi
REMOTE_URL="$1"

echo "Initializing git repository..."
if [ ! -d .git ]; then
  git init
fi

git add .
git commit -m "chore: initial commit"

echo "Adding remote $REMOTE_URL"
git branch -M main || true
git remote add origin "$REMOTE_URL" || git remote set-url origin "$REMOTE_URL"

echo "Pushing to remote..."
git push -u origin main --force

echo "Done. Visit your GitHub repo to confirm."