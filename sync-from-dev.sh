#!/bin/bash
set -e

# =========================
# Load .env safely
# =========================
if [ -f .env ]; then
    echo "Loading tokens from .env file..."
    while IFS='=' read -r key value; do
        # Skip empty lines and comments
        if [[ ! -z "$key" && ! "$key" =~ ^# ]]; then
            export "$key=$value"
        fi
    done < .env
else
    echo ".env file not found. Exiting."
    exit 1
fi

# =========================
# Configurations
# =========================
PROD_BRANCH="main"
SYNC_BRANCH="sync-from-dev"
DEV_REMOTE_NAME="dev"
DEV_REPO="ajitkumar2026/rust-study-hub"
PROD_REPO="urwithajit9/learnrust.online"

# =========================
# 1. Reset dev remote to use token
# =========================
echo "Setting dev remote with token..."
git remote remove $DEV_REMOTE_NAME 2>/dev/null || true
git remote add $DEV_REMOTE_NAME https://x-access-token:${DEV_REPO_TOKEN}@github.com/${DEV_REPO}.git
git fetch $DEV_REMOTE_NAME

# =========================
# 2. Reset origin remote to use token (for pushing)
# =========================
echo "Setting origin remote with production token..."
git remote set-url origin https://x-access-token:${PROD_REPO_TOKEN}@github.com/${PROD_REPO}.git

# =========================
# 3. Create or reset sync branch
# =========================
if ! git show-ref --verify --quiet refs/heads/$SYNC_BRANCH; then
    echo "Creating local sync branch $SYNC_BRANCH..."
    git checkout -b $SYNC_BRANCH
else
    echo "Resetting local sync branch $SYNC_BRANCH..."
    git checkout -B $SYNC_BRANCH
fi

# =========================
# 4. Check for new commits from dev
# =========================
NEW_COMMITS=$(git log $SYNC_BRANCH..$DEV_REMOTE_NAME/main --oneline)
if [ -z "$NEW_COMMITS" ]; then
    echo "No new updates from dev/main. Exiting."
    exit 0
else
    echo "New commits found from dev/main:"
    echo "$NEW_COMMITS"
fi

# =========================
# 5. Merge dev/main into sync branch
# =========================
echo "Merging dev/main into $SYNC_BRANCH..."
git merge $DEV_REMOTE_NAME/main --allow-unrelated-histories --no-edit || true

# =========================
# 6. Resolve conflicts automatically by accepting dev version
# =========================
if ! git diff --check --quiet; then
    echo "Conflicts detected. Resolving by accepting dev changes..."
    git checkout --theirs .
    git add .
    git commit -m "Merge dev/main into $SYNC_BRANCH (accept all dev changes)"
else
    echo "No conflicts detected."
fi

# =========================
# 7. Push sync branch to production remote
# =========================
echo "Pushing $SYNC_BRANCH to production repo..."
git push origin $SYNC_BRANCH --force

# =========================
# 8. Next steps
# =========================
echo "Sync branch '$SYNC_BRANCH' is updated."
echo "You can now create a Pull Request from '$SYNC_BRANCH' → '$PROD_BRANCH' on GitHub."
