#!/bin/bash
# rebuild.sh — the one command after editing cards in src/deck.js:
# re-subset the font (covers any new characters), rebuild the single-file
# index.html, and re-verify all deck ordering constraints.
# Run: bash tools/rebuild.sh
set -euo pipefail
cd "$(dirname "$0")/.."
bash tools/subset-font.sh
node tools/build.mjs
node tools/verify-deck.mjs
echo "✓ rebuild complete — refresh the browser (or commit & push to deploy)"
