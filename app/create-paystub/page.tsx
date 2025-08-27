import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PaystubGenerator } from "@/components/paystub-generator"
import { PageHeader } from "@/components/page-header"

export default async function CreatePaystubPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Create Your Paystub</h1>
          <p className="text-muted-foreground">Generate professional paystubs in minutes with our easy-to-use form</p>
        </div>
        <PaystubGenerator user={user} />
      </div>
    </div>
  )
}
