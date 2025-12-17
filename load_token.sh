#!/usr/bin/env bash

set -e

# Load environment variables from .env
if [ ! -f .env ]; then
  echo ".env file not found"
  exit 1
fi

# Export PROD_REPO_TOKEN from .env
export $(grep -E '^PROD_REPO_TOKEN=' .env)

# Source .env (in case other vars are needed later)
source .env

# Verify
echo "$PROD_REPO_TOKEN"
