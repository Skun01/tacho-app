import { Link } from 'react-router'
import { HOME_HERO } from '@/constants/home'
import heroIllustrationUrl from '@/assets/illustrations/hero-illustration.svg'

export function HeroSection() {
  return (
    <section id="introduction" className="relative min-h-screen overflow-hidden bg-background pt-24">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-16 px-8 py-16 lg:flex-row lg:items-center lg:py-24">
        <div className="flex flex-1 flex-col gap-8">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-secondary-container px-4 py-2">
            <span className="font-['Kiwi_Maru'] text-xs text-secondary">{HOME_HERO.kanjiBadge}</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
              {HOME_HERO.badgeLabel}
            </span>
          </div>

          <h1 className="font-['Kiwi_Maru'] text-5xl font-medium leading-[1.15] text-primary lg:text-6xl">
            {HOME_HERO.headline}
          </h1>

          <p className="max-w-md text-base leading-relaxed text-muted-foreground">
            {HOME_HERO.subheadline}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/register"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-container px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {HOME_HERO.ctaPrimary}
            </Link>
          </div>
        </div>

        <div className="flex flex-1 justify-center lg:justify-end">
          <HeroIllustration />
        </div>
      </div>
    </section>
  )
}

function HeroIllustration() {
  return (
    <div className="relative h-80 w-80 lg:h-[440px] lg:w-[440px]">
      <div className="absolute inset-0 overflow-hidden rounded-3xl bg-surface-container">
        <img src={heroIllustrationUrl} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="absolute -bottom-4 -right-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-tertiary shadow-[0_8px_32px_0_rgba(61,29,0,0.25)]">
        <span className="font-['Kiwi_Maru'] text-xl text-background">太</span>
      </div>
    </div>
  )
}
