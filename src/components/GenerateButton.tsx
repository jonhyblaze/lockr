import { cn } from "@/lib/cn"

const GenerateButton = ({ onGenerate, className }: { onGenerate: () => void; className?: string }) => (
  <button
    type="button"
    onClick={onGenerate}
    className={cn(
      "w-full text-[21px] leading-1 font-code font-bold bg-black border-black text-white p-3 py-6.25 cursor-pointer",
      className
    )}>
    Generate
  </button>
)

export default GenerateButton
