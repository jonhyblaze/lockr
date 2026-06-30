package password

import (
	"crypto/rand"
	"math/big"
)

type Charset struct {
	Upper   bool
	Lower   bool
	Numbers bool
	Symbols bool
}

type Options struct {
	Length  int
	Charset Charset
}

// Character classes — kept identical to packages/core/generator.ts so the
// analyzer scores passwords from either implementation the same way.
const (
	upperChars  = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	lowerChars  = "abcdefghijklmnopqrstuvwxyz"
	numberChars = "0123456789"
	symbolChars = "@#$%^&*"
)

// Generate builds a random password from the enabled character classes.
// Uses crypto/rand (the TS version uses Math.random; the byte output is random
// either way, but Go's CLI has no reason not to use a CSPRNG).
func Generate(opts Options) string {
	var chars string
	if opts.Charset.Upper {
		chars += upperChars
	}
	if opts.Charset.Lower {
		chars += lowerChars
	}
	if opts.Charset.Numbers {
		chars += numberChars
	}
	if opts.Charset.Symbols {
		chars += symbolChars
	}

	if len(chars) == 0 {
		return ""
	}

	pool := []rune(chars)
	result := make([]rune, opts.Length)
	for i := 0; i < opts.Length; i++ {
		n, err := rand.Int(rand.Reader, big.NewInt(int64(len(pool))))
		if err != nil {
			// crypto/rand failure is effectively unrecoverable; bail with what we have.
			return string(result[:i])
		}
		result[i] = pool[n.Int64()]
	}

	return string(result)
}
