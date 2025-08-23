import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import CheckoutForm from "@/components/checkout-form"

interface CheckoutPageProps {
  searchParams: {
    package?: string
    paystub_id?: string
  }
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const packageType = searchParams.package || "basic"
  const paystubId = searchParams.paystub_id

  const packages = {
    basic: {
      name: "Basic Document Package",
      price: 20,
      features: ["1 Paystub", "Basic Formatting", "24-Hour Delivery"],
    },
    standard: {
      name: "Standard Document Package",
      price: 30,
      features: ["1 W2 Form", "Basic Formatting", "24-Hour Delivery"],
    },
    premium: {
      name: "Premium Document Package",
      price: 50,
      features: ["1040 Form", "Basic Formatting", "24-Hour Delivery"],
    },
  }

  const selectedPackage = packages[packageType as keyof typeof packages] || packages.basic

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Complete Your Order</h1>
          <p className="text-muted-foreground mt-2">Secure checkout for your document package</p>
        </div>

        <CheckoutForm packageData={selectedPackage} packageType={packageType} paystubId={paystubId} userId={user.id} />
      </div>
    </div>
  )
}
