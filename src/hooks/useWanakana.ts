import { useEffect } from 'react'
import type { RefObject } from 'react'
import { bind, unbind } from 'wanakana'

interface UseWanakanaOptions {
  IMEMode?: boolean
  active?: boolean
}

export function useWanakana(
  ref: RefObject<HTMLInputElement | HTMLTextAreaElement | null>,
  options?: UseWanakanaOptions,
) {
  const { IMEMode = true, active = true } = options ?? {}

  useEffect(() => {
    const el = ref.current
    if (!el || !active) return
    bind(el, { IMEMode })
    return () => unbind(el)
  }, [ref, active, IMEMode])
}
