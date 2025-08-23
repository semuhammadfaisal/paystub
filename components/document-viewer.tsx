"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"
import { generatePaystubPDF, downloadPDF, type PaystubData } from "@/lib/pdf-generator"

interface DocumentViewerProps {
  isOpen: boolean
  onClose: () => void
  paystubData: PaystubData | null
  title: string
}

export default function DocumentViewer({ isOpen, onClose, paystubData, title }: DocumentViewerProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = async () => {
    if (!paystubData) return

    setIsGenerating(true)
    try {
      const pdfBlob = await generatePaystubPDF(paystubData)
      const filename = `paystub-${paystubData.employee_name.replace(/\s+/g, "-")}-${paystubData.pay_date}.png`
      downloadPDF(pdfBlob, filename)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{title}</DialogTitle>
            <div className="flex items-center space-x-2">
              <Button onClick={handleDownload} disabled={isGenerating || !paystubData} size="sm">
                <Download className="w-4 h-4 mr-2" />
                {isGenerating ? "Generating..." : "Download"}
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {paystubData ? (
          <div className="bg-white p-8 border rounded-lg">
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center border-b pb-4">
                <h1 className="text-2xl font-bold text-primary">PAYSTUB</h1>
              </div>

              {/* Employer Information */}
              <div>
                <h3 className="font-bold text-lg mb-3">Employer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Company:</span> {paystubData.employer_name}
                  </div>
                  <div>
                    <span className="font-medium">EIN:</span> {paystubData.employer_ein}
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium">Address:</span> {paystubData.employer_address}
                  </div>
                </div>
              </div>

              {/* Employee Information */}
              <div>
                <h3 className="font-bold text-lg mb-3">Employee Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Name:</span> {paystubData.employee_name}
                  </div>
                  <div>
                    <span className="font-medium">SSN:</span> {paystubData.employee_ssn}
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium">Address:</span> {paystubData.employee_address}
                  </div>
                </div>
              </div>

              {/* Pay Period */}
              <div>
                <h3 className="font-bold text-lg mb-3">Pay Period Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Period:</span> {paystubData.pay_period_start} to{" "}
                    {paystubData.pay_period_end}
                  </div>
                  <div>
                    <span className="font-medium">Pay Date:</span> {paystubData.pay_date}
                  </div>
                  <div>
                    <span className="font-medium">Frequency:</span> {paystubData.pay_frequency}
                  </div>
                </div>
              </div>

              {/* Earnings and Deductions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Earnings */}
                <div>
                  <h3 className="font-bold text-lg mb-3">Earnings</h3>
                  <div className="space-y-2 text-sm">
                    {paystubData.salary && (
                      <div className="flex justify-between">
                        <span>Salary:</span>
                        <span>${paystubData.salary.toFixed(2)}</span>
                      </div>
                    )}
                    {paystubData.hourly_rate && paystubData.hours_worked && (
                      <div className="flex justify-between">
                        <span>
                          Regular Hours ({paystubData.hours_worked} @ ${paystubData.hourly_rate}):
                        </span>
                        <span>${(paystubData.hourly_rate * paystubData.hours_worked).toFixed(2)}</span>
                      </div>
                    )}
                    {paystubData.overtime_hours && paystubData.overtime_rate && (
                      <div className="flex justify-between">
                        <span>
                          Overtime ({paystubData.overtime_hours} @ ${paystubData.overtime_rate}):
                        </span>
                        <span>${(paystubData.overtime_hours * paystubData.overtime_rate).toFixed(2)}</span>
                      </div>
                    )}
                    {paystubData.bonus && (
                      <div className="flex justify-between">
                        <span>Bonus:</span>
                        <span>${paystubData.bonus.toFixed(2)}</span>
                      </div>
                    )}
                    {paystubData.commission && (
                      <div className="flex justify-between">
                        <span>Commission:</span>
                        <span>${paystubData.commission.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold border-t pt-2">
                      <span>Gross Pay:</span>
                      <span>${paystubData.gross_pay.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div>
                  <h3 className="font-bold text-lg mb-3">Deductions</h3>
                  <div className="space-y-2 text-sm">
                    {paystubData.federal_tax > 0 && (
                      <div className="flex justify-between">
                        <span>Federal Tax:</span>
                        <span>${paystubData.federal_tax.toFixed(2)}</span>
                      </div>
                    )}
                    {paystubData.state_tax > 0 && (
                      <div className="flex justify-between">
                        <span>State Tax:</span>
                        <span>${paystubData.state_tax.toFixed(2)}</span>
                      </div>
                    )}
                    {paystubData.social_security > 0 && (
                      <div className="flex justify-between">
                        <span>Social Security:</span>
                        <span>${paystubData.social_security.toFixed(2)}</span>
                      </div>
                    )}
                    {paystubData.medicare > 0 && (
                      <div className="flex justify-between">
                        <span>Medicare:</span>
                        <span>${paystubData.medicare.toFixed(2)}</span>
                      </div>
                    )}
                    {paystubData.health_insurance > 0 && (
                      <div className="flex justify-between">
                        <span>Health Insurance:</span>
                        <span>${paystubData.health_insurance.toFixed(2)}</span>
                      </div>
                    )}
                    {paystubData.dental_insurance > 0 && (
                      <div className="flex justify-between">
                        <span>Dental Insurance:</span>
                        <span>${paystubData.dental_insurance.toFixed(2)}</span>
                      </div>
                    )}
                    {paystubData.retirement_401k > 0 && (
                      <div className="flex justify-between">
                        <span>401(k) Contribution:</span>
                        <span>${paystubData.retirement_401k.toFixed(2)}</span>
                      </div>
                    )}
                    {paystubData.other_deductions > 0 && (
                      <div className="flex justify-between">
                        <span>Other Deductions:</span>
                        <span>${paystubData.other_deductions.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold border-t pt-2">
                      <span>Total Deductions:</span>
                      <span>${paystubData.total_deductions.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Pay */}
              <div className="text-center bg-primary/10 p-4 rounded-lg">
                <h3 className="text-xl font-bold text-primary">NET PAY: ${paystubData.net_pay.toFixed(2)}</h3>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No document data available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
