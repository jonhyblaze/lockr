import type { Complexity } from "@lockr/core"

export function useBackground(complexity: Complexity) {
  const colors = {
    0: "bg-stone-500/70",
    1: "bg-red-500/90",
    2: "bg-orange-500/80",
    3: "bg-amber-500/80",
    4: "bg-yellow-500/80",
    5: "bg-green-500/90",
    6: "bg-emerald-500/90",
    7: "bg-sky-500/80",
    8: "bg-blue-500/80",
    9: "bg-indigo-500/80",
  } as const

  return colors[complexity]
}
