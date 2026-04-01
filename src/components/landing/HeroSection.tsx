import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { LANDING_HERO } from '@/constants/landing'
import heroBg from '@/assets/moon_and_mountain.jpg'

export function HeroSection() {
  return (
    <section
      id={LANDING_HERO.anchor}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <img src={heroBg} alt="" aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center" />

      {/* Wave decoration overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 600'%3E%3Cpath d='M0 300 Q225 200 450 300 T900 300 V600 H0Z' fill='%23adc6ff'/%3E%3Cpath d='M0 350 Q225 250 450 350 T900 350 V600 H0Z' fill='%23ffffff' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
        }}
      />

      {/* Text readability overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />

      {/* ── Decorative vertical Kanji strip ─── */}
      <div
        aria-hidden="true"
        className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-8 opacity-20"
        style={{ writingMode: 'vertical-rl' }}
      >
        <span className="font-['Kiwi_Maru'] text-5xl font-medium text-white tracking-widest select-none">
          日本語
        </span>
      </div>

      {/* ── Main content ─────────────────────── */}
      <div className="relative z-10 mx-auto max-w-4xl px-8 text-center">
        {/* Brand badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
          <span className="font-['Kiwi_Maru'] text-sm text-[#adc6ff]">太刀</span>
          <span className="text-xs font-medium text-white/80 tracking-wider uppercase">Tacho</span>
        </div>

        {/* Headline — Nunito handles Vietnamese diacritics correctly */}
        <h1
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6"
          style={{ letterSpacing: '0.01em' }}
        >
          {LANDING_HERO.headline.split('\n').map((line, i) => (
            <span key={i} className="block">{line}</span>
          ))}
        </h1>

        {/* Description */}
        <p className="mx-auto max-w-2xl text-base md:text-lg text-white/80 leading-relaxed mb-12">
          {LANDING_HERO.description}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-[#adc6ff] text-[#001838] font-bold hover:bg-[#c5d9ff] hover:shadow-[0_8px_32px_rgba(173,198,255,0.3)] hover:-translate-y-0.5 transition-all duration-500"
          >
            <Link to="/register">{LANDING_HERO.cta}</Link>
          </Button>
        </div>
      </div>

    </section>
  )
}
