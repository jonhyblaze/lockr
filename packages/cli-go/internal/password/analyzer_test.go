package password

import "testing"

// Golden values captured from the canonical TypeScript implementation
// (packages/core/analyzer.ts). If this test fails, the Go port has drifted
// from core — reconcile the two. Regenerate the table with:
//
//	npx tsx scratchpad/parity.ts   (see PR notes)
//
// Feedback uses len(password) as the length argument, matching the script.
func TestAnalyzeParityWithCore(t *testing.T) {
	cases := []struct {
		password  string
		score     Complexity
		estimate  string
		timeframe string
	}{
		{"", 0, "silly", "no time"},
		{"aaaa", 0, "silly", "few seconds"},
		{"abc123", 2, "compromised", "few hours"},
		{"P@ssw0rd", 5, "safe", "couple of years"},
		{"8xzX@MoCE5@QpnYwR5%i", 9, "paranoid", "forever"},
		{"1234567890", 2, "compromised", "few months"},
		{"Tr0ub4dour&3", 7, "secure", "as long as sun shines"},
		{"xxxxxxxxxxxxxxxx", 0, "silly", "couple of years"},
	}

	for _, tc := range cases {
		score := Analyze(tc.password)
		if score != tc.score {
			t.Errorf("Analyze(%q) score = %d, want %d", tc.password, score, tc.score)
		}

		fb := GenerateFeedback(len([]rune(tc.password)), score)
		if fb.Estimate != tc.estimate {
			t.Errorf("GenerateFeedback(%q).Estimate = %q, want %q", tc.password, fb.Estimate, tc.estimate)
		}
		if fb.Timeframe != tc.timeframe {
			t.Errorf("GenerateFeedback(%q).Timeframe = %q, want %q", tc.password, fb.Timeframe, tc.timeframe)
		}
	}
}
