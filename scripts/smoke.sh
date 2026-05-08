#!/usr/bin/env bash
set -euo pipefail

npm run build
node scripts/verify-pages.mjs
npm run smoke
