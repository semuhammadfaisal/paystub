import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Image from "next/image"

export function AnatomySection() {
  const items = [
    { title: "Employment Details", desc: "Name of employer and address, payment date, etc." },
    { title: "Local Taxes", desc: "Some local governments impose income taxes, shown as deductions." },
    { title: "Back Pay", desc: "In case of overpayment in taxes, back pay will appear on your stub." },
    { title: "Sick/Holiday Pay", desc: "Paid sick leave and paid vacation are noted in this section." },
    { title: "Federal Taxes", desc: "Federal withholding taxes based on your W‑4 form." },
    { title: "Net Salary", desc: "Take home pay — the amount paid to you after deductions." },
    { title: "Gross Salary", desc: "Your total salary before mandatory deductions." },
    { title: "State Taxes", desc: "State income taxes, depending on where you live and work." },
  ]

  return (
    <section id="anatomy" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">The Anatomy of a Paystub</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto mb-8">
            42% of U.S. employees say taxes and deductions on their Paystubs are confusing. We're breaking down the key
            elements below so you can better understand your Paystub.
          </p>
          
          {/* Paystub Anatomy Visual */}
          <div className="relative max-w-4xl mx-auto mb-12">
            <div className="rounded-2xl overflow-hidden ">
              <Image
                src="/downimage.jpg"
                alt="The Anatomy of a Paystub - Visual breakdown showing Employment Details, Gross Salary, Taxes, Net Salary, and other key components"
                width={800}
                height={600}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-primary/10 to-secondary/10 blur-xl"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((it) => (
            <Card key={it.title}>
              <CardHeader>
                <h3 className="font-semibold">{it.title}</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{it.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
