import "./app.css"
import { Slider } from "./components/slider"
import { Copy } from "./components/icons"
import Checkbox from "./components/checkbox"
import { useDispatch, useSelector } from "react-redux"
import { setLength, toggleCharset, type Charset } from "./features/password/passwordSlice"
import { generatePassword } from "./lib/generator"
import { useMemo, useState } from "preact/hooks"
import type { RootState } from "./store/store"
import copyToClipboard from "./lib/copyToClipbord"
import PasswordDisplay from "./components/PasswordDisplay"

export function App() {
  const [tick, setTick] = useState(0)
  const dispatch = useDispatch()
  const length = useSelector((state: RootState) => state.password.length)
  const charset = useSelector((state: RootState) => state.password.charset)

  const password = useMemo(() => generatePassword({ length, charset }), [length, charset, tick])

  return (
    <>
      <main className="w-full h-full">
        <section class="bg-green-500 mx-auto px-4 space-y-8 w-full h-full flex flex-col md:flex-row items-center justify-center">
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
              <p className="font-code">Paranoid</p>
              <p className="font-code">It will take some time to hack this</p>
            </div>
            <div className="flex items-center-safe font-code gap-2">
              <p>Password length:</p>
              <div className="bg-white border px-2 py-0.5">{length}</div>
            </div>
            <Slider.Root
              min={0}
              max={24}
              step={1}
              onValueChange={(values: number[]) => dispatch(setLength(values[0]))}
              className="w-full h-5">
              <Slider.Track className="h-1.5 grow bg-gray-200">
                <Slider.Range className="h-full bg-gray-900" />
              </Slider.Track>
              <Slider.Thumb className="block w-5 h-5 rounded-full bg-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40" />
            </Slider.Root>
            <ul className="grid grid-cols-2 gap-y-10">
              {[
                { name: "upper", val: "ABC" },
                { name: "lower", val: "abc" },
                { name: "numbers", val: "123" },
                { name: "symbols", val: "@#$" }
              ].map((item) => (
                <li className="flex items-center gap-2" key={item.val}>
                  <Checkbox
                    name={item.name as keyof Charset}
                    checked={charset[item.name as keyof Charset]}
                    onChange={() => dispatch(toggleCharset(item.name as keyof Charset))}
                  />
                  <label className="font-code font-bold">{item.val}</label>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </>
  )
}
