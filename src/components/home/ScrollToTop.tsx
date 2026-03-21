import { useState, useEffect } from 'react'
import { ArrowUpIcon } from '@phosphor-icons/react'

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Cuộn lên đầu trang"
      className={`fixed bottom-8 right-8 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-background shadow-[0_4px_20px_0_rgba(0,36,83,0.3)] transition-all duration-300 hover:opacity-90 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
      }`}
    >
      <ArrowUpIcon size={18} weight="bold" />
    </button>
  )
}
