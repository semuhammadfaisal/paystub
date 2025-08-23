import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { DocumentTypes } from "@/components/document-types"
import { ServicesSection } from "@/components/services-section"
import { PricingSection } from "@/components/pricing-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <DocumentTypes />
        <ServicesSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  )
}
