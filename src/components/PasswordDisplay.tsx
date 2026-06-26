import { useEffect, useState } from "preact/hooks"
import copyToClipboard from "@/lib/copyToClipbord"
import { Copy } from "./ui/icons"
import { cn } from "@/lib/cn"

type Props = {
  password: string
}

const SCRAMBLE_GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*-_+="

const randomGlyph = () =>
  SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)]

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

const PasswordDisplay = ({ password }: Props) => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return

    const id = setTimeout(() => {
      setCopied(false)
    }, 1800)

    return () => clearTimeout(id)
  }, [copied])

  return (
    <div className="text-[20px] font-code flex gap-4 items-center justify-between bg-white border p-3 h-14 min-w-[350px]">
      <h3>{copied ? useScramble("Password is copied!") : useScramble(password)}</h3>
      <button
        type="button"
        onClick={() => {
          copyToClipboard(password)
          setCopied(true)
        }}
        disabled={copied}
        className={cn("cursor-pointer", copied && "cursor-default")}>
        <Copy className={cn("size-5", copied && "text-zinc-500")} />
      </button>
    </div>
  )
}

export default PasswordDisplay
