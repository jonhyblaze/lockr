import type { RootState } from "@/store/store"
import { toggleCharset, type Charset } from "@/features/password/passwordSlice"
import Checkbox from "./ui/checkbox"
import { useDispatch, useSelector } from "react-redux"

const charsetConfig = [
  { name: "upper", val: "ABC" },
  { name: "lower", val: "abc" },
  { name: "numbers", val: "123" },
  { name: "symbols", val: "@#$" }
]

const CharsetToggles = ({ className }: { className?: string }) => {
  const dispatch = useDispatch()
  const charset = useSelector((state: RootState) => state.password.charset)

  const activeCount = Object.values(charset).filter(Boolean).length

  return (
    <ul className={className}>
      {charsetConfig.map((item) => {
        const key = item.name as keyof Charset
        const isChecked = charset[key]
        // The last active charset can't be turned off, so disable it to make
        // that clear instead of letting the click silently do nothing.
        const isLastActive = isChecked && activeCount === 1

        return (
        <li className="flex items-center gap-2" key={item.val}>
          <Checkbox
            name={key}
            checked={isChecked}
            disabled={isLastActive}
            onChange={() => dispatch(toggleCharset(key))}
          />
          <label className="font-code font-bold">{item.val}</label>
        </li>
        )
      })}
    </ul>
  )
}

export default CharsetToggles
