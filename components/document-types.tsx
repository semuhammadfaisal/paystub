import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export function DocumentTypes() {
  const documents = [
    {
      title: "Paystubs",
      image: "/images/paystub-detailed.png",
      buttonText: "GET YOUR PAYSTUBS",
      href: "/create-paystub",
    },
    {
      title: "W2 Form",
      image: "/images/w2-form-detailed.png",
      buttonText: "GET YOUR W2 FORM",
      href: "/create-w2",
    },
    {
      title: "Tax Return",
      image: "/images/tax-return-detailed.png",
      buttonText: "GET YOUR TAX RETURN",
      href: "/create-tax-return", // Updated href to point to actual tax return generator
    },
    {
      title: "1099-Misc",
      image: "/images/1099-misc-detailed.png",
      buttonText: "GET YOUR 1099-MISC",
      href: "/create-1099",
    },
  ]

  return (
    <section className="py-16 bg-gradient-to-r from-secondary via-secondary/80 to-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {documents.map((doc, index) => (
            <div key={index} className="text-center group">
              <h3 className="text-primary text-lg font-bold mb-6">{doc.title}</h3>

              <Card className="bg-white p-6 rounded-2xl shadow-lg mb-6 transform group-hover:scale-105 transition-all duration-300 group-hover:shadow-xl">
                <div className="aspect-[3/4] flex items-center justify-center">
                  <img
                    src={doc.image || "/placeholder.svg"}
                    alt={`${doc.title} template`}
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              </Card>

              <Button
                asChild={doc.href !== "#"}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-sm px-6 py-2 transform group-hover:scale-105 transition-all duration-200"
                disabled={doc.href === "#"}
              >
                {doc.href !== "#" ? <Link href={doc.href}>{doc.buttonText}</Link> : <span>{doc.buttonText}</span>}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
