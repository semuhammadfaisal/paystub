import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, CheckCircle } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-background via-background to-muted/20 py-20 lg:py-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Professional Payroll
            <span className="text-primary block">Documents Made Simple</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Generate accurate paystubs, W2 forms, 1099s, and tax returns in minutes. Trusted by thousands for employment
            verification, loan applications, and compliance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/create-paystub">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 py-4 text-lg group"
              >
                Create Your First Document
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="font-semibold px-8 py-4 text-lg bg-transparent">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Instant Generation</h3>
            <p className="text-muted-foreground text-sm">Create professional documents in under 5 minutes</p>
          </div>

          <div className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">100% Accurate</h3>
            <p className="text-muted-foreground text-sm">Compliant with all state and federal requirements</p>
          </div>

          <div className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Secure & Private</h3>
            <p className="text-muted-foreground text-sm">Your data is encrypted and never shared</p>
          </div>

          <div className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Multiple Formats</h3>
            <p className="text-muted-foreground text-sm">Paystubs, W2s, 1099s, and tax returns</p>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-8">Choose Your Document Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Paystubs", href: "/create-paystub", desc: "Employee pay statements" },
              { title: "W2 Forms", href: "/create-w2", desc: "Annual wage statements" },
              { title: "1099-MISC", href: "/create-1099", desc: "Contractor payments" },
              { title: "Tax Returns", href: "/create-tax-return", desc: "Federal tax forms" },
            ].map((doc) => (
              <Link key={doc.title} href={doc.href}>
                <div className="p-6 rounded-xl bg-white border border-border hover:shadow-lg hover:border-primary/50 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{doc.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{doc.desc}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors bg-transparent"
                  >
                    Create Now
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
