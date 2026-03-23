import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import {
  MagnifyingGlassIcon,
  BellIcon,
  UserCircleIcon,
  GearIcon,
  SignOutIcon,
} from '@phosphor-icons/react'
import { BrandLogo } from '@/components/ui/brand-logo'
import { DASHBOARD_NAV } from '@/constants/dashboard'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/stores/authStore'

export function DashboardNavbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  function isActive(href: string) {
    return pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
  }

  const searchActive = pathname === '/search'
  const displayName = user?.displayName ?? DASHBOARD_NAV.guestName
  const initials = displayName.slice(0, 2).toUpperCase()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  async function handleLogout() {
    setOpen(false)
    await authService.logout()
    logout()
  }

  const menuItems = [
    {
      icon: <UserCircleIcon size={16} />,
      label: DASHBOARD_NAV.profileLabel,
      onClick: () => { setOpen(false); navigate('/profile') },
    },
    {
      icon: <GearIcon size={16} />,
      label: DASHBOARD_NAV.settingsLabel,
      onClick: () => { setOpen(false); navigate('/settings') },
    },
    {
      icon: <SignOutIcon size={16} />,
      label: DASHBOARD_NAV.logoutLabel,
      onClick: handleLogout,
      danger: true,
    },
  ]

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
          {/* Search */}
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

          {/* Notifications */}
          <button
            aria-label={DASHBOARD_NAV.notificationsLabel}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-surface-container"
          >
            <BellIcon size={18} className="text-secondary" />
          </button>

          {/* Profile dropdown */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2.5 rounded-full bg-surface-container-low px-3 py-1.5 transition-colors hover:bg-surface-container"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-container text-xs font-bold text-background">
                {initials}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-[10px] text-muted-foreground">{DASHBOARD_NAV.welcomePrefix}</p>
                <p className="text-sm font-semibold text-foreground leading-tight">{displayName}</p>
              </div>
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-2xl bg-background shadow-[0_8px_32px_0_rgba(29,28,19,0.14)] ring-1 ring-[#1d1c13]/8"
                >
                  {/* User header */}
                  <div className="border-b border-[#1d1c13]/8 px-4 py-3">
                    <p className="text-sm font-semibold text-foreground">{displayName}</p>
                    <p className="truncate text-xs text-muted-foreground">{user?.email ?? ''}</p>
                  </div>

                  {/* Menu items */}
                  <div className="p-1.5">
                    {menuItems.map(({ icon, label, onClick, danger }) => (
                      <button
                        key={label}
                        onClick={onClick}
                        className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors ${
                          danger
                            ? 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                            : 'text-foreground hover:bg-surface-container'
                        }`}
                      >
                        {icon}
                        {label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>
    </header>
  )
}
