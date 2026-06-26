import { Slider } from "@/components/slider"
import { setLength } from "@/features/password/passwordSlice"
import { useDispatch } from "react-redux"

export default function LengthRange({length} : {length: number}) {
  const dispatch = useDispatch()

  return (
    <>
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
    </>
  )
}
