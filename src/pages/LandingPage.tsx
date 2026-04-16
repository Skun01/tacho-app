import { LandingNavbar } from '@/components/landing/LandingNavbar'
import { Footer } from '@/components/layout/Footer'
import { ScrollToTopButton } from '@/components/layout/ScrollToTopButton'
import { HeroSection } from '@/components/landing/HeroSection'
import { KnowledgeSection } from '@/components/landing/KnowledgeSection'
import { AboutSection } from '@/components/landing/AboutSection'
import { PageHelmet } from '@/components/seo/PageHelmet'

export function LandingPage() {
  return (
    <>
      <PageHelmet
        title="Trang chủ"
        description="Tacho giúp bạn học tiếng Nhật với từ vựng, ngữ pháp và kanji trong một trải nghiệm liền mạch."
      />
      <LandingNavbar />

      <main>
        {/* Section 2 — Hero */}
        <HeroSection />

        {/* Section 3 — Kho tri thức */}
        <KnowledgeSection />

        {/* Section 4 — Về tôi */}
        <AboutSection />
      </main>

      {/* Section 5 — Footer */}
      <Footer />

      {/* Floating scroll-to-top — reusable on any page */}
      <ScrollToTopButton />
    </>
  )
}
