"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Download,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Building,
  DollarSign,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react"
import { getUserPaystubs, deletePaystub } from "@/lib/actions"
import { generatePaystubPDF, downloadPDF } from "@/lib/pdf-generator"
import { PaystubPreview } from "@/components/paystub-preview"
import { toast } from "sonner"

interface Paystub {
  id: string
  employee_name: string
  employer_name: string
  pay_date: string
  pay_period_start: string
  pay_period_end: string
  gross_pay: number
  net_pay: number
  pay_frequency: string
  created_at: string
  employer_logo?: string
  // Add other fields as needed
}

export default function SavedPaystubsPage() {
  const [paystubs, setPaystubs] = useState<Paystub[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPaystub, setSelectedPaystub] = useState<Paystub | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchPaystubs()
  }, [])

  const fetchPaystubs = async () => {
    try {
      const result = await getUserPaystubs()
      if (result.success && result.data) {
        setPaystubs(result.data)
      } else {
        toast.error("Failed to load paystubs")
      }
    } catch (error) {
      console.error("Error fetching paystubs:", error)
      toast.error("Error loading paystubs")
    } finally {
      setLoading(false)
    }
  }

  const handleView = (paystub: Paystub) => {
    setSelectedPaystub(paystub)
  }

  const handleDownload = async (paystub: Paystub) => {
    try {
      setDownloadingId(paystub.id)

      // Convert database format to PDF format
      const pdfData = {
        employee_name: paystub.employee_name,
        employee_address: "", // You might need to store these fields
        employee_ssn: "",
        employee_id: "",
        employee_phone: "",
        employer_name: paystub.employer_name,
        employer_address: "",
        employer_ein: "",
        employer_phone: "",
        employer_logo: paystub.employer_logo,
        pay_period_start: paystub.pay_period_start,
        pay_period_end: paystub.pay_period_end,
        pay_date: paystub.pay_date,
        pay_frequency: paystub.pay_frequency,
        pay_type: "salary",
        gross_pay: paystub.gross_pay,
        net_pay: paystub.net_pay,
        federal_tax: 0,
        state_tax: 0,
        social_security: 0,
        medicare: 0,
        total_deductions: paystub.gross_pay - paystub.net_pay,
      }

      const pdfBlob = await generatePaystubPDF(pdfData)
      const filename = `paystub-${paystub.employee_name.replace(/\s+/g, "-")}-${paystub.pay_date}.pdf`
      downloadPDF(pdfBlob, filename)

      toast.success("Paystub downloaded successfully!")
    } catch (error) {
      console.error("Download error:", error)
      toast.error("Failed to download paystub")
    } finally {
      setDownloadingId(null)
    }
  }

  const handleEdit = (paystub: Paystub) => {
    // Redirect to create-paystub with paystub data
    router.push(`/create-paystub?edit=${paystub.id}`)
  }

  const handleDelete = async (paystubId: string) => {
    if (!confirm("Are you sure you want to delete this paystub?")) {
      return
    }

    try {
      setDeletingId(paystubId)
      // Note: You'll need to implement deletePaystub function in actions.ts
      const result = await deletePaystub(paystubId)
      if (result.success) {
        setPaystubs(paystubs.filter(p => p.id !== paystubId))
        toast.success("Paystub deleted successfully")
      } else {
        toast.error("Failed to delete paystub")
      }
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("Failed to delete paystub")
    } finally {
      setDeletingId(null)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your saved paystubs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Paystubs</h1>
          <p className="text-gray-600">
            View, download, and manage your saved paystubs
          </p>
        </div>

        {/* Paystubs Grid */}
        {paystubs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No saved paystubs yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first paystub to see it here
            </p>
            <Button onClick={() => router.push("/create-paystub")}>
              Create Paystub
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paystubs.map((paystub) => (
              <Card key={paystub.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">
                        {paystub.employee_name}
                      </CardTitle>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Building className="h-4 w-4 mr-1" />
                        {paystub.employer_name}
                      </div>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {paystub.pay_frequency}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Pay Period */}
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      {formatDate(paystub.pay_period_start)} - {formatDate(paystub.pay_period_end)}
                    </span>
                  </div>

                  {/* Pay Date */}
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Pay Date: {formatDate(paystub.pay_date)}</span>
                  </div>

                  {/* Amounts */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">Gross Pay</div>
                      <div className="font-semibold text-green-700">
                        {formatCurrency(paystub.gross_pay)}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">Net Pay</div>
                      <div className="font-semibold text-blue-700">
                        {formatCurrency(paystub.net_pay)}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleView(paystub)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Paystub Preview</DialogTitle>
                        </DialogHeader>
                        {selectedPaystub && (
                          <PaystubPreview data={{
                            companyName: selectedPaystub.employer_name,
                            employeeName: selectedPaystub.employee_name,
                            payDate: selectedPaystub.pay_date,
                            payPeriodStart: selectedPaystub.pay_period_start,
                            payPeriodEnd: selectedPaystub.pay_period_end,
                            payFrequency: selectedPaystub.pay_frequency,
                            grossPay: selectedPaystub.gross_pay,
                            netPay: selectedPaystub.net_pay,
                            companyLogo: selectedPaystub.employer_logo,
                            // Add other fields as needed for preview
                            companyAddress: "",
                            companyCity: "",
                            companyState: "",
                            companyZip: "",
                            employeeAddress: "",
                            employeeCity: "",
                            employeeState: "",
                            employeeZip: "",
                            payType: "salary",
                            federalTax: 0,
                            stateTax: 0,
                            socialSecurity: 0,
                            medicare: 0,
                            totalDeductions: selectedPaystub.gross_pay - selectedPaystub.net_pay,
                          }} />
                        )}
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDownload(paystub)}
                      disabled={downloadingId === paystub.id}
                    >
                      {downloadingId === paystub.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4 mr-2" />
                      )}
                      Download
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(paystub)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(paystub.id)}
                      disabled={deletingId === paystub.id}
                    >
                      {deletingId === paystub.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {/* Created Date */}
                  <div className="text-xs text-gray-500 text-center pt-2 border-t">
                    Created {formatDate(paystub.created_at)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {paystubs.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Paystubs</p>
                    <p className="text-2xl font-bold text-gray-900">{paystubs.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Gross Pay</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(paystubs.reduce((sum, p) => sum + p.gross_pay, 0))}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Net Pay</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(paystubs.reduce((sum, p) => sum + p.net_pay, 0))}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
