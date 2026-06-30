import { useEffect, useState } from "react"
import { Box, Text, useApp } from "ink"

import { generatePassword, generateFeedback, analyzePassword } from "@lockr/core"
import { copyToClipboard } from "../lib/clipboard"

export default function App({ length }: { length: number }) {
  const { exit } = useApp()

  // Generate exactly once (not on every render).
  const [password] = useState(() =>
    generatePassword({
      length,
      charset: { upper: true, lower: true, numbers: true, symbols: true }
    })
  )

  const [copied, setCopied] = useState(false)

  const score = analyzePassword(password)
  const { estimate, timeframe } = generateFeedback(length, score)

  useEffect(() => {
    setCopied(copyToClipboard(password))
    // Give Ink a tick to flush the final frame before tearing down.
    const timer = setTimeout(() => exit(), 50)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Box flexDirection="column" paddingY={1}>
      <Text bold color="cyan">
        {password}
      </Text>
      <Text color="gray">
        {estimate} · takes {timeframe} to crack
      </Text>
      <Text color={copied ? "green" : "yellow"}>
        {copied ? "✔ copied to clipboard" : "could not copy to clipboard"}
      </Text>
    </Box>
  )
}
