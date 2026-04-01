import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { ListIcon, XIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { LANDING_NAV } from '@/constants/landing'

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 24
      setScrolled(isScrolled)
      if (isScrolled) setMobileOpen(false)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleAnchorClick = (href: string) => {
    setMobileOpen(false)
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-surface/80 backdrop-blur-[12px] shadow-[0_4px_32px_0_rgba(29,28,19,0.06)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
        {/* ── Left: Logo ─────────────────── */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src="/kitsune.svg" alt="Tacho logo" className="w-8 h-8 object-contain" />
          <span className="text-lg font-bold tracking-wide text-secondary">
            {LANDING_NAV.brand}
          </span>
        </Link>

        {/* ── Center: Anchor nav (hidden mobile) ─ */}
        <ul className="hidden md:flex items-center gap-1">
          {LANDING_NAV.links.map((link) => (
            <li key={link.href}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAnchorClick(link.href)}
                className={scrolled
                  ? 'text-secondary hover:text-primary'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
                }
              >
                {link.label}
              </Button>
            </li>
          ))}
        </ul>

        {/* ── Right: CTA buttons (hidden mobile) ─ */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={scrolled
              ? 'text-primary'
              : 'text-white/80 hover:text-white hover:bg-white/10'
            }
          >
            <Link to="/login">{LANDING_NAV.ctaLogin}</Link>
          </Button>
          <Button
            size="sm"
            asChild
            className={scrolled
              ? 'bg-gradient-to-r from-primary to-primary-container text-primary-foreground hover:opacity-90'
              : 'bg-white/15 backdrop-blur-sm text-white border border-white/30 hover:bg-white/25'
            }
          >
            <Link to="/register">{LANDING_NAV.ctaRegister}</Link>
          </Button>
        </div>

        {/* ── Mobile: Hamburger ──────────── */}
        <Button
          variant="ghost"
          size="icon"
          className={`md:hidden ${
            scrolled ? 'text-primary' : 'text-white hover:bg-white/10'
          }`}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <XIcon size={22} /> : <ListIcon size={22} />}
        </Button>
      </nav>

      {/* ── Mobile dropdown ────────────────── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-surface/95 backdrop-blur-[12px] border-t border-border px-8 pb-6">
          <ul className="flex flex-col gap-1 pt-4">
            {LANDING_NAV.links.map((link) => (
              <li key={link.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-secondary hover:text-primary"
                  onClick={() => handleAnchorClick(link.href)}
                >
                  {link.label}
                </Button>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 pt-4">
            <Button variant="outline" asChild className="w-full">
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                {LANDING_NAV.ctaLogin}
              </Link>
            </Button>
            <Button
              asChild
              className="w-full bg-gradient-to-r from-primary to-primary-container text-primary-foreground hover:opacity-90"
            >
              <Link to="/register" onClick={() => setMobileOpen(false)}>
                {LANDING_NAV.ctaRegister}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
