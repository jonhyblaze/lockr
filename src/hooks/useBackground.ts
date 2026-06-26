import type { Complexity } from "../lib/analyzer"

export function useBackground(complexity: Complexity) {
  const colors = {
    0: "bg-zinc-500/80",
    1: "bg-red-500/90",
    2: "bg-red-500/90",
    3: "bg-yellow-500/80",
    4: "bg-yellow-500/80",
    5: "bg-emerald-500/90",
    6: "bg-emerald-500/90",
    7: "bg-sky-500/80",
    8: "bg-indigo-500/80",
    9: "bg-indigo-500/80",
  } as const

  return colors[complexity]
}
