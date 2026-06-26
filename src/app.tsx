import "./app.css"

import { useSelector } from "react-redux"

import { generatePassword } from "./lib/generator"
import { useMemo, useState } from "preact/hooks"
import type { RootState } from "./store/store"
import { useBackground } from "./hooks/useBackground"
import { cn } from "./lib/cn"
import analyzePassword from "./lib/analyzer"
import PasswordDisplay from "./components/PasswordDisplay"
import CharsetToggles from "./components/CharsetToggles"
import LengthRange from "./components/LengthRange"

export function App() {
  const [tick, setTick] = useState(0)

  const length = useSelector((state: RootState) => state.password.length)
  const charset = useSelector((state: RootState) => state.password.charset)
  const password = useMemo(() => generatePassword({ length, charset }), [length, charset, tick])
  const complexity = analyzePassword(password)
  const bg = useBackground(complexity)


  return (
    <>
      <main className={cn("w-full h-full", bg)} >
        <section class="mx-auto px-4 space-y-8 w-full h-full flex flex-col md:flex-row items-center justify-center">
          <header className="">
            <h1 class="text-3xl font-bold font-code">Password Generator</h1>
          </header>
          <div className="space-y-4">
            <PasswordDisplay password={password} />
            <button
              type="button"
              onClick={() => {
                setTick((prev) => prev + 1)
              }}
              className="cursor-pointer bg-black border-black text-white block w-full p-3 font-code text-[21px] font-bold">
              Generate
            </button>
            <div className="space-y-2">
              <p className="font-code">Paranoid - {complexity}</p>
              <p className="font-code">It will take some time to hack this</p>
            </div>
            <LengthRange length={length} />
            <CharsetToggles className="grid grid-cols-2 gap-y-10"/>
          </div>
        </section>
      </main>
    </>
  )
}
