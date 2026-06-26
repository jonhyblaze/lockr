const Checkbox = ({
  name,
  checked,
  onChange,
  disabled
}: {
  name: string
  checked: boolean
  onChange: () => void
  disabled?: boolean
}) => {
  return (
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className="size-7 accent-black hover:accent-zinc-700 rounded-none text-white disabled:cursor-not-allowed"
    />
  )
}

export default Checkbox
