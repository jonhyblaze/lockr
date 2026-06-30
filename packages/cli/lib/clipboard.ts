import { spawnSync } from "node:child_process"

/**
 * Copies text to the macOS clipboard via `pbcopy`. Returns true on success.
 * No-op-safe: if `pbcopy` is unavailable (non-macOS), it returns false rather
 * than throwing, so the CLI still prints the password.
 */
export function copyToClipboard(text: string): boolean {
  try {
    const result = spawnSync("pbcopy", { input: text })
    return result.status === 0
  } catch {
    return false
  }
}
