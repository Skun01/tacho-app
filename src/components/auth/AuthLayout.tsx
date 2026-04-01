import { BrandLogo } from './BrandLogo'

interface AuthLayoutProps {
  heading: string
  subheading: string
  children: React.ReactNode
  kanjiStrip?: string
  quoteJp?: string
  quoteVn?: string
  decorativeImage?: string
}

export function AuthLayout({
  heading,
  subheading,
  children,
  kanjiStrip = '学習記憶成長継続',
  quoteJp,
  quoteVn,
  decorativeImage,
}: AuthLayoutProps) {
  const leftPanelStyle: React.CSSProperties = decorativeImage
    ? {
        backgroundImage: `url(${decorativeImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {
        background:
          'linear-gradient(160deg, var(--primary) 0%, var(--primary-container) 100%)',
      }

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: 'var(--surface)' }}
    >
      <div
        className="relative hidden w-2/5 flex-col items-start justify-between overflow-hidden p-12 lg:flex"
        style={leftPanelStyle}
      >
        {decorativeImage && (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(0, 36, 83, 0.65)' }}
          />
        )}

        {/* Tất cả nội dung phải above overlay */}
        <div className="relative z-10 flex h-full flex-col justify-between">
          <BrandLogo variant="light" />

          {/* Kanji vertical strip */}
          <div
            className="absolute right-0 top-0 flex h-full items-center py-16 opacity-20"
            style={{ writingMode: 'vertical-rl' }}
            aria-hidden="true"
          >
            <span
              className="font-heading-jp text-4xl tracking-widest text-white select-none"
              style={{ letterSpacing: '0.3em' }}
            >
              {kanjiStrip}
            </span>
          </div>

          {/* Bottom quote */}
          {quoteJp && (
            <div className="flex flex-col gap-2">
              <p
                className="font-heading-jp text-3xl leading-tight"
                style={{ color: 'rgba(255,255,255,0.95)' }}
              >
                {quoteJp}
              </p>
              {quoteVn && (
                <p
                  className="text-sm"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                >
                  {quoteVn}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 lg:px-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <BrandLogo variant="dark" />
          </div>

          {/* Page heading */}
          <div className="mb-8 flex flex-col gap-2">
            <h1
              className="font-heading-vn text-2xl"
              style={{ color: 'var(--on-surface)' }}
            >
              {heading}
            </h1>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--on-surface-variant)' }}
            >
              {subheading}
            </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
