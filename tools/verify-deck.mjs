// verify-deck.mjs — SPEC §驗收條件 ordering-constraint checks.
// Builds decks 1000 times per mode and asserts every constraint holds.
// Run: node tools/verify-deck.mjs

import {
  buildDeck,
  blankActOf,
  ACT_RECOGNITION,
  ACT_RIVAL,
  ACT_PRICE,
  ACT_BLANK,
  ACT_FINAL,
  RECOGNITION_CARDS,
  RIVAL_CARDS,
  PRICE_CARDS,
  FINAL_CARD,
} from '../src/deck.js';

const RUNS = 1000;
const EXPECTED_COUNTS = {
  [ACT_RECOGNITION]: 12,
  [ACT_RIVAL]: 5,
  [ACT_PRICE]: 6,
  [ACT_BLANK]: 1,
  [ACT_FINAL]: 1,
};
const SPEC_ORDER = {
  [ACT_RECOGNITION]: RECOGNITION_CARDS,
  [ACT_RIVAL]: RIVAL_CARDS,
  [ACT_PRICE]: PRICE_CARDS,
};

let failures = 0;
function assert(cond, mode, run, msg) {
  if (!cond) {
    failures++;
    console.error(`✗ [${mode} #${run}] ${msg}`);
  }
}

function checkCommon(deck, mode, run) {
  assert(deck.length === 25, mode, run, `deck has ${deck.length} cards, want 25`);
  assert(
    deck[24].act === ACT_FINAL && deck[24].text === FINAL_CARD,
    mode, run, 'final card is not last'
  );
  assert(
    deck.slice(0, 24).every((c) => c.act !== ACT_FINAL),
    mode, run, 'final card appears before the end'
  );

  const counts = {};
  for (const c of deck) counts[c.act] = (counts[c.act] || 0) + 1;
  for (const [act, want] of Object.entries(EXPECTED_COUNTS)) {
    assert(counts[act] === want, mode, run, `${act} count ${counts[act]}, want ${want}`);
  }

  // In-act relative order must match SPEC exactly — in BOTH modes for
  // 'acts', and as a text-integrity check via set membership in 'shuffle'.
  for (const [act, specTexts] of Object.entries(SPEC_ORDER)) {
    const actual = deck.filter((c) => c.act === act).map((c) => c.text);
    if (mode === 'acts') {
      assert(
        JSON.stringify(actual) === JSON.stringify(specTexts),
        mode, run, `${act} in-act order differs from SPEC`
      );
    } else {
      assert(
        JSON.stringify([...actual].sort()) === JSON.stringify([...specTexts].sort()),
        mode, run, `${act} card texts differ from SPEC`
      );
    }
  }
}

function checkActsContiguity(deck, run) {
  // Map every card (blank included, via blankActOf) to an effective act,
  // then require exactly three contiguous, ordered, gapless blocks.
  const effective = deck.slice(0, 24).map((c, i) =>
    c.act === ACT_BLANK ? blankActOf(deck, i) : c.act
  );
  const collapsed = effective.filter((a, i) => i === 0 || a !== effective[i - 1]);
  assert(
    JSON.stringify(collapsed) === JSON.stringify([ACT_RECOGNITION, ACT_RIVAL, ACT_PRICE]),
    'acts', run,
    `acts are not three contiguous ordered blocks: ${collapsed.join('→')}`
  );
}

const blankGapSeen = new Set();
for (let run = 1; run <= RUNS; run++) {
  const acts = buildDeck('acts');
  checkCommon(acts, 'acts', run);
  checkActsContiguity(acts, run);
  blankGapSeen.add(acts.findIndex((c) => c.act === ACT_BLANK));

  const shuffled = buildDeck('shuffle');
  checkCommon(shuffled, 'shuffle', run);
}

// Sanity: blank insertion actually spreads across gaps (not stuck at one spot).
assert(blankGapSeen.size > 10, 'acts', RUNS, `blank card only landed in ${blankGapSeen.size} positions over ${RUNS} runs`);

if (failures) {
  console.error(`\n${failures} assertion(s) failed.`);
  process.exit(1);
}
console.log(`✓ all constraints held for ${RUNS} runs × 2 modes (blank landed in ${blankGapSeen.size}/24 gaps)`);
