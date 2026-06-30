package password

import (
	_ "embed"
	"encoding/json"
	"math"
)

// feedback.json is copied from packages/core/feedback.json at build time
// (see Makefile `sync`). core is the single source of truth for the strings;
// this is a generated, gitignored copy so `go:embed` can reach it.
//
//go:embed feedback.json
var feedbackJSON []byte

type feedbackStrings struct {
	Short []string `json:"short"`
	Time  []string `json:"time"`
}

var feedback = loadFeedback()

func loadFeedback() feedbackStrings {
	var fb feedbackStrings
	_ = json.Unmarshal(feedbackJSON, &fb)
	return fb
}

type Complexity int

type charClass struct {
	size int
	test func(rune) bool
}

func isLower(r rune) bool { return r >= 'a' && r <= 'z' }
func isUpper(r rune) bool { return r >= 'A' && r <= 'Z' }
func isDigit(r rune) bool { return r >= '0' && r <= '9' }

// The four character classes, mirroring CHAR_SETS in packages/core/analyzer.ts.
// "symbol" is anything that is not a letter or digit ([^a-zA-Z0-9]).
var charClasses = []charClass{
	{size: 26, test: isLower},
	{size: 26, test: isUpper},
	{size: 10, test: isDigit},
	{size: 33, test: func(r rune) bool { return !isLower(r) && !isUpper(r) && !isDigit(r) }},
}

func clampFloat(value, min, max float64) float64 {
	return math.Min(max, math.Max(min, value))
}

func clampInt(value, min, max int) int {
	if value < min {
		return min
	}
	if value > max {
		return max
	}
	return value
}

// countSequential counts characters extending a run of 3+ ascending,
// descending, or repeated code points (e.g. "abc", "321", "aaaa").
func countSequential(runes []rune) int {
	count := 0
	for i := 2; i < len(runes); i++ {
		a, b, c := runes[i-2], runes[i-1], runes[i]
		ascending := b-a == 1 && c-b == 1
		descending := a-b == 1 && b-c == 1
		repeated := a == b && b == c
		if ascending || descending || repeated {
			count++
		}
	}
	return count
}

// Analyze estimates password strength on a 0–9 scale. Port of analyzePassword
// in packages/core/analyzer.ts; the math is kept identical.
func Analyze(pw string) Complexity {
	if pw == "" {
		return 0
	}

	runes := []rune(pw)

	poolSize := 0
	for _, class := range charClasses {
		for _, r := range runes {
			if class.test(r) {
				poolSize += class.size
				break
			}
		}
	}
	if poolSize == 0 {
		return 0
	}

	length := float64(len(runes))
	entropyBits := length * math.Log2(float64(poolSize))

	unique := make(map[rune]struct{})
	for _, r := range runes {
		unique[r] = struct{}{}
	}
	uniqueRatio := float64(len(unique)) / length

	sequencePenalty := clampFloat(float64(countSequential(runes))/length, 0, 0.5)

	effectiveBits := entropyBits * uniqueRatio * (1 - sequencePenalty)

	score := clampFloat(math.Round((effectiveBits/90)*9), 0, 9)
	return Complexity(int(score))
}

type Feedback struct {
	Estimate  string
	Timeframe string
}

// GenerateFeedback turns a score into a one-word verdict and a time-to-crack
// estimate. Port of generateFeedback in packages/core/analyzer.ts.
func GenerateFeedback(length int, score Complexity) Feedback {
	s := int(score)

	estimate := feedback.Short[clampInt(s, 0, len(feedback.Short)-1)]

	coefficient := 0.75 + (float64(s)/9)*1.25
	timeIndex := clampInt(int(math.Round(float64(length)*coefficient)), 0, len(feedback.Time)-1)
	timeframe := feedback.Time[timeIndex]

	return Feedback{Estimate: estimate, Timeframe: timeframe}
}
