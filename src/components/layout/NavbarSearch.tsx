import { Link, useLocation } from 'react-router'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { NAVBAR_COPY } from '@/constants/navbar'

export function NavbarSearch() {
  const { pathname } = useLocation()
  const isActive = pathname === '/search'

  return (
    <Link
      to="/search"
      aria-label={NAVBAR_COPY.searchLabel}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-secondary hover:bg-surface-container hover:text-primary'
      }`}
    >
      <MagnifyingGlassIcon size={18} weight={isActive ? 'bold' : 'regular'} />
    </Link>
  )
}
