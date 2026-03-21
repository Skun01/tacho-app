import { BrandLogo } from '@/components/ui/brand-logo'
import { AUTH_BRAND } from '@/constants/auth'

interface AuthLayoutProps {
  kanjiDecor: string
  children: React.ReactNode
}

export function AuthLayout({ kanjiDecor, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-primary to-primary-container lg:flex lg:w-[44%] lg:flex-col lg:items-start lg:justify-between lg:p-16">
        <span className="pointer-events-none absolute -bottom-12 -right-12 select-none font-['Kiwi_Maru'] text-[22rem] font-medium leading-none text-background/[0.045]">
          {kanjiDecor}
        </span>

        <BrandLogo size="md" variant="light" />

        <p className="max-w-xs font-['Kiwi_Maru'] text-2xl font-medium leading-relaxed text-background/75">
          {AUTH_BRAND.tagline}
        </p>
      </aside>

      <main className="flex flex-1 flex-col items-center justify-center bg-background px-8 py-16">
        <div className="mb-8 lg:hidden">
          <BrandLogo size="sm" variant="dark" />
        </div>
        {children}
      </main>
    </div>
  )
}
