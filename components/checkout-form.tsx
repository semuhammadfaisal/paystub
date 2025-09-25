"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Check, Loader2, BadgeCheck } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface CheckoutFormProps {
  packageData: {
    name: string
    price: number
    features: string[]
  }
  packageType: string
  paystubId?: string
  userId: string
}

export default function CheckoutForm({ packageData, packageType, paystubId, userId }: CheckoutFormProps) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [successOpen, setSuccessOpen] = useState(false)
  const months = ["01","02","03","04","05","06","07","08","09","10","11","12"]
  const startYear = new Date().getFullYear()
  const years = Array.from({ length: 12 }, (_, i) => String(startYear + i))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))
      // Open success modal and trigger download of stored HTML
      setSuccessOpen(true)
      // Perform the actual download from localStorage payload
      setTimeout(() => {
        try {
          const doc = localStorage.getItem('paystub-html-doc')
          const filename = localStorage.getItem('paystub-html-filename') || 'paystub.html'
          if (doc) {
            const blob = new Blob([doc], { type: 'text/html;charset=utf-8' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = filename
            document.body.appendChild(a)
            a.click()
            a.remove()
            URL.revokeObjectURL(url)
            // Clear stored payload to avoid stale downloads
            localStorage.removeItem('paystub-html-doc')
            localStorage.removeItem('paystub-html-filename')
          } else {
            alert('Nothing to download. Please go back and click Download Paystub again.')
          }
        } catch (err) {
          console.error('Auto-download error:', err)
        }
      }, 300)
    } catch (error) {
      console.error("Payment error:", error)
      alert("Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-black">
      {/* Order Summary */}
      <Card className="border border-black/10 shadow-sm bg-white rounded-xl text-black">
        <CardHeader>
          <CardTitle className="font-semibold text-black">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="font-medium">{packageData.name}</span>
            <span className="font-bold">${packageData.price.toFixed(2)}</span>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-medium text-black">Included Features:</h4>
            <ul className="space-y-1">
              {packageData.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-black">
                  <Check className="w-4 h-4 text-black mr-2" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <div className="flex justify-between text-black text-lg font-bold">
            <span>Total</span>
            <span>${packageData.price.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card className="border border-black/10 shadow-sm bg-white rounded-xl text-black">
        <CardHeader>
          <CardTitle className="font-semibold text-black">Credit Card Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Payment method box */}
            <div className="border border-black/20 border-dashed rounded-lg p-3 text-sm">
              <div className="mb-2 font-medium">Payment Method</div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-black/20 px-2 py-1 text-xs text-black">Mastercard</span>
                <span className="inline-flex items-center rounded-full border border-black/20 px-2 py-1 text-xs text-black">Visa</span>
                <span className="inline-flex items-center rounded-full border border-black/20 px-2 py-1 text-xs text-black">Amex</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nameOnCard" className="text-black">Name on card</Label>
              <Input id="nameOnCard" placeholder="John Doe" required disabled={isProcessing} className="border-black/20 focus-visible:ring-black focus-visible:border-black text-black placeholder:text-gray-400" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber" className="text-black">Card number</Label>
              <Input id="cardNumber" placeholder="0000 0000 0000 0000" required disabled={isProcessing} className="border-black/20 focus-visible:ring-black focus-visible:border-black text-black placeholder:text-gray-400" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-black">Card expiration</Label>
                <div className="grid grid-cols-2 gap-2">
                  <select aria-label="Month" defaultValue="" className="h-10 rounded-md border border-black/20 bg-white px-3 text-black focus:outline-none focus:ring-1 focus:ring-black focus:border-black">
                    <option value="" disabled>Month</option>
                    {months.map(m => (<option key={m} value={m}>{m}</option>))}
                  </select>
                  <select aria-label="Year" defaultValue="" className="h-10 rounded-md border border-black/20 bg-white px-3 text-black focus:outline-none focus:ring-1 focus:ring-black focus:border-black">
                    <option value="" disabled>Year</option>
                    {years.map(y => (<option key={y} value={y}>{y}</option>))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv" className="text-black">Card Security Code</Label>
                <Input id="cvv" placeholder="Code" required disabled={isProcessing} className="border-black/20 focus-visible:ring-black focus-visible:border-black text-black placeholder:text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-black">Email Address</Label>
              <Input id="email" type="email" placeholder="john@example.com" required disabled={isProcessing} className="border-black/20 focus-visible:ring-black focus-visible:border-black text-black placeholder:text-gray-400" />
              <p className="text-xs text-black/70">We’ll send your receipt to this email.</p>
            </div>

            <Button type="submit" className="w-full bg-black hover:bg-black/90 text-white" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                `Pay $${packageData.price.toFixed(2)}`
              )}
            </Button>
            <p className="text-xs text-center text-black/70">This is a demo payment system. No real charges.</p>
          </form>
        </CardContent>
      </Card>

      {/* Success Modal */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-black"><BadgeCheck className="w-5 h-5 text-black" /> Payment Successful</DialogTitle>
            <DialogDescription>
              Your payment was processed. Your paystub download should begin automatically. If it doesn’t, please click the button below.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => {
                try {
                  const doc = localStorage.getItem('paystub-html-doc')
                  const filename = localStorage.getItem('paystub-html-filename') || 'paystub.html'
                  if (doc) {
                    const blob = new Blob([doc], { type: 'text/html;charset=utf-8' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = filename
                    document.body.appendChild(a)
                    a.click()
                    a.remove()
                    URL.revokeObjectURL(url)
                    localStorage.removeItem('paystub-html-doc')
                    localStorage.removeItem('paystub-html-filename')
                  }
                } catch {}
              }}
              className="bg-black hover:bg-black/90 text-white"
            >
              Download Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
