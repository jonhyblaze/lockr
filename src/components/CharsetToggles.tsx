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

  return (
    <ul className={className}>
      {charsetConfig.map((item) => (
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
  )
}

export default CharsetToggles
