import { Link } from 'react-router'
import { MagnifyingGlassIcon, BellIcon } from '@phosphor-icons/react'
import { BrandLogo } from '@/components/ui/brand-logo'
import { DASHBOARD_NAV } from '@/constants/dashboard'

export function DashboardNavbar() {
  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-[12px] shadow-[0_1px_0_0_rgba(29,28,19,0.06)]">
      <nav className="mx-auto flex max-w-5xl items-center gap-8 px-6 py-3">
        <BrandLogo size="sm" variant="dark" />

        <div className="flex items-center gap-6">
          {DASHBOARD_NAV.links.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-sm font-medium text-secondary transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-surface-container px-4 py-2">
            <MagnifyingGlassIcon size={14} className="shrink-0 text-muted-foreground" />
            <input
              type="text"
              placeholder={DASHBOARD_NAV.searchPlaceholder}
              className="w-48 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
            />
          </div>

          <button
            aria-label="Thông báo"
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-surface-container"
          >
            <BellIcon size={18} className="text-secondary" />
          </button>

          <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-primary to-primary-container" />
        </div>
      </nav>
    </header>
  )
}
