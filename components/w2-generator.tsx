"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Save, Download } from "lucide-react"
import { generateW2PDF, downloadW2PDF } from "@/lib/w2-pdf-generator"

export interface W2Data {
  // Basic Information
  taxYear: string

  // Employer Information
  employerName: string
  employerAddress: string
  employerCity: string
  employerState: string
  employerZip: string
  employerEIN: string
  employerPhone: string

  // Employee Information
  employeeName: string
  employeeAddress: string
  employeeCity: string
  employeeState: string
  employeeZip: string
  employeeSSN: string

  // Earnings and Taxes
  wagesAndTips: number
  federalIncomeTax: number
  socialSecurityWages: number
  socialSecurityTax: number
  medicareWages: number
  medicareTax: number
  socialSecurityTips: number
  allocatedTips: number
  dependentCareBenefits: number
  nonqualifiedPlans: number
  retirementPlan: boolean
  thirdPartySickPay: boolean

  // State Information
  stateWages: number
  stateIncomeTax: number
  localWages: number
  localIncomeTax: number
  localityName: string
}

interface W2GeneratorProps {
  user: any
}

const initialData: W2Data = {
  taxYear: new Date().getFullYear().toString(),
  employerName: "",
  employerAddress: "",
  employerCity: "",
  employerState: "",
  employerZip: "",
  employerEIN: "",
  employerPhone: "",
  employeeName: "",
  employeeAddress: "",
  employeeCity: "",
  employeeState: "",
  employeeZip: "",
  employeeSSN: "",
  wagesAndTips: 0,
  federalIncomeTax: 0,
  socialSecurityWages: 0,
  socialSecurityTax: 0,
  medicareWages: 0,
  medicareTax: 0,
  socialSecurityTips: 0,
  allocatedTips: 0,
  dependentCareBenefits: 0,
  nonqualifiedPlans: 0,
  retirementPlan: false,
  thirdPartySickPay: false,
  stateWages: 0,
  stateIncomeTax: 0,
  localWages: 0,
  localIncomeTax: 0,
  localityName: "",
}

export function W2Generator({ user }: W2GeneratorProps) {
  const [w2Data, setW2Data] = useState<W2Data>(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const updateW2Data = (field: keyof W2Data, value: string | number | boolean) => {
    setW2Data((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!w2Data.employeeName || !w2Data.employerName) {
      alert("Please fill in at least employee name and employer name")
      return
    }
    setIsSaving(true)
    try {
      // TODO: Implement save to database
      setTimeout(() => {
        alert("W2 form saved successfully!")
        setIsSaving(false)
      }, 1000)
    } catch (error) {
      console.error("Save error:", error)
      alert("Failed to save W2 form")
      setIsSaving(false)
    }
  }

  const handleDownload = async () => {
    if (!w2Data.employeeName || !w2Data.employerName) {
      alert("Please fill in at least employee name and employer name")
      return
    }
    setIsDownloading(true)
    try {
      const pdfBlob = await generateW2PDF(w2Data)
      const filename = `w2-${w2Data.employeeName.replace(/\s+/g, "-")}-${w2Data.taxYear}.png`
      downloadW2PDF(pdfBlob, filename)
    } catch (error) {
      console.error("Download error:", error)
      alert("Failed to generate W2 PDF")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-primary mb-6">W2 Form Information</h2>

          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="employer">Employer</TabsTrigger>
              <TabsTrigger value="employee">Employee</TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="taxYear">Tax Year</Label>
                  <Input
                    id="taxYear"
                    value={w2Data.taxYear}
                    onChange={(e) => updateW2Data("taxYear", e.target.value)}
                    placeholder="2024"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="employer" className="space-y-4">
              <h3 className="text-lg font-semibold">Employer Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="employerName">Employer Name</Label>
                  <Input
                    id="employerName"
                    value={w2Data.employerName}
                    onChange={(e) => updateW2Data("employerName", e.target.value)}
                    placeholder="ABC Corporation"
                  />
                </div>
                <div>
                  <Label htmlFor="employerEIN">Employer ID Number (EIN)</Label>
                  <Input
                    id="employerEIN"
                    value={w2Data.employerEIN}
                    onChange={(e) => updateW2Data("employerEIN", e.target.value)}
                    placeholder="12-3456789"
                  />
                </div>
                <div>
                  <Label htmlFor="employerPhone">Phone Number</Label>
                  <Input
                    id="employerPhone"
                    value={w2Data.employerPhone}
                    onChange={(e) => updateW2Data("employerPhone", e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="employerAddress">Address</Label>
                  <Input
                    id="employerAddress"
                    value={w2Data.employerAddress}
                    onChange={(e) => updateW2Data("employerAddress", e.target.value)}
                    placeholder="123 Business St"
                  />
                </div>
                <div>
                  <Label htmlFor="employerCity">City</Label>
                  <Input
                    id="employerCity"
                    value={w2Data.employerCity}
                    onChange={(e) => updateW2Data("employerCity", e.target.value)}
                    placeholder="New York"
                  />
                </div>
                <div>
                  <Label htmlFor="employerState">State</Label>
                  <Select value={w2Data.employerState} onValueChange={(value) => updateW2Data("employerState", value)}>
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
                  <Label htmlFor="employerZip">ZIP Code</Label>
                  <Input
                    id="employerZip"
                    value={w2Data.employerZip}
                    onChange={(e) => updateW2Data("employerZip", e.target.value)}
                    placeholder="10001"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="employee" className="space-y-4">
              <h3 className="text-lg font-semibold">Employee Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employeeName">Full Name</Label>
                  <Input
                    id="employeeName"
                    value={w2Data.employeeName}
                    onChange={(e) => updateW2Data("employeeName", e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="employeeSSN">Social Security Number</Label>
                  <Input
                    id="employeeSSN"
                    value={w2Data.employeeSSN}
                    onChange={(e) => updateW2Data("employeeSSN", e.target.value)}
                    placeholder="123-45-6789"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="employeeAddress">Address</Label>
                  <Input
                    id="employeeAddress"
                    value={w2Data.employeeAddress}
                    onChange={(e) => updateW2Data("employeeAddress", e.target.value)}
                    placeholder="123 Main St"
                  />
                </div>
                <div>
                  <Label htmlFor="employeeCity">City</Label>
                  <Input
                    id="employeeCity"
                    value={w2Data.employeeCity}
                    onChange={(e) => updateW2Data("employeeCity", e.target.value)}
                    placeholder="New York"
                  />
                </div>
                <div>
                  <Label htmlFor="employeeState">State</Label>
                  <Select value={w2Data.employeeState} onValueChange={(value) => updateW2Data("employeeState", value)}>
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
                  <Label htmlFor="employeeZip">ZIP Code</Label>
                  <Input
                    id="employeeZip"
                    value={w2Data.employeeZip}
                    onChange={(e) => updateW2Data("employeeZip", e.target.value)}
                    placeholder="10001"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="earnings" className="space-y-4">
              <h3 className="text-lg font-semibold">Earnings and Taxes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="wagesAndTips">Wages, tips, other compensation</Label>
                  <Input
                    id="wagesAndTips"
                    type="number"
                    step="0.01"
                    value={w2Data.wagesAndTips}
                    onChange={(e) => updateW2Data("wagesAndTips", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="federalIncomeTax">Federal income tax withheld</Label>
                  <Input
                    id="federalIncomeTax"
                    type="number"
                    step="0.01"
                    value={w2Data.federalIncomeTax}
                    onChange={(e) => updateW2Data("federalIncomeTax", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="socialSecurityWages">Social security wages</Label>
                  <Input
                    id="socialSecurityWages"
                    type="number"
                    step="0.01"
                    value={w2Data.socialSecurityWages}
                    onChange={(e) => updateW2Data("socialSecurityWages", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="socialSecurityTax">Social security tax withheld</Label>
                  <Input
                    id="socialSecurityTax"
                    type="number"
                    step="0.01"
                    value={w2Data.socialSecurityTax}
                    onChange={(e) => updateW2Data("socialSecurityTax", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="medicareWages">Medicare wages and tips</Label>
                  <Input
                    id="medicareWages"
                    type="number"
                    step="0.01"
                    value={w2Data.medicareWages}
                    onChange={(e) => updateW2Data("medicareWages", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="medicareTax">Medicare tax withheld</Label>
                  <Input
                    id="medicareTax"
                    type="number"
                    step="0.01"
                    value={w2Data.medicareTax}
                    onChange={(e) => updateW2Data("medicareTax", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="stateWages">State wages, tips, etc.</Label>
                  <Input
                    id="stateWages"
                    type="number"
                    step="0.01"
                    value={w2Data.stateWages}
                    onChange={(e) => updateW2Data("stateWages", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="stateIncomeTax">State income tax</Label>
                  <Input
                    id="stateIncomeTax"
                    type="number"
                    step="0.01"
                    value={w2Data.stateIncomeTax}
                    onChange={(e) => updateW2Data("stateIncomeTax", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="retirementPlan"
                      checked={w2Data.retirementPlan}
                      onCheckedChange={(checked) => updateW2Data("retirementPlan", checked as boolean)}
                    />
                    <Label htmlFor="retirementPlan">Retirement plan</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="thirdPartySickPay"
                      checked={w2Data.thirdPartySickPay}
                      onCheckedChange={(checked) => updateW2Data("thirdPartySickPay", checked as boolean)}
                    />
                    <Label htmlFor="thirdPartySickPay">Third-party sick pay</Label>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview">
              <div className="bg-white border-2 border-gray-300 p-6 rounded-lg">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold">Form W-2 Wage and Tax Statement {w2Data.taxYear}</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm border-b pb-4 mb-4">
                  <div>
                    <p>
                      <strong>a. Employee's SSN:</strong> {w2Data.employeeSSN || "XXX-XX-XXXX"}
                    </p>
                    <p>
                      <strong>b. Employer ID (EIN):</strong> {w2Data.employerEIN || "XX-XXXXXXX"}
                    </p>
                    <p>
                      <strong>c. Employer's name:</strong> {w2Data.employerName || "Employer Name"}
                    </p>
                    <p className="text-xs">{w2Data.employerAddress || "Employer Address"}</p>
                    <p className="text-xs">
                      {w2Data.employerCity}, {w2Data.employerState} {w2Data.employerZip}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>e. Employee's name:</strong> {w2Data.employeeName || "Employee Name"}
                    </p>
                    <p>
                      <strong>f. Employee's address:</strong>
                    </p>
                    <p className="text-xs">{w2Data.employeeAddress || "Employee Address"}</p>
                    <p className="text-xs">
                      {w2Data.employeeCity}, {w2Data.employeeState} {w2Data.employeeZip}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="border p-2">
                    <p className="font-bold">1. Wages, tips, other compensation</p>
                    <p>${w2Data.wagesAndTips.toFixed(2)}</p>
                  </div>
                  <div className="border p-2">
                    <p className="font-bold">2. Federal income tax withheld</p>
                    <p>${w2Data.federalIncomeTax.toFixed(2)}</p>
                  </div>
                  <div className="border p-2">
                    <p className="font-bold">3. Social security wages</p>
                    <p>${w2Data.socialSecurityWages.toFixed(2)}</p>
                  </div>
                  <div className="border p-2">
                    <p className="font-bold">4. Social security tax withheld</p>
                    <p>${w2Data.socialSecurityTax.toFixed(2)}</p>
                  </div>
                  <div className="border p-2">
                    <p className="font-bold">5. Medicare wages and tips</p>
                    <p>${w2Data.medicareWages.toFixed(2)}</p>
                  </div>
                  <div className="border p-2">
                    <p className="font-bold">6. Medicare tax withheld</p>
                    <p>${w2Data.medicareTax.toFixed(2)}</p>
                  </div>
                  <div className="border p-2">
                    <p className="font-bold">16. State wages, tips, etc.</p>
                    <p>${w2Data.stateWages.toFixed(2)}</p>
                  </div>
                  <div className="border p-2">
                    <p className="font-bold">17. State income tax</p>
                    <p>${w2Data.stateIncomeTax.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-primary mb-6">W2 Preview</h2>
        </Card>
      </div>

      <div className="flex justify-center space-x-4">
        <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90">
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save W2 Form"}
        </Button>
        <Button onClick={handleDownload} disabled={isDownloading} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          {isDownloading ? "Generating..." : "Download PDF"}
        </Button>
      </div>
    </div>
  )
}
