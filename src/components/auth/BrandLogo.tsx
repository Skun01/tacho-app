import { Link } from 'react-router'

type BrandLogoVariant = 'light' | 'dark'

interface BrandLogoProps {
  variant?: BrandLogoVariant
  className?: string
}

export function BrandLogo({ variant = 'dark', className }: BrandLogoProps) {
  const styles: Record<BrandLogoVariant, React.CSSProperties> = {
    dark: {
      backgroundColor: 'var(--surface-container-high)',
      color: 'var(--primary)',
    },
    light: {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      color: 'rgba(255, 255, 255, 0.9)',
    },
  }

  return (
    <Link
      to="/"
      className={className}
      aria-label="Về trang chủ Tacho"
    >
      <span
        className="inline-block rounded px-3 py-1 text-xs font-semibold uppercase tracking-widest transition-opacity hover:opacity-80"
        style={{ ...styles[variant], borderRadius: '0.25rem' }}
      >
        Tacho
      </span>
    </Link>
  )
}
