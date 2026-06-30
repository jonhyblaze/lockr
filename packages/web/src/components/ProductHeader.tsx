const ProductHeader = () => {
  return (
    <header className="relative flex items-center gap-2 pl-2 pt-12 ">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-7"
        aria-hidden="true">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      <span className="text-2xl font-code font-bold tracking-wide">Lockr</span>
    </header>
  )
}

export default ProductHeader
