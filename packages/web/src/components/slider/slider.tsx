import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react"
import type {
  CSSProperties,
  HTMLAttributes,
  KeyboardEvent as ReactKeyboardEvent,
  MutableRefObject,
  PointerEvent as ReactPointerEvent,
  Ref,
} from "react"

type SpanAttrs = HTMLAttributes<HTMLSpanElement>

type Orientation = "horizontal" | "vertical"

interface SliderContextValue {
  values: number[]
  min: number
  max: number
  step: number
  disabled: boolean
  orientation: Orientation
  trackRef: MutableRefObject<HTMLSpanElement | null>
  registerThumb: (index: number, el: HTMLSpanElement | null) => void
  startDragging: (event: ReactPointerEvent<HTMLSpanElement>, thumbIndex?: number) => void
  setValueAtIndex: (index: number, value: number) => void
}

const SliderContext = createContext<SliderContextValue | null>(null)

const useSliderContext = () => {
  const ctx = useContext(SliderContext)
  if (!ctx) throw new Error("Slider parts must be rendered inside <Slider.Root>")
  return ctx
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

const snapToStep = (v: number, step: number, min: number) => {
  const stepped = Math.round((v - min) / step) * step + min
  return Number(stepped.toFixed(10))
}

const assignRef = <T,>(ref: Ref<T> | undefined, node: T | null) => {
  if (!ref) return
  if (typeof ref === "function") ref(node)
  else (ref as MutableRefObject<T | null>).current = node
}

interface RootProps extends Omit<SpanAttrs, "defaultValue" | "onChange" | "style"> {
  value?: number[]
  defaultValue?: number[]
  onValueChange?: (value: number[]) => void
  onValueCommit?: (value: number[]) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  orientation?: Orientation
  style?: CSSProperties
}

const Root = forwardRef<HTMLSpanElement, RootProps>(function SliderRoot(
  {
    value,
    defaultValue = [0],
    onValueChange,
    onValueCommit,
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    orientation = "horizontal",
    className,
    style,
    children,
    onPointerDown,
    ...rest
  },
  forwardedRef,
) {
  const [internalValues, setInternalValues] = useState<number[]>(defaultValue)
  const isControlled = value !== undefined
  const values = isControlled ? value! : internalValues

  const valuesRef = useRef(values)
  valuesRef.current = values

  const trackRef = useRef<HTMLSpanElement | null>(null)
  const thumbRefs = useRef<(HTMLSpanElement | null)[]>([])
  const activeThumb = useRef<number | null>(null)

  const commit = useCallback(
    (next: number[]) => {
      const prev = valuesRef.current
      if (next.length === prev.length && next.every((v, i) => v === prev[i])) return
      valuesRef.current = next
      if (!isControlled) setInternalValues(next)
      onValueChange?.(next)
    },
    [isControlled, onValueChange],
  )

  const setValueAtIndex = useCallback(
    (index: number, raw: number) => {
      const snapped = clamp(snapToStep(raw, step, min), min, max)
      const next = valuesRef.current.slice()
      next[index] = snapped
      next.sort((a, b) => a - b)
      commit(next)
    },
    [commit, max, min, step],
  )

  const getValueFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const track = trackRef.current
      if (!track) return min
      const rect = track.getBoundingClientRect()
      const pct =
        orientation === "horizontal"
          ? clamp((clientX - rect.left) / rect.width, 0, 1)
          : clamp(1 - (clientY - rect.top) / rect.height, 0, 1)
      return pct * (max - min) + min
    },
    [max, min, orientation],
  )

  const findClosestThumb = useCallback((raw: number) => {
    const arr = valuesRef.current
    let closest = 0
    let dist = Infinity
    for (let i = 0; i < arr.length; i++) {
      const d = Math.abs(arr[i] - raw)
      if (d < dist) {
        dist = d
        closest = i
      }
    }
    return closest
  }, [])

  const startDragging = useCallback(
    (event: ReactPointerEvent<HTMLSpanElement>, thumbIndex?: number) => {
      if (disabled) return
      const raw = getValueFromPointer(event.clientX, event.clientY)
      const index = thumbIndex ?? findClosestThumb(raw)
      activeThumb.current = index
      setValueAtIndex(index, raw)
      thumbRefs.current[index]?.focus()

      const handleMove = (e: PointerEvent) => {
        const next = getValueFromPointer(e.clientX, e.clientY)
        if (activeThumb.current !== null) {
          setValueAtIndex(activeThumb.current, next)
        }
      }
      const handleUp = () => {
        window.removeEventListener("pointermove", handleMove)
        window.removeEventListener("pointerup", handleUp)
        activeThumb.current = null
        onValueCommit?.(valuesRef.current)
      }
      window.addEventListener("pointermove", handleMove)
      window.addEventListener("pointerup", handleUp)
    },
    [disabled, findClosestThumb, getValueFromPointer, onValueCommit, setValueAtIndex],
  )

  const registerThumb = useCallback((index: number, el: HTMLSpanElement | null) => {
    thumbRefs.current[index] = el
  }, [])

  const ctx = useMemo<SliderContextValue>(
    () => ({
      values,
      min,
      max,
      step,
      disabled,
      orientation,
      trackRef,
      registerThumb,
      startDragging,
      setValueAtIndex,
    }),
    [
      values,
      min,
      max,
      step,
      disabled,
      orientation,
      registerThumb,
      startDragging,
      setValueAtIndex,
    ],
  )

  const handlePointerDown = (e: ReactPointerEvent<HTMLSpanElement>) => {
    onPointerDown?.(e)
    if (e.defaultPrevented || disabled) return
    e.preventDefault()
    startDragging(e)
  }

  const rootStyle: CSSProperties = {
    position: "relative",
    touchAction: "none",
    userSelect: "none",
    display: orientation === "horizontal" ? "flex" : "inline-flex",
    flexDirection: orientation === "horizontal" ? "row" : "column",
    alignItems: "center",
    ...style,
  }

  return (
    <SliderContext.Provider value={ctx}>
      <span
        ref={forwardedRef}
        data-orientation={orientation}
        data-disabled={disabled || undefined}
        className={className}
        style={rootStyle}
        onPointerDown={handlePointerDown}
        {...rest}
      >
        {children}
      </span>
    </SliderContext.Provider>
  )
})

interface TrackProps extends Omit<SpanAttrs, "style"> {
  style?: CSSProperties
}

const Track = forwardRef<HTMLSpanElement, TrackProps>(function SliderTrack(
  { className, style, children, ...rest },
  forwardedRef,
) {
  const { trackRef, orientation, disabled } = useSliderContext()

  const setRef = (el: HTMLSpanElement | null) => {
    trackRef.current = el
    assignRef(forwardedRef, el)
  }

  return (
    <span
      ref={setRef}
      data-orientation={orientation}
      data-disabled={disabled || undefined}
      className={className}
      style={{ position: "relative", ...style }}
      {...rest}
    >
      {children}
    </span>
  )
})

interface RangeProps extends Omit<SpanAttrs, "style"> {
  style?: CSSProperties
}

const Range = forwardRef<HTMLSpanElement, RangeProps>(function SliderRange(
  { className, style, ...rest },
  forwardedRef,
) {
  const { values, min, max, orientation, disabled } = useSliderContext()
  const span = max - min || 1
  const lo = Math.min(...values)
  const hi = values.length > 1 ? Math.max(...values) : lo
  const startPct = ((lo - min) / span) * 100
  const endPct = ((hi - min) / span) * 100
  const fillFromStart = values.length === 1

  const positional: CSSProperties =
    orientation === "horizontal"
      ? {
          left: fillFromStart ? 0 : `${startPct}%`,
          right: `${100 - endPct}%`,
        }
      : {
          bottom: fillFromStart ? 0 : `${startPct}%`,
          top: `${100 - endPct}%`,
        }

  return (
    <span
      ref={forwardedRef}
      data-orientation={orientation}
      data-disabled={disabled || undefined}
      className={className}
      style={{ position: "absolute", ...positional, ...style }}
      {...rest}
    />
  )
})

interface ThumbProps extends Omit<SpanAttrs, "style"> {
  index?: number
  style?: CSSProperties
}

const Thumb = forwardRef<HTMLSpanElement, ThumbProps>(function SliderThumb(
  { index = 0, className, style, onKeyDown, onPointerDown, ...rest },
  forwardedRef,
) {
  const {
    values,
    min,
    max,
    step,
    disabled,
    orientation,
    registerThumb,
    startDragging,
    setValueAtIndex,
  } = useSliderContext()

  const value = values[index] ?? min
  const span = max - min || 1
  const pct = ((value - min) / span) * 100

  const setRef = (el: HTMLSpanElement | null) => {
    registerThumb(index, el)
    assignRef(forwardedRef, el)
  }

  const positional: CSSProperties =
    orientation === "horizontal"
      ? { left: `${pct}%`, top: "50%", transform: "translate(-50%, -50%)" }
      : { bottom: `${pct}%`, left: "50%", transform: "translate(-50%, 50%)" }

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLSpanElement>) => {
    onKeyDown?.(e)
    if (e.defaultPrevented || disabled) return
    const bigStep = Math.max(step, (max - min) / 10)
    let next: number | null = null
    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        next = value + step
        break
      case "ArrowLeft":
      case "ArrowDown":
        next = value - step
        break
      case "PageUp":
        next = value + bigStep
        break
      case "PageDown":
        next = value - bigStep
        break
      case "Home":
        next = min
        break
      case "End":
        next = max
        break
    }
    if (next === null) return
    e.preventDefault()
    setValueAtIndex(index, next)
  }

  const handlePointerDown = (e: ReactPointerEvent<HTMLSpanElement>) => {
    onPointerDown?.(e)
    if (e.defaultPrevented || disabled) return
    e.stopPropagation()
    e.preventDefault()
    startDragging(e, index)
  }

  return (
    <span
      ref={setRef}
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-orientation={orientation}
      aria-disabled={disabled || undefined}
      data-orientation={orientation}
      data-disabled={disabled || undefined}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      className={className}
      style={{ position: "absolute", ...positional, ...style }}
      {...rest}
    />
  )
})

export const Slider = {
  Root,
  Track,
  Range,
  Thumb,
}

export type { RootProps as SliderRootProps, TrackProps as SliderTrackProps, RangeProps as SliderRangeProps, ThumbProps as SliderThumbProps }
