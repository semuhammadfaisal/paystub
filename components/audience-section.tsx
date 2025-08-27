import { CheckCircle } from "lucide-react"

export function AudienceSection() {
  const items = [
    "Tax professionals prepare clients for tax season",
    "Get financial documents for homebuyers and homeowners",
    "Fast payroll documents for small businesses",
  ]

  return (
    <section id="audiences" className="py-16 bg-muted/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">Who can use SRS Financials?</h2>
        <ul className="max-w-3xl mx-auto space-y-4">
          {items.map((t) => (
            <li key={t} className="flex items-start gap-3 text-lg">
              <CheckCircle className="h-6 w-6 text-primary mt-1" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
