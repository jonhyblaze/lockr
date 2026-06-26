const Checkbox = ({
  name,
  checked,
  onChange
}: {
  name: string
  checked: boolean
  onChange: () => void
}) => {
  return (
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="size-7 accent-black hover:accent-zinc-700 rounded-none text-white"
    />
  )
}

export default Checkbox
