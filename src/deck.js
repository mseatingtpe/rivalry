// deck.js — card data + deck building logic for《對手》.
// Card texts are the implementation-side SSOT, mirroring SPEC.md verbatim.
// Do NOT edit any Chinese text or punctuation; some cards intentionally
// lack trailing punctuation — that is the original manuscript.

export const ACT_RECOGNITION = '辨識';
export const ACT_RIVAL = '對手';
export const ACT_PRICE = '代價';
export const ACT_BLANK = '留白';
export const ACT_FINAL = '終卡';

// Fixed in-act order (SPEC §卡片內容). Never reorder.
export const RECOGNITION_CARDS = [
  '此時此刻最喜歡的書',
  '如果可以穿越任何時空，最想看的演唱會是？',
  '最近最喜歡的瞬間',
  '不提職業與職稱，你會如何介紹你自己？',
  '說一件你最近改變心意的事。以前怎麼想，現在怎麼想。',
  '哪一件別人眼中的「無用」之事你很喜歡？',
  '你有一種不被大眾理解、極其私人的「偏愛」嗎？',
  '你上一次覺得被看見，是哪個瞬間？說畫面。',
  '哪一個童年瞬間，形塑了現在的你？',
  '說一次你決定信任一個人的瞬間。你看到了什麼？',
  '一個你很喜歡、但決定不擁有的東西。',
  '你最近一次說謊，是為了保護什麼？',
];

export const RIVAL_CARDS = [
  '朋友如何形容你時，你會很開心',
  '問我一個你猜沒有人問過我的問題。',
  '你覺得我誤解你最深的地方是哪裡？',
  '數到三，同時回答：對方身上一個你羨慕的能力。',
  '用你專業裡的一個詞，形容我們現在的關係。',
];

export const PRICE_CARDS = [
  '你上一次覺得自己「沒有才華」是什麼時候？',
  '你會奮不顧身的事',
  '你為愛付過最貴的一次代價是什麼',
  '你預設人會怎麼讓你失望？',
  '我身上有哪一部分，是因為認識你才長出來的？',
  '說一件你已經原諒、但沒說出口的事。',
];

export const BLANK_CARD = '乾杯！'; // 2026-08-16 Sunny amended (was 跳過這輪…)

export const FINAL_CARD = '我們不可能真正理解另外一個人。所以，約下一次。';

// ── English companions（DRAFT — Sunny 校對中；index-aligned with the
// arrays above. The final card stays Chinese-only by decision.）──
export const RECOGNITION_EN = [
  'Your favorite book, right at this moment.',
  'If you could travel to any time and place, which concert would you see?',
  'A recent moment you loved.',
  'Without mentioning your job or title, how would you introduce yourself?',
  "Something you've recently changed your mind about. What you thought then, what you think now.",
  "What 'useless' thing — in other people's eyes — do you love?",
  "Do you have a private fondness that most people wouldn't understand?",
  'The last time you felt truly seen — describe the scene.',
  'Which childhood moment shaped who you are now?',
  'Tell of a moment you decided to trust someone. What did you see?',
  'Something you love, but chose not to own.',
  'The last time you lied — what were you protecting?',
];

export const RIVAL_EN = [
  'What could a friend say about you that would make you happiest?',
  'Ask me a question you suspect no one has ever asked me.',
  'Where do you think I misunderstand you the most?',
  "Count to three, then answer together: one ability of the other's you envy.",
  'Describe our current relationship with one term from your profession.',
];

export const PRICE_EN = [
  'When did you last feel you had no talent?',
  'Something you would throw yourself into, no matter the cost.',
  "The highest price you've ever paid for love.",
  'How do you assume people will let you down?',
  "What part of me exists because I've known you?",
  "Something you've already forgiven, but never said aloud.",
];

export const BLANK_EN = 'Cheers!';

// ── deck building ──

const makeCards = (act, texts, ens) =>
  texts.map((text, i) => ({ act, text, en: ens[i] }));

/** The 23 question cards in canonical three-act order (no blank, no final). */
function orderedQuestions() {
  return [
    ...makeCards(ACT_RECOGNITION, RECOGNITION_CARDS, RECOGNITION_EN),
    ...makeCards(ACT_RIVAL, RIVAL_CARDS, RIVAL_EN),
    ...makeCards(ACT_PRICE, PRICE_CARDS, PRICE_EN),
  ];
}

const blankCard = () => ({ act: ACT_BLANK, text: BLANK_CARD, en: BLANK_EN });
const finalCard = () => ({ act: ACT_FINAL, text: FINAL_CARD }); // Chinese-only

/** Uniform in-place Fisher–Yates shuffle. */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Build a 25-card deck. The final card is always last and never shuffled.
 *
 * mode 'acts'   — three acts in fixed order; the blank card is inserted into
 *                 one of the 24 gaps of the 23-question sequence, uniformly
 *                 at random (SPEC §留白牌歸屬 實作詮釋).
 * mode 'shuffle'— all 24 cards (questions + blank) fully shuffled.
 */
export function buildDeck(mode) {
  if (mode !== 'acts' && mode !== 'shuffle') {
    throw new Error(`unknown mode: ${mode}`);
  }
  const questions = orderedQuestions();
  let deck;
  if (mode === 'acts') {
    const gap = Math.floor(Math.random() * (questions.length + 1)); // 0..23
    deck = [...questions.slice(0, gap), blankCard(), ...questions.slice(gap)];
  } else {
    deck = shuffle([...questions, blankCard()]);
  }
  deck.push(finalCard());
  return deck;
}

/**
 * Act a blank card belongs to, per SPEC: the act of the first non-blank
 * question after it; if none follows, the last act (代價).
 * `deck` may include the final card; the final card never claims a blank.
 */
export function blankActOf(deck, blankIndex) {
  for (let i = blankIndex + 1; i < deck.length; i++) {
    const { act } = deck[i];
    if (act !== ACT_BLANK && act !== ACT_FINAL) return act;
  }
  return ACT_PRICE;
}
