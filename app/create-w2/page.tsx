import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { W2Generator } from "@/components/w2-generator"

export default async function CreateW2Page() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Create Your W2 Form</h1>
          <p className="text-muted-foreground">
            Generate professional W2 tax forms with accurate wage and tax information
          </p>
        </div>
        <W2Generator user={user} />
      </div>
    </div>
  )
}
