package main

import (
	"fmt"
	"os"

	"github.com/jonhyblaze/lockr/packages/cli-go/internal/password"
)

// ANSI styles, chosen to match the lockr-js (ink) output:
//   password  → bold cyan/teal
//   feedback  → gray
//   copied    → green   (fallback: yellow)
const (
	ansiReset    = "\033[0m"
	ansiBoldCyan = "\033[1;36m"
	ansiGray     = "\033[90m"
	ansiGreen    = "\033[32m"
	ansiYellow   = "\033[33m"
)

// colorEnabled reports whether to emit ANSI codes: only when stdout is a
// terminal and NO_COLOR is unset, so piped/redirected output stays clean.
func colorEnabled() bool {
	if _, ok := os.LookupEnv("NO_COLOR"); ok {
		return false
	}
	info, err := os.Stdout.Stat()
	if err != nil {
		return false
	}
	return info.Mode()&os.ModeCharDevice != 0
}

func paint(code, text string, enabled bool) string {
	if !enabled {
		return text
	}
	return code + text + ansiReset
}

// render prints the password, its feedback, and the clipboard status with
// styling that mirrors the ink CLI.
func render(pw string, fb password.Feedback, copied bool) {
	color := colorEnabled()

	fmt.Println(paint(ansiBoldCyan, pw, color))
	fmt.Println(paint(ansiGray, fmt.Sprintf("%s · takes %s to crack", fb.Estimate, fb.Timeframe), color))

	if copied {
		fmt.Println(paint(ansiGreen, "✔ copied to clipboard", color))
	} else {
		fmt.Println(paint(ansiYellow, "could not copy to clipboard", color))
	}
}
