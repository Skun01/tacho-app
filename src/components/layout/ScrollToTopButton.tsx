import { useState, useEffect } from 'react'
import { ArrowUp } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'

/**
 * Floating scroll-to-top button.
 * Appears when the user scrolls more than 400px down the page.
 * Reusable across any page.
 */
export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <Button
      size="icon"
      onClick={scrollToTop}
      aria-label="Cuộn lên đầu trang"
      className={`fixed bottom-8 right-8 z-40 h-11 w-11 rounded-xl shadow-[0_8px_32px_rgba(0,36,83,0.25)] bg-primary text-primary-foreground transition-all duration-300 hover:bg-primary-container hover:-translate-y-0.5 ${
        visible
          ? 'opacity-100 pointer-events-auto translate-y-0'
          : 'opacity-0 pointer-events-none translate-y-4'
      }`}
    >
      <ArrowUp size={18} weight="bold" />
    </Button>
  )
}
