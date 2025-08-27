import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { FileEdit, Eye, DownloadCloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function StepsSection() {
  const steps = [
    {
      title: "Add your info",
      desc: "Use our secure online forms to enter your personal details in the fields provided.",
      icon: FileEdit,
    },
    {
      title: "Preview your document",
      desc: "Make edits before you order. Get documents delivered to your inbox in minutes.",
      icon: Eye,
    },
    {
      title: "Download your Paystubs",
      desc: "Download and print the secure PDF. We’ll print and mail your Paystubs and W‑2s.",
      icon: DownloadCloud,
    },
  ]

  return (
    <section id="how-it-works" className="py-16 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground">Creating paystubs has never been this simple.</h2>
          <p className="text-primary font-semibold">Seriously!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <Card key={s.title}>
              <CardHeader className="flex flex-row items-center gap-3">
                <s.icon className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold">{s.title}</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{s.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/create-paystub">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">GET STARTED NOW</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
