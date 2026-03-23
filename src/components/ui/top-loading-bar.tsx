import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'

type BarState = {
  width: number
  opacity: number
  transition: string
}

const HIDDEN: BarState = { width: 0, opacity: 0, transition: 'none' }
const INIT: BarState = { width: 0, opacity: 1, transition: 'none' }
const INDETERMINATE: BarState = {
  width: 85,
  opacity: 1,
  transition: 'width 380ms cubic-bezier(0.25, 1, 0.5, 1)',
}
const COMPLETE: BarState = {
  width: 100,
  opacity: 1,
  transition: 'width 140ms ease-in',
}
const FADE: BarState = {
  width: 100,
  opacity: 0,
  transition: 'width 140ms ease-in, opacity 260ms ease 80ms',
}

export function TopLoadingBar() {
  const { pathname, search } = useLocation()
  const [bar, setBar] = useState<BarState>(HIDDEN)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  function clear() {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  useEffect(() => {
    clear()

    setBar(INIT)

    const t1 = setTimeout(() => setBar(INDETERMINATE), 10)
    const t2 = setTimeout(() => setBar(COMPLETE), 400)
    const t3 = setTimeout(() => setBar(FADE), 560)
    const t4 = setTimeout(() => setBar(HIDDEN), 910)

    timers.current = [t1, t2, t3, t4]
    return clear
  }, [pathname, search])

  if (bar.opacity === 0 && bar.width === 0) return null

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[9999] h-[3px]"
    >
      <div
        style={{
          width: `${bar.width}%`,
          opacity: bar.opacity,
          transition: bar.transition,
        }}
        className="h-full rounded-r-full bg-primary shadow-[0_0_8px_rgba(0,36,83,0.5)]"
      />
    </div>
  )
}
