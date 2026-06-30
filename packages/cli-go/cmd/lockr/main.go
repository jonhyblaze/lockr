package main

import (
	"flag"
	"strconv"

	"github.com/jonhyblaze/lockr/packages/cli-go/internal/password"
)

const (
	defaultLength = 16
	maxLength     = 256
)

// resolveLength reads the desired length from flags (-l / --length) or a bare
// positional argument (`lockr 24`), mirroring the lockr-js CLI. Falls back to
// defaultLength and clamps to maxLength.
func resolveLength(flagValue int, positional []string) int {
	length := flagValue

	if length <= 0 && len(positional) > 0 {
		if n, err := strconv.Atoi(positional[0]); err == nil {
			length = n
		}
	}

	if length <= 0 {
		length = defaultLength
	}
	if length > maxLength {
		length = maxLength
	}

	return length
}

func main() {
	var lengthFlag int
	flag.IntVar(&lengthFlag, "l", 0, "password length")
	flag.IntVar(&lengthFlag, "length", 0, "password length")
	flag.Parse()

	length := resolveLength(lengthFlag, flag.Args())

	pw := password.Generate(password.Options{
		Length: length,
		Charset: password.Charset{
			Upper:   true,
			Lower:   true,
			Numbers: true,
			Symbols: true,
		},
	})

	score := password.Analyze(pw)
	fb := password.GenerateFeedback(length, score)

	copied := password.CopyToClipboard(pw)

	render(pw, fb, copied)
}
