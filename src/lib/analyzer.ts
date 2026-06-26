export type Complexity = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

// The four character classes a password can draw from, with the size of
// each class's alphabet (used to estimate the brute-force search space).
const CHAR_SETS = [
  { name: "lowercase", regex: /[a-z]/, size: 26 },
  { name: "uppercase", regex: /[A-Z]/, size: 26 },
  { name: "digit", regex: /[0-9]/, size: 10 },
  { name: "symbol", regex: /[^a-zA-Z0-9]/, size: 33 }
] as const


const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

// Counts characters that extend a run of 3+ ascending, descending, or
// repeated code points (e.g. "abc", "321", "aaaa") — these are predictable.
const countSequential = (password: string) => {
  let count = 0
  for (let i = 2; i < password.length; i++) {
    const a = password.charCodeAt(i - 2)
    const b = password.charCodeAt(i - 1)
    const c = password.charCodeAt(i)
    const ascending = b - a === 1 && c - b === 1
    const descending = a - b === 1 && b - c === 1
    const repeated = a === b && b === c
    if (ascending || descending || repeated) count++
  }
  return count
}

const feedbackMap = {
  short: ["silly", "poor", "compromised", "fragile", "descent", "safe", "solid", "secure", "overkill", "paranoid"],
  time: [
    "no time",
    "split seconds",
    "less than 1 second",
    "few seconds",
    "less than minute",
    "less than an hour",
    "few hours",
    "a busy day",
    "a week",
    "a month",
    "few months",
    "about a year",
    "couple of years",
    "a decade",
    "a century",
    "thousands of years",
    "half a million years",
    "a million years",
    "100 million years",
    "a billion years",
    "a trillion years",
    "as long as sun shines",
    "as long as galaxy expands",
    "forever"
  ]
}

/**
 * Estimates password strength on a 0–9 scale.
 *
 * Combines three signals:
 *  - search-space entropy: length × log2(size of the combined alphabet),
 *    which rewards both longer passwords and more character classes;
 *  - character variety: the ratio of unique characters, penalizing
 *    passwords padded with repeats;
 *  - predictability: a penalty for ascending/descending/repeated runs.
 */
const analyzePassword = (password: string): Complexity => {
  if (!password) return 0

  // How many of the 4 classes are present and the combined alphabet size.
  const present = CHAR_SETS.filter((set) => set.regex.test(password))
  const poolSize = present.reduce((sum, set) => sum + set.size, 0)
  if (poolSize === 0) return 0

  const entropyBits = password.length * Math.log2(poolSize)

  // 0..1: lower when the same characters are reused.
  const uniqueRatio = new Set(password).size / password.length

  // 0..0.5: higher when more of the password sits in predictable runs.
  const sequencePenalty = clamp(countSequential(password) / password.length, 0, 0.5)

  // Entropy discounted for the structural weaknesses above.
  const effectiveBits = entropyBits * uniqueRatio * (1 - sequencePenalty)

  // Map effective bits onto 0–9. ~90 bits is treated as "max strength".
  const score = clamp(Math.round((effectiveBits / 90) * 9), 0, 9)

  return score as Complexity
}

export type Feedback = {
  estimate: string
  timeframe: string
}

/**
 * Turns a strength score into human-readable feedback: a one-word verdict and
 * a rough "time to crack" estimate.
 *
 *  - `estimate` is indexed directly by the 0–9 score, so it tracks complexity.
 *  - `timeframe` is driven by `length` but scaled by a coefficient so it doesn't
 *    read as a flat, hardcoded line. The coefficient mirrors the idea of
 *    "1.0 for a single charset, +0.25 per extra charset, ±0.25 for entropy":
 *    those signals are already folded into the score, so we expand the score
 *    back out across the same ~0.75 (weak) → ~2.0 (rich) range. Richer
 *    passwords stretch each character into a longer estimate; weaker ones
 *    compress it.
 */
const generateFeedback = (length: number, score: Complexity): Feedback => {
  const estimate = feedbackMap.short[clamp(score, 0, feedbackMap.short.length - 1)]

  const coefficient = 0.75 + (score / 9) * 1.25
  const timeIndex = clamp(Math.round(length * coefficient), 0, feedbackMap.time.length - 1)
  const timeframe = feedbackMap.time[timeIndex]

  return { estimate, timeframe }
}

export { generateFeedback }
export default analyzePassword
