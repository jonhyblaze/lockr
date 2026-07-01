import { LockrLogo, LockrName } from "./ui/icons"

const ProductHeader = () => {
  return (
    <header className="relative flex items-center gap-2 pl-2 pt-12 ">
      <LockrLogo className="size-12"/>
      <LockrName />
    </header>
  )
}

export default ProductHeader
