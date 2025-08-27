export function Testimonials() {
  const quotes = [
    {
      name: "Georgia Austin",
      text:
        "I run my own blog writing service and needed some documents for a home loan. SRS Financials created a paystub as proof of income for my bank in 2 minutes. Approved instantly!",
    },
    {
      name: "Jay Hinge",
      text:
        "Ever since I started my own catering business, it’s been difficult to be approved for loans. With SRS, I created a check stub that got me approved for a mortgage.",
    },
    {
      name: "Sarah Miles",
      text:
        "SRS helped me generate a Paystub for my Yoga business for the PPP. Their system is by far the easiest I’ve used. Thank you so much!!",
    },
    {
      name: "Cindi Yung",
      text:
        "My budget is tight owning my cafe. I can’t afford expensive software, so I use SRS to create check stubs for my employees. A lifesaver and budget helper!",
    },
  ]

  return (
    <section id="reviews" className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-10">Customers trust our check stub maker.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quotes.map((q) => (
            <div key={q.name} className="rounded-xl border bg-white p-6 shadow-sm">
              <p className="text-foreground">“{q.text}”</p>
              <p className="mt-3 text-sm text-muted-foreground">— {q.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
