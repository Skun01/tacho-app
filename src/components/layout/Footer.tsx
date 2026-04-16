import { Link } from 'react-router'
import { LANDING_FOOTER } from '@/constants/landing'

export function Footer() {
  const handleLinkClick = (href: string) => {
    if (!href.startsWith('#')) return

    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <footer className="bg-surface-container-highest py-16">
      <div className="mx-auto max-w-6xl px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/kitsune.svg"
                alt="Tacho logo"
                className="h-7 w-7 object-contain opacity-80"
              />
              <span className="text-base font-bold italic text-primary">
                {LANDING_FOOTER.brand}
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {LANDING_FOOTER.description}
            </p>
          </div>

          {LANDING_FOOTER.columns.map((column) => (
            <div key={column.heading} className="flex flex-col gap-4">
              <h4 className="text-sm font-bold text-foreground">{column.heading}</h4>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('#') ? (
                      <button
                        onClick={() => handleLinkClick(link.href)}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <p className="text-xs text-muted-foreground">{LANDING_FOOTER.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
