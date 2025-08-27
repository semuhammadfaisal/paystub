import { Card, CardContent } from "@/components/ui/card"
import { ShieldCheck, Sparkles, Timer, BadgeCheck } from "lucide-react"

export function WhyChoose() {
  const items = [
    {
      title: "Trust a Seamless Process",
      desc:
        "You need paystubs fast. In a few steps, you’ll have legitimate Paystubs that show employment details, gross and net salary, payroll tax deductions and more.",
      icon: Timer,
    },
    {
      title: "Select from Professional Templates",
      desc:
        "Looks are important – especially for official documentation. Choose from clean, professional templates for paystubs and IRS‑compliant W‑2 and 1099 forms.",
      icon: Sparkles,
    },
    {
      title: "Avoid Issues with the IRS",
      desc:
        "Accurate calculations matter. Our auto‑calculation logic follows the latest federal, state and local guidance to help you stay compliant.",
      icon: ShieldCheck,
    },
    {
      title: "Access Support, 24/7",
      desc:
        "Made a mistake or have a question? Our friendly support team is here for you by email or chat – day or night.",
      icon: BadgeCheck,
    },
  ]

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">
            Why Choose SRS Financials?
          </h2>
          <p className="text-lg text-gray-600 font-light max-w-3xl mx-auto leading-relaxed">
            We're committed to providing legitimate, accurate payroll documents you can trust.
            Whether you're an independent contractor, entrepreneur, or small business owner.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {items.map((item, index) => (
            <Card
              key={index}
              className="border border-gray-200 bg-white rounded-none hover:border-[#239BA0] transition-all duration-300"
            >
              <CardContent className="p-8">
                {/* Icon and Title */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 flex items-center justify-center rounded-none bg-[#239BA0]/10">
                    <item.icon className="w-6 h-6 text-[#239BA0]" />
                  </div>
                  <h3 className="text-xl font-light text-gray-900 tracking-tight">
                    {item.title}
                  </h3>
                </div>

                {/* Description */}
                <div>
                  <p className="text-gray-600 font-light leading-relaxed text-sm">
                    {item.desc}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
