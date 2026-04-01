import { LandingNavbar } from '@/components/landing/LandingNavbar'
import { Footer } from '@/components/layout/Footer'
import { ScrollToTopButton } from '@/components/layout/ScrollToTopButton'
import { HeroSection } from '@/components/landing/HeroSection'
import { KnowledgeSection } from '@/components/landing/KnowledgeSection'
import { AboutSection } from '@/components/landing/AboutSection'

export function LandingPage() {
  return (
    <>
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
