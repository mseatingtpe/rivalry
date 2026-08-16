#!/bin/bash
# subset-font.sh — download Noto Sans Mono CJK TC (OFL) and subset it to
# only the characters actually used by the deck + UI, emitting
# build/font.b64 for tools/build.mjs to inline.
# Run: bash tools/subset-font.sh
set -euo pipefail
cd "$(dirname "$0")/.."

mkdir -p build
FONT_URL="https://github.com/notofonts/noto-cjk/raw/main/Sans/Mono/NotoSansMonoCJKtc-Regular.otf"
FONT_OTF="build/NotoSansMonoCJKtc-Regular.otf"

if [ ! -f "$FONT_OTF" ]; then
  echo "downloading Noto Sans Mono CJK TC (OFL)…"
  curl -fL --retry 3 -o "$FONT_OTF" "$FONT_URL"
fi

# Collect every character used in card texts and UI strings.
node --input-type=module -e "
import { readFileSync, writeFileSync } from 'node:fs';
const sources = ['src/deck.js', 'src/index.html']
  .map((f) => readFileSync(f, 'utf8')).join('');
// Keep CJK, fullwidth punctuation, plus ASCII printable for Latin bits.
const chars = new Set([...sources].filter((c) => c.charCodeAt(0) > 0x2000));
for (let c = 0x20; c < 0x7f; c++) chars.add(String.fromCharCode(c));
writeFileSync('build/subset-chars.txt', [...chars].join(''));
console.log('subset:', chars.size, 'characters');
"

python3 -m fontTools.subset "$FONT_OTF" \
  --text-file=build/subset-chars.txt \
  --flavor=woff2 \
  --layout-features='*' \
  --no-hinting \
  --desubroutinize \
  --output-file=build/rivalry-mono.woff2

base64 -i build/rivalry-mono.woff2 | tr -d '\n' > build/font.b64
echo "✓ build/font.b64 ($(du -h build/rivalry-mono.woff2 | cut -f1) woff2)"
