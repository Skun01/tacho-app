import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { LANDING_FOOTER } from '@/constants/landing'

export function Footer() {
  const handleAnchorClick = (href: string) => {
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <footer className="bg-surface-container-highest py-10 px-8">
      <div className="mx-auto max-w-6xl">
        {/* ── Main row ────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between md:gap-0">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/kitsune.svg"
              alt="Tacho logo"
              className="w-7 h-7 object-contain opacity-70"
            />
            <span className="text-base font-bold tracking-wide text-primary">
              {LANDING_FOOTER.brand}
            </span>
          </Link>

          {/* Center: Nav links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center justify-center gap-1">
              {LANDING_FOOTER.navLinks.map((link) => (
                <li key={link.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAnchorClick(link.href)}
                    className="text-secondary hover:text-primary hover:bg-surface-container"
                  >
                    {link.label}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right: Copyright */}
          <p className="text-xs text-secondary/60 text-center md:text-right">
            {LANDING_FOOTER.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}
