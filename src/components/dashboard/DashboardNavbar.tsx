import { Link, useLocation } from 'react-router'
import { MagnifyingGlassIcon, BellIcon } from '@phosphor-icons/react'
import { BrandLogo } from '@/components/ui/brand-logo'
import { DASHBOARD_NAV } from '@/constants/dashboard'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/stores/authStore'

export function DashboardNavbar() {
  const { pathname } = useLocation()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  function isActive(href: string) {
    return pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
  }

  const searchActive = pathname === '/search'
  const displayName = user?.displayName ?? DASHBOARD_NAV.guestName
  const initials = displayName.slice(0, 1).toUpperCase()

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-[12px] shadow-[0_1px_0_0_rgba(29,28,19,0.06)]">
      <nav className="mx-auto flex max-w-5xl items-center gap-8 px-6 py-3">
        <BrandLogo size="sm" variant="dark" />

        {/* Nav links */}
        <div className="flex items-center gap-6">
          {DASHBOARD_NAV.links.map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.label}
                to={link.href}
                className={`relative pb-0.5 text-sm transition-colors duration-200 ${
                  active
                    ? 'font-semibold text-primary'
                    : 'font-medium text-secondary hover:text-primary'
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
                )}
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Search icon → /search */}
          <Link
            to="/search"
            aria-label={DASHBOARD_NAV.searchLabel}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
              searchActive
                ? 'bg-primary/10 text-primary'
                : 'text-secondary hover:bg-surface-container hover:text-primary'
            }`}
          >
            <MagnifyingGlassIcon size={18} weight={searchActive ? 'bold' : 'regular'} />
          </Link>

          <button
            aria-label={DASHBOARD_NAV.notificationsLabel}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-surface-container"
          >
            <BellIcon size={18} className="text-secondary" />
          </button>

          <button
            onClick={async () => {
              await authService.logout()
              logout()
            }}
            className="flex items-center gap-3 rounded-full bg-surface-container-low px-3 py-1.5 transition-colors hover:bg-surface-container"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-container text-sm font-bold text-background">
              {initials}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-[11px] text-muted-foreground">{DASHBOARD_NAV.welcomePrefix}</p>
              <p className="text-sm font-semibold text-foreground">{displayName}</p>
            </div>
            <span className="hidden text-xs font-semibold text-secondary sm:block">{DASHBOARD_NAV.logoutLabel}</span>
          </button>
        </div>
      </nav>
    </header>
  )
}
