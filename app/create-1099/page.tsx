import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Form1099Generator } from "@/components/1099-generator"

export default async function Create1099Page() {
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
          <h1 className="text-3xl font-bold text-primary mb-2">Create Your 1099-MISC Form</h1>
          <p className="text-muted-foreground">
            Generate professional 1099-MISC forms for contractor payments and miscellaneous income
          </p>
        </div>
        <Form1099Generator user={user} />
      </div>
    </div>
  )
}
