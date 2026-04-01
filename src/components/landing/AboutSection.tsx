import { GithubLogoIcon, FacebookLogoIcon, EnvelopeIcon, LinkedinLogoIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { LANDING_ABOUT } from '@/constants/landing'
import avatarSrc from '@/assets/avatar.jpg'

const SOCIAL_ICONS = {
  github: GithubLogoIcon,
  facebook: FacebookLogoIcon,
  email: EnvelopeIcon,
  linkedin: LinkedinLogoIcon,
} as const

export function AboutSection() {
  return (
    <section
      id={LANDING_ABOUT.anchor}
      className="bg-surface py-24 px-8"
    >
      <div className="mx-auto max-w-6xl">
        {/* ── Section header ────────────────────────── */}
        <div className="mb-16 flex flex-col items-start gap-3">
          <h2
            className="text-4xl md:text-5xl font-extrabold text-on-surface"
            style={{ letterSpacing: '0.01em' }}
          >
            {LANDING_ABOUT.heading}
          </h2>
        </div>

        {/* ── 2-column layout ───────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* ── Left: Avatar ─────────────────────────── */}
          <div className="flex justify-center md:justify-start">
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-[1.5rem] bg-gradient-to-br from-primary/8 to-secondary/8"
              />
              <img src={avatarSrc} alt="Ảnh tác giả"
                className="relative z-10 w-64 h-64 md:w-72 md:h-72
                rounded-[1.25rem] object-cover object-center" />
            </div>
          </div>

          {/* ── Right: Text content ──────────────────── */}
          <div className="flex flex-col gap-6">
            {/* Name & role */}
            <div className="flex flex-col gap-1">
              {LANDING_ABOUT.name ? (
                <h3 className="text-2xl font-bold text-on-surface">
                  {LANDING_ABOUT.name}
                </h3>
              ) : (
                <div className="h-8 w-48 rounded-xl bg-surface-container-highest animate-pulse" />
              )}
              {LANDING_ABOUT.role ? (
                <p className="text-sm font-medium text-secondary">{LANDING_ABOUT.role}</p>
              ) : (
                <div className="h-4 w-36 rounded-full bg-surface-container animate-pulse mt-1" />
              )}
            </div>

            {/* Story */}
            {LANDING_ABOUT.story ? (
              <p className="text-base text-on-surface leading-relaxed">{LANDING_ABOUT.story}</p>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="h-4 w-full rounded-full bg-surface-container animate-pulse" />
                <div className="h-4 w-5/6 rounded-full bg-surface-container animate-pulse" />
                <div className="h-4 w-4/5 rounded-full bg-surface-container animate-pulse" />
                <div className="h-4 w-3/4 rounded-full bg-surface-container animate-pulse" />
                <p className="text-xs text-secondary/60 mt-1 italic">
                  ← {LANDING_ABOUT.storyPlaceholder}
                </p>
              </div>
            )}

            {/* Social links */}
            <div className="flex items-center gap-2 pt-2">
              {LANDING_ABOUT.socials.map((social) => {
                const Icon = SOCIAL_ICONS[social.icon]
                return (
                  <Button
                    key={social.label}
                    variant="ghost"
                    size="icon"
                    asChild
                    className="text-secondary hover:text-primary hover:bg-surface-container-highest"
                    title={social.label}
                  >
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                    >
                      <Icon size={20} />
                    </a>
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}