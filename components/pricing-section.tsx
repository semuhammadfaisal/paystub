"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Check } from "lucide-react"
import { useRouter } from "next/navigation"

export function PricingSection() {
  const router = useRouter()

  const packages = [
    {
      name: "Basic Document Package",
      subtitle: "Get Verified Financial Documents In Hours",
      price: 20,
      features: ["1 Paystubs", "Basic Formatting", "24-Hour Delivery"],
      buttonText: "Order Now",
      popular: false,
      type: "basic",
    },
    {
      name: "Standard Document Package",
      subtitle: "Get Verified Financial Documents In Hours",
      price: 30,
      features: ["1 W2 Form", "Basic Formatting", "24-Hour Delivery"],
      buttonText: "Order Now",
      popular: true,
      type: "standard",
    },
    {
      name: "Premium Document Package",
      subtitle: "Get Verified Financial Documents In Hours",
      price: 50,
      features: ["1040 Form", "Basic Formatting", "24-Hour Delivery"],
      buttonText: "Order Now",
      popular: false,
      type: "premium",
    },
  ]

  const handleOrderClick = (packageType: string) => {
    router.push(`/checkout?package=${packageType}`)
  }

  return (
    <section className="py-16 bg-gradient-to-b from-primary via-primary/90 to-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-secondary rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-secondary rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-secondary rounded-full blur-lg"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="bg-secondary py-4 mb-8 rounded-lg shadow-lg">
            <h2 className="text-primary text-3xl font-bold">Choose Your Document Package</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {packages.map((pkg, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl ${pkg.popular ? "ring-4 ring-secondary scale-105" : ""} group`}
            >
              {pkg.popular && (
                <div className="absolute top-0 right-0 bg-secondary text-primary px-4 py-1 text-sm font-bold rounded-bl-lg z-10">
                  POPULAR
                </div>
              )}

              <CardHeader className="bg-primary text-center py-6 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80"></div>
                <div className="relative">
                  <h3 className="text-white font-bold text-lg">{pkg.name}</h3>
                  <p className="text-white/90 text-sm">{pkg.subtitle}</p>
                </div>
              </CardHeader>

              <CardContent className="p-8 text-center bg-gradient-to-b from-white to-gray-50">
                <div className="mb-6">
                  <span className="text-primary text-sm">$</span>
                  <span className="text-primary text-5xl font-bold">{pkg.price}</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center justify-center">
                      <Check className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                      <span className="text-foreground font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleOrderClick(pkg.type)}
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold py-3 transform group-hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {pkg.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
