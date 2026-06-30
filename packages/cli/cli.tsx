import { render } from "ink"
import App from "./ui/App"

const DEFAULT_LENGTH = 16
const MAX_LENGTH = 256

/**
 * Reads the desired password length from the CLI args. Accepts either a bare
 * positional number (`lockr 24`) or a flag (`lockr -l 24` / `lockr --length 24`).
 * Falls back to DEFAULT_LENGTH and clamps to a sane maximum.
 */
function parseLength(argv: string[]): number {
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]

    if (arg === "-l" || arg === "--length") {
      const value = Number(argv[i + 1])
      if (Number.isInteger(value) && value > 0) return Math.min(value, MAX_LENGTH)
    } else if (/^\d+$/.test(arg)) {
      const value = Number(arg)
      if (value > 0) return Math.min(value, MAX_LENGTH)
    }
  }

  return DEFAULT_LENGTH
}

const length = parseLength(process.argv.slice(2))

render(<App length={length} />)
