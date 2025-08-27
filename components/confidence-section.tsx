import { ShieldCheck, CreditCard, ThumbsUp } from "lucide-react"

export function ConfidenceSection() {
  const items = [
    { title: "Money Back Guarantee", icon: ShieldCheck, desc: "If you’re not satisfied, we’ll make it right or refund you." },
    { title: "Secure Payment Processing", icon: CreditCard, desc: "Your transactions are protected with industry‑standard security." },
    { title: "High Customer Satisfaction Rating", icon: ThumbsUp, desc: "Thousands of happy customers trust our check stub maker." },
  ]

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground">Buy with confidence.</h2>
          <p className="text-muted-foreground">Trusted platform, accurate documents, secure checkout.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((it) => (
            <div key={it.title} className="rounded-xl border p-6 bg-white">
              <it.icon className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-lg mb-1">{it.title}</h3>
              <p className="text-muted-foreground text-sm">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
