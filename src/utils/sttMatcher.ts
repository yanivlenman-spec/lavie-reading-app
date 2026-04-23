// Strip Hebrew nikud (U+0591–U+05C7) and cantillation marks
export function stripNikud(text: string): string {
  return text.replace(/[\u0591-\u05C7]/g, '');
}

// Strip all non-letter, non-digit characters (punctuation, quotes, etc.)
function stripPunctuation(text: string): string {
  return text.replace(/[^\p{L}\p{N}]/gu, '');
}

// Chrome he-IL STT occasionally returns proper nouns as Latin transliterations.
// Map them back to Hebrew so matching works correctly.
const LATIN_TO_HEBREW: Record<string, string> = {
  lavie: 'לביא', lavi: 'לביא', lavia: 'לביא',
  ari: 'ארי', arie: 'ארי',
  ben: 'בן',
  yaniv: 'יניב',
  yafat: 'יפעת', yafet: 'יפעת',
};

// Full normalization: strip punctuation → strip nikud → trim → lowercase
// Also maps Latin name transliterations to Hebrew
function normalize(text: string): string {
  const stripped = stripNikud(stripPunctuation(text)).trim().toLowerCase();
  return LATIN_TO_HEBREW[stripped] ?? stripped;
}

const PHONEME_CONFUSIONS: Record<string, string> = {
  'ח': 'כ', 'כ': 'ח',
  'ש': 'ס', 'ס': 'ש',
  'ת': 'ט', 'ט': 'ת',
};

function isPhonemeConfusion(a: string, b: string): boolean {
  return PHONEME_CONFUSIONS[a] === b;
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : isPhonemeConfusion(a[i - 1], b[j - 1]) ? 0.5 : 1;
      dp[i][j] =
        cost === 0
          ? dp[i - 1][j - 1]
          : cost + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

// Short names (בן=2, ארי=3) need at least 1 edit allowed — threshold was 0 for len≤2
function maxEdits(wordLen: number): number {
  if (wordLen <= 2) return 1;
  if (wordLen <= 4) return 1;
  if (wordLen <= 6) return 2;
  return 3;
}

// Core word comparison — normalized, with prefix matching + Levenshtein
export function isWordMatch(target: string, recognized: string): boolean {
  const t = normalize(target);
  const r = normalize(recognized);
  if (!t || !r) return false;
  if (t === r) return true;

  // Prefix match: child may say partial word
  const shorter = Math.min(t.length, r.length);
  if (shorter >= 3 && Math.max(t.length, r.length) >= 4) {
    if (t.startsWith(r) || r.startsWith(t)) return true;
  }

  const threshold = maxEdits(Math.min(t.length, r.length));
  return levenshtein(t, r) <= threshold;
}

interface MatchResult {
  matched: boolean;
  advanceTo: number;
}

/**
 * Match phrase tokens against words starting at currentIndex.
 * Phase 1: find the first anchor token (current word or skip-ahead ±2).
 * Phase 2: greedily consume remaining tokens against subsequent words.
 * This lets a fluent reader say a full sentence and advance all words at once.
 */
function matchPhrase(phrase: string, words: string[], currentIndex: number): MatchResult {
  const tokens = phrase.trim().split(/\s+/).filter((w) => w.length > 0);
  if (tokens.length === 0) return { matched: false, advanceTo: currentIndex };

  // Phase 1: find anchor — first token that matches current or skip-ahead words
  let anchorTokenIdx = -1;
  let advanceIdx = currentIndex;

  outer:
  for (let ti = 0; ti < tokens.length; ti++) {
    const token = tokens[ti];
    // Match at current position
    if (words[advanceIdx] && isWordMatch(token, words[advanceIdx])) {
      anchorTokenIdx = ti;
      advanceIdx++;
      break outer;
    }
    // Skip-ahead 1 or 2 words
    if (normalize(token).length >= 2) {
      for (let skip = 1; skip <= 2; skip++) {
        if (words[advanceIdx + skip] && isWordMatch(token, words[advanceIdx + skip])) {
          anchorTokenIdx = ti;
          advanceIdx += skip + 1;
          break outer;
        }
      }
    }
  }

  if (anchorTokenIdx < 0) return { matched: false, advanceTo: currentIndex };

  // Phase 2: greedily match remaining tokens against consecutive words (no skip-ahead)
  for (let ti = anchorTokenIdx + 1; ti < tokens.length; ti++) {
    if (advanceIdx >= words.length) break;
    if (isWordMatch(tokens[ti], words[advanceIdx])) {
      advanceIdx++;
    }
    // Stop on first mismatch to avoid false advances from unrelated words
    else break;
  }

  return { matched: true, advanceTo: advanceIdx };
}

/**
 * Try each STT alternative phrase in order; return the first match found.
 * Passing all alternatives (not just result[0]) recovers proper nouns
 * that the primary hypothesis often misses.
 */
export function matchTranscriptToWord(
  phrases: string[],
  words: string[],
  currentIndex: number
): MatchResult {
  for (const phrase of phrases) {
    const result = matchPhrase(phrase, words, currentIndex);
    if (result.matched) return result;
  }
  return { matched: false, advanceTo: currentIndex };
}
