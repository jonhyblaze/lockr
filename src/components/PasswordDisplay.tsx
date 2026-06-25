import { useEffect, useState } from "preact/hooks"
import copyToClipboard from "../lib/copyToClipbord"
import { Copy } from "./icons"
import { cn } from "../lib/cn"

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
    <div className="text-[20px] font-code flex gap-4 items-center justify-between bg-white border p-3 h-14 min-w-[350px]">
      <h3>{copied ? "Password is copied!" : password}</h3>
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
