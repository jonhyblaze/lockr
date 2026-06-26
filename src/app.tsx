import { useSelector } from "react-redux"
import { generatePassword } from "./lib/generator"
import { useEffect, useState } from "preact/hooks"
import type { RootState } from "./store/store"
import { useBackground } from "./hooks/useBackground"
import { useScramble } from "./hooks/useScramble"
import { cn } from "./lib/cn"
import analyzePassword, { generateFeedback } from "./lib/analyzer"
import PasswordDisplay from "./components/PasswordDisplay"
import CharsetToggles from "./components/CharsetToggles"
import LengthSlider from "./components/LengthSlider"
import ProductHeader from "./components/ProductHeader"
import GenerateButton from "./components/GenerateButton"

export function App() {
  const length = useSelector((state: RootState) => state.password.length)
  const charset = useSelector((state: RootState) => state.password.charset)

  const [password, setPassword] = useState(() => generatePassword({ length, charset }))

  const complexity = analyzePassword(password)
  const bg = useBackground(complexity)
  const { estimate, timeframe } = generateFeedback(length, complexity)

  const regenerate = () => setPassword(generatePassword({ length, charset }))

  useEffect(() => { regenerate() }, [length, charset])


  return (
    <main className={cn("w-full h-full px-4", bg)}>
      <ProductHeader />
      <div class="w-full h-full flex flex-col justify-center sm:items-center">
        <header className="pb-4 sm:w-110">
          <h1 class="text-[26px] se:text-3xl font-bold font-code pb-5">Password Generator</h1>
          <PasswordDisplay password={password} />
          <GenerateButton onGenerate={regenerate} />
          <footer className="mt-6">
            <p className="font-code capitalize pb-2">{useScramble(estimate)}</p>
            <p className="min-h-14 font-code">{useScramble(`It will take ${timeframe} to crack it`)}</p>
          </footer>
        </header>
        <div className="sm:w-110">
          <LengthSlider className="pb-8 space-y-3" sliderClsx="w-[98%] sm:w-108" />
          <CharsetToggles className="grid grid-cols-4 gap-5 sm:gap-15" />
        </div>
      </div>
    </main>
  )
}
