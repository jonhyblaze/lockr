import { useEffect, useState } from "preact/hooks"

const SCRAMBLE_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*-_+="

const randomGlyph = () => SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)]

// Animates `target` from random characters that quickly settle, left-to-right,
// into the correct string. Returns the current frame's text to render.
const useScramble = (target: string) => {
  const [output, setOutput] = useState(target)

  useEffect(() => {
    if (!target) {
      setOutput(target)
      return
    }

    // Each character settles at a slightly different time so the reveal
    // looks like it's "locking in" from left to right.
    const settleAt = Array.from(target, (_, i) => i * 2.75 + Math.random() * 6)
    const totalFrames = Math.max(...settleAt) + 1

    let raf = 0
    let frame = 0

    const tick = () => {
      const text = Array.from(target, (char, i) =>
        char === " " || frame >= settleAt[i] ? char : randomGlyph()
      ).join("")

      setOutput(text)

      if (frame < totalFrames) {
        frame += 1
        raf = requestAnimationFrame(tick)
      }
    }

    raf = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(raf)
  }, [target])

  return output
}

export { useScramble }
