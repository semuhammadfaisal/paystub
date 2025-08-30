"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"
import { useRouter } from "next/navigation"

export function PricingSection() {
  const router = useRouter()

  const packages = [
    {
      name: "Basic",
      subtitle: "For individuals who need quick essentials",
      price: 20,
      features: ["1 Paystub", "Basic Formatting", "24-Hour Delivery"],
      buttonText: "Get Started",
      popular: false,
      type: "basic",
    },
    {
      name: "Standard",
      subtitle: "Our most popular package with added benefits",
      price: 30,
      features: ["1 W2 Form", "Professional Formatting", "24-Hour Delivery"],
      buttonText: "Choose Standard",
      popular: true,
      type: "standard",
    },
    {
      name: "Premium",
      subtitle: "For professionals who need comprehensive docs",
      price: 50,
      features: ["1 1040 Form", "Premium Formatting", "Priority Delivery"],
      buttonText: "Go Premium",
      popular: false,
      type: "premium",
    },
  ]

  const handleOrderClick = (packageType: string) => {
    router.push(`/checkout?package=${packageType}`)
  }

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
            Choose the plan that best fits your needs. No hidden fees, no hassle.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {packages.map((pkg, index) => (
            <Card
              key={index}
              className={`relative group transition-all duration-300 hover:shadow-lg border ${
                pkg.popular
                  ? "border-[#239BA0] shadow-md"
                  : "border-gray-200 hover:border-[#239BA0]"
              } bg-white rounded-none`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-[#239BA0] text-white px-4 py-2 text-sm font-medium tracking-wide">
                    MOST POPULAR
                  </div>
                </div>
              )}

              <CardContent className="p-8">
                {/* Package Name & Description */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                    {pkg.name}
                  </h3>
                  <p className="text-gray-600 text-sm font-light leading-relaxed">
                    {pkg.subtitle}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-light text-gray-900">${pkg.price}</span>
                    <span className="text-gray-500 text-sm font-light ml-2">one-time</span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-8">
                  <ul className="space-y-4">
                    {pkg.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-start text-gray-700"
                      >
                        <Check className="w-4 h-4 text-[#239BA0] mt-1 mr-3 flex-shrink-0" />
                        <span className="font-light text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => handleOrderClick(pkg.type)}
                  className={`w-full h-12 font-medium text-sm tracking-wide transition-all duration-200 rounded-none ${
                    pkg.popular
                      ? "bg-[#239BA0] text-white hover:bg-[#1e7d85]"
                      : "bg-white text-[#239BA0] border border-[#239BA0] hover:bg-[#239BA0] hover:text-white"
                  }`}
                >
                  {pkg.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Trust Indicators */}
        <div className="mt-20 text-center">
          <div className="flex items-center justify-center space-x-8 text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-[#239BA0] rounded-full mr-2"></div>
              <span className="text-sm font-light">24/7 Support</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-[#239BA0] rounded-full mr-2"></div>
              <span className="text-sm font-light">Secure Payment</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-[#239BA0] rounded-full mr-2"></div>
              <span className="text-sm font-light">Instant Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}