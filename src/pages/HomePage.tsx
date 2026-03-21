import { Navbar } from '@/components/layout/Navbar'
import { HeroSection } from '@/components/home/HeroSection'
import { FeaturesSection } from '@/components/home/FeaturesSection'
import { WhySection } from '@/components/home/WhySection'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { CTASection } from '@/components/home/CTASection'
import { FooterSection } from '@/components/home/FooterSection'
import { ScrollToTop } from '@/components/home/ScrollToTop'

export const HomePage = () => {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <WhySection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <FooterSection />
      <ScrollToTop />
    </>
  )
}
