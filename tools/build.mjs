// build.mjs — assemble the single-file deployable index.html.
// Inlines src/deck.js (exports stripped) and, when present, the subset
// font from build/font.b64 into src/index.html's placeholders.
// Run: node tools/build.mjs

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const p = (rel) => new URL(rel, new URL('..', import.meta.url));

const html = readFileSync(p('src/index.html'), 'utf8');
const deck = readFileSync(p('src/deck.js'), 'utf8').replace(/^export /gm, '');

let fontCss = '';
const faces = [
  ['build/font.b64', 'Rivalry Mono'],
  ['build/font-pixel.b64', 'Rivalry Pixel'],
];
for (const [file, family] of faces) {
  if (!existsSync(p(file))) {
    console.warn(`${file} not found — "${family}" falls back to system fonts.`);
    continue;
  }
  const b64 = readFileSync(p(file), 'utf8').trim();
  fontCss += [
    '@font-face {',
    `  font-family: "${family}";`,
    `  src: url(data:font/woff2;base64,${b64}) format("woff2");`,
    '  font-display: block;',
    '}\n',
  ].join('\n');
}

const out = html
  .replace('/*__FONT_CSS__*/', fontCss)
  .replace('//__DECK_JS__', deck);

for (const marker of ['__FONT_CSS__', '__DECK_JS__']) {
  if (out.includes(marker)) throw new Error(`placeholder ${marker} not replaced`);
}

writeFileSync(p('index.html'), out);
console.log(`✓ wrote index.html (${(out.length / 1024).toFixed(1)} KB) at ${root}`);
