import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
    <section id="about" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-primary">Why choose SRS Financials?</h2>
          <p className="mt-2 text-muted-foreground max-w-3xl mx-auto">
            We’re literally the best. If you’re an independent contractor, entrepreneur or small business, you may not
            have instant access to the payroll documents you need. That’s where we come in — legitimate, accurate and guaranteed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((it) => (
            <Card key={it.title} className="border border-border/60">
              <CardHeader className="flex flex-row items-center gap-3">
                <it.icon className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold">{it.title}</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{it.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
