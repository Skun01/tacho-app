import { Link } from 'react-router'
import { NAVBAR_COPY } from '@/constants/navbar'

/**
 * Logo Tacho dùng trong Navbar chính — link về /dashboard.
 * UI-only, không có state.
 */
export function NavbarLogo() {
  return (
    <Link
      to="/dashboard"
      className="flex items-center gap-2 shrink-0 mr-2"
      aria-label="Về trang chủ"
    >
      <img src="/kitsune.svg" alt="Tacho logo" className="w-7 h-7 object-contain" />
      <span className="hidden sm:block text-base font-bold tracking-wide text-secondary">
        {NAVBAR_COPY.brand}
      </span>
    </Link>
  )
}
