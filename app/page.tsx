import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { DocumentTypes } from "@/components/document-types"
import { ServicesSection } from "@/components/services-section"
import { PricingSection } from "@/components/pricing-section"
import { Footer } from "@/components/footer"
import { WhyChoose } from "@/components/why-choose"
import { StepsSection } from "@/components/steps-section"
import { ConfidenceSection } from "@/components/confidence-section"
import { Testimonials } from "@/components/testimonials"
import { AnatomySection } from "@/components/anatomy-section"
import { AudienceSection } from "@/components/audience-section"
import { FaqSection } from "@/components/faq-section"
import { AboutSection } from "@/components/about-section"
import { SupportSection } from "@/components/support-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <DocumentTypes />
        <WhyChoose />
        <StepsSection />
        <ServicesSection />
        <ConfidenceSection />
        <PricingSection />
        <Testimonials />
        <AnatomySection />
        <AudienceSection />
        <FaqSection />
        <AboutSection />
        <SupportSection />
      </main>
      <Footer />
    </div>
  )
}
