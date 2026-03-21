import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import kitsuneUrl from '@/assets/icons/kitsune.svg'
import { HOME_NAV } from '@/constants/home'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('introduction')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const sectionIds = HOME_NAV.links.map((link) => link.href.slice(1))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-[12px] shadow-[0_4px_32px_0_rgba(29,28,19,0.06)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={kitsuneUrl} alt="Tacho" className="h-10 w-10 object-contain" />
          <span className="text-lg font-bold italic tracking-wide text-primary">
            Tacho
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {HOME_NAV.links.map((link) => {
            const isActive = link.href === `#${activeSection}`
            return (
              <a
                key={link.label}
                href={link.href}
                className={`relative text-sm transition-colors duration-300 ${
                  isActive
                    ? 'font-semibold text-primary'
                    : 'font-medium text-secondary hover:text-primary'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
                )}
              </a>
            )
          })}
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="hidden text-sm font-medium text-secondary transition-colors hover:text-primary lg:block"
          >
            {HOME_NAV.loginLabel}
          </Link>
          <Link
            to="/register"
            className="rounded-xl bg-gradient-to-r from-primary to-primary-container px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {HOME_NAV.registerLabel}
          </Link>
        </div>
      </nav>
    </header>
  )
}
