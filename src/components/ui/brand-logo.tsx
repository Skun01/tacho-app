import { Link } from 'react-router'
import kitsuneUrl from '@/assets/icons/kitsune.svg'
import { AUTH_BRAND } from '@/constants/auth'

interface BrandLogoProps {
  size?: 'sm' | 'md'
  variant?: 'dark' | 'light'
  className?: string
}

export function BrandLogo({ size = 'md', variant = 'dark', className }: BrandLogoProps) {
  const imgClass = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'
  const textClass = [
    'font-bold italic tracking-wide',
    size === 'sm' ? 'text-base' : 'text-lg',
    variant === 'light' ? 'text-background' : 'text-primary',
  ].join(' ')

  return (
    <Link to="/" className={`flex items-center gap-2.5 ${className ?? ''}`}>
      <img src={kitsuneUrl} alt={AUTH_BRAND.name} className={`${imgClass} object-contain`} />
      <span className={textClass}>{AUTH_BRAND.name}</span>
    </Link>
  )
}
