import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PaystubGenerator } from "@/components/paystub-generator"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import Link from "next/link"

export default async function CreatePaystubPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Await Next.js dynamic searchParams API before using its properties
  const { template } = await searchParams

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Create Your Paystub</h1>
          <p className="text-muted-foreground">Generate professional paystubs in minutes with our easy-to-use form</p>
        </div>

        {/* Template selection (at least 4 options) */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Select template</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href={{ pathname: "/create-paystub", query: { template: "template1" } }} className="block">
              <div className="border rounded-lg p-4 hover:border-primary transition-colors h-full">
                <div className="text-sm text-muted-foreground mb-1">Template #1</div>
                <div className="font-medium">Classic</div>
                <div className="text-xs text-muted-foreground mt-2">Clean and traditional layout</div>
              </div>
            </Link>
            <Link href={{ pathname: "/create-paystub", query: { template: "template2" } }} className="block">
              <div className="border rounded-lg p-4 hover:border-primary transition-colors h-full">
                <div className="text-sm text-muted-foreground mb-1">Template #2</div>
                <div className="font-medium">Modern</div>
                <div className="text-xs text-muted-foreground mt-2">Contemporary look with bold headings</div>
              </div>
            </Link>
            <Link href={{ pathname: "/create-paystub", query: { template: "template3" } }} className="block">
              <div className="border rounded-lg p-4 hover:border-primary transition-colors h-full">
                <div className="text-sm text-muted-foreground mb-1">Template #3</div>
                <div className="font-medium">Detailed</div>
                <div className="text-xs text-muted-foreground mt-2">More line items and breakdowns</div>
              </div>
            </Link>
            <Link href={{ pathname: "/create-paystub", query: { template: "template4" } }} className="block">
              <div className="border rounded-lg p-4 hover:border-primary transition-colors h-full">
                <div className="text-sm text-muted-foreground mb-1">Template #4</div>
                <div className="font-medium">Compact</div>
                <div className="text-xs text-muted-foreground mt-2">Space-efficient summary style</div>
              </div>
            </Link>
          </div>
        </section>

        <PaystubGenerator user={user} initialTemplateId={typeof template === 'string' ? template : undefined} />

        {/* WhatsApp CTA section */}
        <section className="mt-12">
          <div className="rounded-2xl border bg-muted/30 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Want a fully professional paystub prepared for you?</h2>
                <p className="text-muted-foreground mt-1">Chat with us on WhatsApp and our team will handle it end‑to‑end.</p>
              </div>
              <a href="https://wa.me/12067045757" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-[#25D366] hover:bg-[#20bd5a] text-white">
                  <MessageCircle className="h-5 w-5" />
                  Contact on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
