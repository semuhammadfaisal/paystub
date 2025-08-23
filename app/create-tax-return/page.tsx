import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import TaxReturnGenerator from "@/components/tax-return-generator"

export default async function CreateTaxReturnPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create Tax Return</h1>
            <p className="text-gray-600 mt-2">Generate your professional tax return documents</p>
          </div>
          <TaxReturnGenerator user={user} />
        </div>
      </div>
    </div>
  )
}
