"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Download } from "lucide-react"
import { generate1099PDF, download1099PDF } from "@/lib/1099-pdf-generator"

export interface Form1099Data {
  // Basic Information
  taxYear: string

  // Payer Information
  payerName: string
  payerAddress: string
  payerCity: string
  payerState: string
  payerZip: string
  payerTIN: string
  payerPhone: string

  // Recipient Information
  recipientName: string
  recipientAddress: string
  recipientCity: string
  recipientState: string
  recipientZip: string
  recipientTIN: string
  accountNumber: string

  // Payment Information
  rents: number
  royalties: number
  otherIncome: number
  federalIncomeTax: number
  fishingBoatProceeds: number
  medicalHealthcare: number
  nonemployeeCompensation: number
  substitutePayments: number
  cropInsuranceProceeds: number
  grossProceedsAttorney: number
  section409ADeferrals: number
  stateIncomeTax: number
  stateNumber: string
  payerStateNumber: string
}

interface Form1099GeneratorProps {
  user: any
}

const initialData: Form1099Data = {
  taxYear: new Date().getFullYear().toString(),
  payerName: "",
  payerAddress: "",
  payerCity: "",
  payerState: "",
  payerZip: "",
  payerTIN: "",
  payerPhone: "",
  recipientName: "",
  recipientAddress: "",
  recipientCity: "",
  recipientState: "",
  recipientZip: "",
  recipientTIN: "",
  accountNumber: "",
  rents: 0,
  royalties: 0,
  otherIncome: 0,
  federalIncomeTax: 0,
  fishingBoatProceeds: 0,
  medicalHealthcare: 0,
  nonemployeeCompensation: 0,
  substitutePayments: 0,
  cropInsuranceProceeds: 0,
  grossProceedsAttorney: 0,
  section409ADeferrals: 0,
  stateIncomeTax: 0,
  stateNumber: "",
  payerStateNumber: "",
}

export function Form1099Generator({ user }: Form1099GeneratorProps) {
  const [form1099Data, setForm1099Data] = useState<Form1099Data>(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const updateForm1099Data = (field: keyof Form1099Data, value: string | number) => {
    setForm1099Data((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!form1099Data.recipientName || !form1099Data.payerName) {
      alert("Please fill in at least recipient name and payer name")
      return
    }
    setIsSaving(true)
    try {
      // TODO: Implement save to database
      setTimeout(() => {
        alert("1099-MISC form saved successfully!")
        setIsSaving(false)
      }, 1000)
    } catch (error) {
      console.error("Save error:", error)
      alert("Failed to save 1099-MISC form")
      setIsSaving(false)
    }
  }

  const handleDownload = async () => {
    if (!form1099Data.recipientName || !form1099Data.payerName) {
      alert("Please fill in at least recipient name and payer name")
      return
    }
    setIsDownloading(true)
    try {
      const pdfBlob = await generate1099PDF(form1099Data)
      const filename = `1099-misc-${form1099Data.recipientName.replace(/\s+/g, "-")}-${form1099Data.taxYear}.png`
      download1099PDF(pdfBlob, filename)
    } catch (error) {
      console.error("Download error:", error)
      alert("Failed to generate 1099-MISC PDF")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-primary mb-6">1099-MISC Form Information</h2>

          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="payer">Payer</TabsTrigger>
              <TabsTrigger value="recipient">Recipient</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="state">State</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="taxYear">Tax Year</Label>
                  <Input
                    id="taxYear"
                    value={form1099Data.taxYear}
                    onChange={(e) => updateForm1099Data("taxYear", e.target.value)}
                    placeholder="2024"
                  />
                </div>
                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={form1099Data.accountNumber}
                    onChange={(e) => updateForm1099Data("accountNumber", e.target.value)}
                    placeholder="Optional account number"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="payer" className="space-y-4">
              <h3 className="text-lg font-semibold">Payer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="payerName">Payer Name</Label>
                  <Input
                    id="payerName"
                    value={form1099Data.payerName}
                    onChange={(e) => updateForm1099Data("payerName", e.target.value)}
                    placeholder="ABC Corporation"
                  />
                </div>
                <div>
                  <Label htmlFor="payerTIN">Payer TIN</Label>
                  <Input
                    id="payerTIN"
                    value={form1099Data.payerTIN}
                    onChange={(e) => updateForm1099Data("payerTIN", e.target.value)}
                    placeholder="12-3456789"
                  />
                </div>
                <div>
                  <Label htmlFor="payerPhone">Phone Number</Label>
                  <Input
                    id="payerPhone"
                    value={form1099Data.payerPhone}
                    onChange={(e) => updateForm1099Data("payerPhone", e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="payerAddress">Address</Label>
                  <Input
                    id="payerAddress"
                    value={form1099Data.payerAddress}
                    onChange={(e) => updateForm1099Data("payerAddress", e.target.value)}
                    placeholder="123 Business St"
                  />
                </div>
                <div>
                  <Label htmlFor="payerCity">City</Label>
                  <Input
                    id="payerCity"
                    value={form1099Data.payerCity}
                    onChange={(e) => updateForm1099Data("payerCity", e.target.value)}
                    placeholder="New York"
                  />
                </div>
                <div>
                  <Label htmlFor="payerState">State</Label>
                  <Select
                    value={form1099Data.payerState}
                    onValueChange={(value) => updateForm1099Data("payerState", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AL">Alabama</SelectItem>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="payerZip">ZIP Code</Label>
                  <Input
                    id="payerZip"
                    value={form1099Data.payerZip}
                    onChange={(e) => updateForm1099Data("payerZip", e.target.value)}
                    placeholder="10001"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="recipient" className="space-y-4">
              <h3 className="text-lg font-semibold">Recipient Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="recipientName">Recipient Name</Label>
                  <Input
                    id="recipientName"
                    value={form1099Data.recipientName}
                    onChange={(e) => updateForm1099Data("recipientName", e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="recipientTIN">Recipient TIN/SSN</Label>
                  <Input
                    id="recipientTIN"
                    value={form1099Data.recipientTIN}
                    onChange={(e) => updateForm1099Data("recipientTIN", e.target.value)}
                    placeholder="123-45-6789"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="recipientAddress">Address</Label>
                  <Input
                    id="recipientAddress"
                    value={form1099Data.recipientAddress}
                    onChange={(e) => updateForm1099Data("recipientAddress", e.target.value)}
                    placeholder="123 Main St"
                  />
                </div>
                <div>
                  <Label htmlFor="recipientCity">City</Label>
                  <Input
                    id="recipientCity"
                    value={form1099Data.recipientCity}
                    onChange={(e) => updateForm1099Data("recipientCity", e.target.value)}
                    placeholder="New York"
                  />
                </div>
                <div>
                  <Label htmlFor="recipientState">State</Label>
                  <Select
                    value={form1099Data.recipientState}
                    onValueChange={(value) => updateForm1099Data("recipientState", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AL">Alabama</SelectItem>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="recipientZip">ZIP Code</Label>
                  <Input
                    id="recipientZip"
                    value={form1099Data.recipientZip}
                    onChange={(e) => updateForm1099Data("recipientZip", e.target.value)}
                    placeholder="10001"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
              <h3 className="text-lg font-semibold">Payments & Taxes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nonemployeeCompensation">1. Nonemployee compensation</Label>
                  <Input
                    id="nonemployeeCompensation"
                    type="number"
                    step="0.01"
                    value={form1099Data.nonemployeeCompensation}
                    onChange={(e) =>
                      updateForm1099Data("nonemployeeCompensation", Number.parseFloat(e.target.value) || 0)
                    }
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="rents">2. Rents</Label>
                  <Input
                    id="rents"
                    type="number"
                    step="0.01"
                    value={form1099Data.rents}
                    onChange={(e) => updateForm1099Data("rents", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="royalties">3. Royalties</Label>
                  <Input
                    id="royalties"
                    type="number"
                    step="0.01"
                    value={form1099Data.royalties}
                    onChange={(e) => updateForm1099Data("royalties", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="otherIncome">4. Other income</Label>
                  <Input
                    id="otherIncome"
                    type="number"
                    step="0.01"
                    value={form1099Data.otherIncome}
                    onChange={(e) => updateForm1099Data("otherIncome", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="federalIncomeTax">5. Federal income tax withheld</Label>
                  <Input
                    id="federalIncomeTax"
                    type="number"
                    step="0.01"
                    value={form1099Data.federalIncomeTax}
                    onChange={(e) => updateForm1099Data("federalIncomeTax", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="medicalHealthcare">6. Medical and health care payments</Label>
                  <Input
                    id="medicalHealthcare"
                    type="number"
                    step="0.01"
                    value={form1099Data.medicalHealthcare}
                    onChange={(e) => updateForm1099Data("medicalHealthcare", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="fishingBoatProceeds">7. Fishing boat proceeds</Label>
                  <Input
                    id="fishingBoatProceeds"
                    type="number"
                    step="0.01"
                    value={form1099Data.fishingBoatProceeds}
                    onChange={(e) => updateForm1099Data("fishingBoatProceeds", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="grossProceedsAttorney">8. Gross proceeds paid to an attorney</Label>
                  <Input
                    id="grossProceedsAttorney"
                    type="number"
                    step="0.01"
                    value={form1099Data.grossProceedsAttorney}
                    onChange={(e) =>
                      updateForm1099Data("grossProceedsAttorney", Number.parseFloat(e.target.value) || 0)
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="state" className="space-y-4">
              <h3 className="text-lg font-semibold">State Income & Tax</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stateIncomeTax">State income tax withheld</Label>
                  <Input
                    id="stateIncomeTax"
                    type="number"
                    step="0.01"
                    value={form1099Data.stateIncomeTax}
                    onChange={(e) => updateForm1099Data("stateIncomeTax", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="stateNumber">State number</Label>
                  <Input
                    id="stateNumber"
                    value={form1099Data.stateNumber}
                    onChange={(e) => updateForm1099Data("stateNumber", e.target.value)}
                    placeholder="State number"
                  />
                </div>
                <div>
                  <Label htmlFor="payerStateNumber">Payer's state number</Label>
                  <Input
                    id="payerStateNumber"
                    value={form1099Data.payerStateNumber}
                    onChange={(e) => updateForm1099Data("payerStateNumber", e.target.value)}
                    placeholder="Payer's state number"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview">
              <div className="bg-white border-2 border-gray-300 p-6 rounded-lg">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold">Form 1099-MISC {form1099Data.taxYear}</h3>
                  <p className="text-sm">Miscellaneous Information</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm border-b pb-4 mb-4">
                  <div>
                    <p>
                      <strong>PAYER'S name:</strong> {form1099Data.payerName || "Payer Name"}
                    </p>
                    <p className="text-xs">{form1099Data.payerAddress || "Payer Address"}</p>
                    <p className="text-xs">
                      {form1099Data.payerCity}, {form1099Data.payerState} {form1099Data.payerZip}
                    </p>
                    <p>
                      <strong>PAYER'S TIN:</strong> {form1099Data.payerTIN || "XX-XXXXXXX"}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>RECIPIENT'S TIN:</strong> {form1099Data.recipientTIN || "XXX-XX-XXXX"}
                    </p>
                    <p>
                      <strong>RECIPIENT'S name:</strong> {form1099Data.recipientName || "Recipient Name"}
                    </p>
                    <p className="text-xs">{form1099Data.recipientAddress || "Recipient Address"}</p>
                    <p className="text-xs">
                      {form1099Data.recipientCity}, {form1099Data.recipientState} {form1099Data.recipientZip}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="border p-2">
                    <p className="font-bold">1. Rents</p>
                    <p>${form1099Data.rents.toFixed(2)}</p>
                  </div>
                  <div className="border p-2">
                    <p className="font-bold">2. Royalties</p>
                    <p>${form1099Data.royalties.toFixed(2)}</p>
                  </div>
                  <div className="border p-2">
                    <p className="font-bold">3. Other income</p>
                    <p>${form1099Data.otherIncome.toFixed(2)}</p>
                  </div>
                  <div className="border p-2">
                    <p className="font-bold">4. Federal income tax withheld</p>
                    <p>${form1099Data.federalIncomeTax.toFixed(2)}</p>
                  </div>
                  <div className="border p-2">
                    <p className="font-bold">7. Nonemployee compensation</p>
                    <p>${form1099Data.nonemployeeCompensation.toFixed(2)}</p>
                  </div>
                  <div className="border p-2">
                    <p className="font-bold">6. Medical and health care</p>
                    <p>${form1099Data.medicalHealthcare.toFixed(2)}</p>
                  </div>
                  <div className="border p-2">
                    <p className="font-bold">15. State tax withheld</p>
                    <p>${form1099Data.stateIncomeTax.toFixed(2)}</p>
                  </div>
                  <div className="border p-2">
                    <p className="font-bold">Account number</p>
                    <p>{form1099Data.accountNumber || "N/A"}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-primary mb-6">1099-MISC Preview</h2>
        </Card>
      </div>

      <div className="flex justify-center space-x-4">
        <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90">
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save 1099-MISC Form"}
        </Button>
        <Button onClick={handleDownload} disabled={isDownloading} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          {isDownloading ? "Generating..." : "Download PDF"}
        </Button>
      </div>
    </div>
  )
}
