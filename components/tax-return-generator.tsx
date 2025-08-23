"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { generateTaxReturnPDF } from "@/lib/tax-return-pdf-generator"
import { saveTaxReturn } from "@/lib/actions"
import type { User } from "@supabase/supabase-js"

interface TaxReturnData {
  // Personal Information
  firstName: string
  lastName: string
  ssn: string
  dateOfBirth: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  email: string
  filingStatus: string

  // Spouse Information (if married)
  spouseFirstName: string
  spouseLastName: string
  spouseSSN: string
  spouseDateOfBirth: string

  // Income Information
  wages: number
  interestIncome: number
  dividendIncome: number
  businessIncome: number
  capitalGains: number
  otherIncome: number

  // Deductions
  standardDeduction: boolean
  itemizedDeductions: number
  mortgageInterest: number
  stateLocalTaxes: number
  charitableContributions: number
  medicalExpenses: number

  // Tax Information
  federalTaxWithheld: number
  estimatedTaxPayments: number
  refundableCredits: number

  // Dependents
  dependents: Array<{
    name: string
    ssn: string
    relationship: string
    dateOfBirth: string
  }>
}

interface TaxReturnGeneratorProps {
  user: User
}

export default function TaxReturnGenerator({ user }: TaxReturnGeneratorProps) {
  const [formData, setFormData] = useState<TaxReturnData>({
    firstName: "",
    lastName: "",
    ssn: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: user.email || "",
    filingStatus: "single",
    spouseFirstName: "",
    spouseLastName: "",
    spouseSSN: "",
    spouseDateOfBirth: "",
    wages: 0,
    interestIncome: 0,
    dividendIncome: 0,
    businessIncome: 0,
    capitalGains: 0,
    otherIncome: 0,
    standardDeduction: true,
    itemizedDeductions: 0,
    mortgageInterest: 0,
    stateLocalTaxes: 0,
    charitableContributions: 0,
    medicalExpenses: 0,
    federalTaxWithheld: 0,
    estimatedTaxPayments: 0,
    refundableCredits: 0,
    dependents: [],
  })

  const [activeTab, setActiveTab] = useState("personal")
  const [isGenerating, setIsGenerating] = useState(false)

  const updateFormData = (field: keyof TaxReturnData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addDependent = () => {
    setFormData((prev) => ({
      ...prev,
      dependents: [...prev.dependents, { name: "", ssn: "", relationship: "", dateOfBirth: "" }],
    }))
  }

  const updateDependent = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      dependents: prev.dependents.map((dep, i) => (i === index ? { ...dep, [field]: value } : dep)),
    }))
  }

  const removeDependent = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      dependents: prev.dependents.filter((_, i) => i !== index),
    }))
  }

  const calculateTotalIncome = () => {
    return (
      formData.wages +
      formData.interestIncome +
      formData.dividendIncome +
      formData.businessIncome +
      formData.capitalGains +
      formData.otherIncome
    )
  }

  const calculateAdjustedGrossIncome = () => {
    return calculateTotalIncome() // Simplified calculation
  }

  const calculateTaxableIncome = () => {
    const agi = calculateAdjustedGrossIncome()
    const deduction = formData.standardDeduction ? 13850 : formData.itemizedDeductions // 2023 standard deduction
    return Math.max(0, agi - deduction)
  }

  const calculateTaxOwed = () => {
    const taxableIncome = calculateTaxableIncome()
    // Simplified tax calculation (2023 tax brackets)
    let tax = 0
    if (taxableIncome > 0) {
      if (taxableIncome <= 11000) {
        tax = taxableIncome * 0.1
      } else if (taxableIncome <= 44725) {
        tax = 1100 + (taxableIncome - 11000) * 0.12
      } else if (taxableIncome <= 95375) {
        tax = 5147 + (taxableIncome - 44725) * 0.22
      } else {
        tax = 16290 + (taxableIncome - 95375) * 0.24
      }
    }
    return Math.round(tax)
  }

  const calculateRefundOrOwed = () => {
    const taxOwed = calculateTaxOwed()
    const totalPayments = formData.federalTaxWithheld + formData.estimatedTaxPayments + formData.refundableCredits
    return totalPayments - taxOwed
  }

  const handleSave = async () => {
    try {
      setIsGenerating(true)
      await saveTaxReturn({
        user_id: user.id,
        tax_year: new Date().getFullYear() - 1,
        filing_status: formData.filingStatus,
        total_income: calculateTotalIncome(),
        taxable_income: calculateTaxableIncome(),
        tax_owed: calculateTaxOwed(),
        refund_amount: Math.max(0, calculateRefundOrOwed()),
        form_data: formData,
      })
      alert("Tax return saved successfully!")
    } catch (error) {
      console.error("Error saving tax return:", error)
      alert("Error saving tax return")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async () => {
    try {
      setIsGenerating(true)
      await generateTaxReturnPDF(formData, calculateRefundOrOwed())
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Tax Return Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="income">Income</TabsTrigger>
                <TabsTrigger value="deductions">Deductions</TabsTrigger>
                <TabsTrigger value="dependents">Dependents</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => updateFormData("firstName", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => updateFormData("lastName", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ssn">Social Security Number</Label>
                    <Input
                      id="ssn"
                      value={formData.ssn}
                      onChange={(e) => updateFormData("ssn", e.target.value)}
                      placeholder="XXX-XX-XXXX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" value={formData.city} onChange={(e) => updateFormData("city", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => updateFormData("state", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => updateFormData("zipCode", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="filingStatus">Filing Status</Label>
                  <Select
                    value={formData.filingStatus}
                    onValueChange={(value) => updateFormData("filingStatus", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married-joint">Married Filing Jointly</SelectItem>
                      <SelectItem value="married-separate">Married Filing Separately</SelectItem>
                      <SelectItem value="head-of-household">Head of Household</SelectItem>
                      <SelectItem value="qualifying-widow">Qualifying Widow(er)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(formData.filingStatus === "married-joint" || formData.filingStatus === "married-separate") && (
                  <div className="space-y-4 border-t pt-4">
                    <h4 className="font-medium">Spouse Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="spouseFirstName">Spouse First Name</Label>
                        <Input
                          id="spouseFirstName"
                          value={formData.spouseFirstName}
                          onChange={(e) => updateFormData("spouseFirstName", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="spouseLastName">Spouse Last Name</Label>
                        <Input
                          id="spouseLastName"
                          value={formData.spouseLastName}
                          onChange={(e) => updateFormData("spouseLastName", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="spouseSSN">Spouse SSN</Label>
                        <Input
                          id="spouseSSN"
                          value={formData.spouseSSN}
                          onChange={(e) => updateFormData("spouseSSN", e.target.value)}
                          placeholder="XXX-XX-XXXX"
                        />
                      </div>
                      <div>
                        <Label htmlFor="spouseDateOfBirth">Spouse Date of Birth</Label>
                        <Input
                          id="spouseDateOfBirth"
                          type="date"
                          value={formData.spouseDateOfBirth}
                          onChange={(e) => updateFormData("spouseDateOfBirth", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="income" className="space-y-4">
                <div>
                  <Label htmlFor="wages">Wages, Salaries, Tips</Label>
                  <Input
                    id="wages"
                    type="number"
                    value={formData.wages}
                    onChange={(e) => updateFormData("wages", Number.parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="interestIncome">Interest Income</Label>
                  <Input
                    id="interestIncome"
                    type="number"
                    value={formData.interestIncome}
                    onChange={(e) => updateFormData("interestIncome", Number.parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="dividendIncome">Dividend Income</Label>
                  <Input
                    id="dividendIncome"
                    type="number"
                    value={formData.dividendIncome}
                    onChange={(e) => updateFormData("dividendIncome", Number.parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="businessIncome">Business Income</Label>
                  <Input
                    id="businessIncome"
                    type="number"
                    value={formData.businessIncome}
                    onChange={(e) => updateFormData("businessIncome", Number.parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="capitalGains">Capital Gains</Label>
                  <Input
                    id="capitalGains"
                    type="number"
                    value={formData.capitalGains}
                    onChange={(e) => updateFormData("capitalGains", Number.parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="otherIncome">Other Income</Label>
                  <Input
                    id="otherIncome"
                    type="number"
                    value={formData.otherIncome}
                    onChange={(e) => updateFormData("otherIncome", Number.parseFloat(e.target.value) || 0)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="deductions" className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="standardDeduction"
                    checked={formData.standardDeduction}
                    onCheckedChange={(checked) => updateFormData("standardDeduction", checked)}
                  />
                  <Label htmlFor="standardDeduction">Use Standard Deduction ($13,850)</Label>
                </div>

                {!formData.standardDeduction && (
                  <div className="space-y-4 border-t pt-4">
                    <h4 className="font-medium">Itemized Deductions</h4>
                    <div>
                      <Label htmlFor="mortgageInterest">Mortgage Interest</Label>
                      <Input
                        id="mortgageInterest"
                        type="number"
                        value={formData.mortgageInterest}
                        onChange={(e) => updateFormData("mortgageInterest", Number.parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="stateLocalTaxes">State and Local Taxes</Label>
                      <Input
                        id="stateLocalTaxes"
                        type="number"
                        value={formData.stateLocalTaxes}
                        onChange={(e) => updateFormData("stateLocalTaxes", Number.parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="charitableContributions">Charitable Contributions</Label>
                      <Input
                        id="charitableContributions"
                        type="number"
                        value={formData.charitableContributions}
                        onChange={(e) =>
                          updateFormData("charitableContributions", Number.parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="medicalExpenses">Medical Expenses</Label>
                      <Input
                        id="medicalExpenses"
                        type="number"
                        value={formData.medicalExpenses}
                        onChange={(e) => updateFormData("medicalExpenses", Number.parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-medium">Tax Payments</h4>
                  <div>
                    <Label htmlFor="federalTaxWithheld">Federal Tax Withheld</Label>
                    <Input
                      id="federalTaxWithheld"
                      type="number"
                      value={formData.federalTaxWithheld}
                      onChange={(e) => updateFormData("federalTaxWithheld", Number.parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="estimatedTaxPayments">Estimated Tax Payments</Label>
                    <Input
                      id="estimatedTaxPayments"
                      type="number"
                      value={formData.estimatedTaxPayments}
                      onChange={(e) => updateFormData("estimatedTaxPayments", Number.parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="refundableCredits">Refundable Credits</Label>
                    <Input
                      id="refundableCredits"
                      type="number"
                      value={formData.refundableCredits}
                      onChange={(e) => updateFormData("refundableCredits", Number.parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="dependents" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Dependents</h4>
                  <Button onClick={addDependent} variant="outline" size="sm">
                    Add Dependent
                  </Button>
                </div>

                {formData.dependents.map((dependent, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h5 className="font-medium">Dependent {index + 1}</h5>
                      <Button
                        onClick={() => removeDependent(index)}
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={dependent.name}
                          onChange={(e) => updateDependent(index, "name", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>SSN</Label>
                        <Input
                          value={dependent.ssn}
                          onChange={(e) => updateDependent(index, "ssn", e.target.value)}
                          placeholder="XXX-XX-XXXX"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Relationship</Label>
                        <Input
                          value={dependent.relationship}
                          onChange={(e) => updateDependent(index, "relationship", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Date of Birth</Label>
                        <Input
                          type="date"
                          value={dependent.dateOfBirth}
                          onChange={(e) => updateDependent(index, "dateOfBirth", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {formData.dependents.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No dependents added</p>
                )}
              </TabsContent>

              <TabsContent value="summary" className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <h4 className="font-medium text-lg">Tax Calculation Summary</h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-600">Total Income</Label>
                      <p className="text-lg font-medium">${calculateTotalIncome().toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Adjusted Gross Income</Label>
                      <p className="text-lg font-medium">${calculateAdjustedGrossIncome().toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-600">Taxable Income</Label>
                      <p className="text-lg font-medium">${calculateTaxableIncome().toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Tax Owed</Label>
                      <p className="text-lg font-medium">${calculateTaxOwed().toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="text-center">
                      <Label className="text-sm text-gray-600">
                        {calculateRefundOrOwed() >= 0 ? "Refund Amount" : "Amount Owed"}
                      </Label>
                      <p
                        className={`text-2xl font-bold ${calculateRefundOrOwed() >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        ${Math.abs(calculateRefundOrOwed()).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={handleSave} disabled={isGenerating} className="flex-1">
                    {isGenerating ? "Saving..." : "Save Tax Return"}
                  </Button>
                  <Button
                    onClick={handleDownload}
                    disabled={isGenerating}
                    variant="outline"
                    className="flex-1 bg-transparent"
                  >
                    {isGenerating ? "Generating..." : "Download PDF"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Tax Return Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white border rounded-lg p-6 space-y-4 text-sm">
              <div className="text-center border-b pb-4">
                <h3 className="text-lg font-bold">U.S. Individual Income Tax Return</h3>
                <p className="text-gray-600">Form 1040</p>
                <p className="text-gray-600">Tax Year {new Date().getFullYear() - 1}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Taxpayer Information</h4>
                  <p>
                    {formData.firstName} {formData.lastName}
                  </p>
                  <p>SSN: {formData.ssn || "XXX-XX-XXXX"}</p>
                  <p>{formData.address}</p>
                  <p>
                    {formData.city}, {formData.state} {formData.zipCode}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Filing Status</h4>
                  <p className="capitalize">{formData.filingStatus.replace("-", " ")}</p>
                  {formData.dependents.length > 0 && <p>{formData.dependents.length} dependent(s)</p>}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Income Summary</h4>
                <div className="space-y-1">
                  {formData.wages > 0 && <p>Wages: ${formData.wages.toLocaleString()}</p>}
                  {formData.interestIncome > 0 && <p>Interest: ${formData.interestIncome.toLocaleString()}</p>}
                  {formData.dividendIncome > 0 && <p>Dividends: ${formData.dividendIncome.toLocaleString()}</p>}
                  {formData.businessIncome > 0 && <p>Business: ${formData.businessIncome.toLocaleString()}</p>}
                  {formData.capitalGains > 0 && <p>Capital Gains: ${formData.capitalGains.toLocaleString()}</p>}
                  {formData.otherIncome > 0 && <p>Other: ${formData.otherIncome.toLocaleString()}</p>}
                  <p className="font-medium border-t pt-1">Total Income: ${calculateTotalIncome().toLocaleString()}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Tax Calculation</h4>
                <div className="space-y-1">
                  <p>Adjusted Gross Income: ${calculateAdjustedGrossIncome().toLocaleString()}</p>
                  <p>
                    {formData.standardDeduction ? "Standard" : "Itemized"} Deduction: $
                    {(formData.standardDeduction ? 13850 : formData.itemizedDeductions).toLocaleString()}
                  </p>
                  <p>Taxable Income: ${calculateTaxableIncome().toLocaleString()}</p>
                  <p>Tax Owed: ${calculateTaxOwed().toLocaleString()}</p>
                  <p>
                    Total Payments: $
                    {(
                      formData.federalTaxWithheld +
                      formData.estimatedTaxPayments +
                      formData.refundableCredits
                    ).toLocaleString()}
                  </p>
                  <p
                    className={`font-medium border-t pt-1 ${calculateRefundOrOwed() >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {calculateRefundOrOwed() >= 0 ? "Refund" : "Amount Owed"}: $
                    {Math.abs(calculateRefundOrOwed()).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
