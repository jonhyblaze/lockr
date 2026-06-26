import { useEffect, useState } from "preact/hooks"
import { useScramble } from "@/hooks/useScramble"
import copyToClipboard from "@/lib/copyToClipbord"
import { Copy } from "./ui/icons"
import { cn } from "@/lib/cn"

type Props = {
  password: string
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
    <div className="se:text-[19px] sm:text-20 md:text-[21px] font-code flex gap-4 items-center justify-between bg-white border p-3 py-4">
      <h3 className="leading-1">{copied ? useScramble("Password is copied!") : useScramble(password)}</h3>
      <button
        type="button"
        onClick={() => {
          copyToClipboard(password)
          setCopied(true)
        }}
        disabled={copied}
        className={cn("cursor-pointer", copied && "cursor-default")}>
        <Copy className={cn("size-5 duration-150 transition-discrete", copied && "text-zinc-500")} />
      </button>
    </div>
  )
}

export default PasswordDisplay
