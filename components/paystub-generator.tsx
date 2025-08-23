"use client"

import { useState } from "react"
import { PaystubForm } from "@/components/paystub-form"
import { PaystubPreview } from "@/components/paystub-preview"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Save, Download } from "lucide-react"
import { savePaystub } from "@/lib/actions"
import { generatePaystubPDF, downloadPDF } from "@/lib/pdf-generator"

export interface PaystubData {
  // Template Selection
  templateId: string

  // Company Information
  companyName: string
  companyAddress: string
  companyCity: string
  companyState: string
  companyZip: string
  companyPhone: string
  companyEIN: string
  companyLogo?: string

  // Employee Information
  employeeName: string
  employeeAddress: string
  employeeCity: string
  employeeState: string
  employeeZip: string
  employeeSSN: string
  employeeId: string
  employeePhone: string
  exemptions: number
  maritalStatus: "single" | "married" | "head_of_household"
  directDeposit: boolean

  // Pay Period Information
  payPeriodNumber: number
  payPeriodStart: string
  payPeriodEnd: string
  payDate: string
  payFrequency: "weekly" | "bi-weekly" | "semi-monthly" | "monthly"
  adviceNumber: string

  // Earnings Details
  payType: "hourly" | "salary"
  regularRate: number
  regularHours: number
  overtimeRate: number
  overtimeHours: number
  bonusAmount: number
  commissionAmount: number
  holidayHours: number
  sickHours: number
  vacationHours: number

  // Deductions
  federalTax: number
  stateTax: number
  socialSecurity: number
  medicare: number
  stateDisability: number
  healthInsurance: number
  dentalInsurance: number
  visionInsurance: number
  lifeInsurance: number
  retirement401k: number
  rothIRA: number
  hsa: number
  parkingFee: number
  unionDues: number
  otherDeductions: number

  // Year to Date Totals
  ytdGrossPay: number
  ytdFederalTax: number
  ytdStateTax: number
  ytdSocialSecurity: number
  ytdMedicare: number
  ytdTotalDeductions: number
  ytdNetPay: number

  // Calculated fields
  grossPay: number
  totalDeductions: number
  netPay: number
}

interface PaystubGeneratorProps {
  user: any
}

const initialData: PaystubData = {
  templateId: "template1",
  companyName: "",
  companyAddress: "",
  companyCity: "",
  companyState: "",
  companyZip: "",
  companyPhone: "",
  companyEIN: "",
  employeeName: "",
  employeeAddress: "",
  employeeCity: "",
  employeeState: "",
  employeeZip: "",
  employeeSSN: "",
  employeeId: "",
  employeePhone: "",
  exemptions: 0,
  maritalStatus: "single",
  directDeposit: false,
  payPeriodNumber: 1,
  payPeriodStart: "",
  payPeriodEnd: "",
  payDate: "",
  payFrequency: "bi-weekly",
  adviceNumber: "",
  payType: "hourly",
  regularRate: 0,
  regularHours: 0,
  overtimeRate: 0,
  overtimeHours: 0,
  bonusAmount: 0,
  commissionAmount: 0,
  holidayHours: 0,
  sickHours: 0,
  vacationHours: 0,
  federalTax: 0,
  stateTax: 0,
  socialSecurity: 0,
  medicare: 0,
  stateDisability: 0,
  healthInsurance: 0,
  dentalInsurance: 0,
  visionInsurance: 0,
  lifeInsurance: 0,
  retirement401k: 0,
  rothIRA: 0,
  hsa: 0,
  parkingFee: 0,
  unionDues: 0,
  otherDeductions: 0,
  ytdGrossPay: 0,
  ytdFederalTax: 0,
  ytdStateTax: 0,
  ytdSocialSecurity: 0,
  ytdMedicare: 0,
  ytdTotalDeductions: 0,
  ytdNetPay: 0,
  grossPay: 0,
  totalDeductions: 0,
  netPay: 0,
}

export function PaystubGenerator({ user }: PaystubGeneratorProps) {
  const [paystubData, setPaystubData] = useState<PaystubData>(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const updatePaystubData = (updates: Partial<PaystubData>) => {
    setPaystubData((prev) => {
      const updated = { ...prev, ...updates }

      if (updated.payType === "hourly") {
        const regularPay = updated.regularRate * updated.regularHours
        const overtimePay = updated.overtimeHours * (updated.overtimeRate || updated.regularRate * 1.5)
        const holidayPay = updated.holidayHours * updated.regularRate
        const sickPay = updated.sickHours * updated.regularRate
        const vacationPay = updated.vacationHours * updated.regularRate
        updated.grossPay =
          regularPay + overtimePay + holidayPay + sickPay + vacationPay + updated.bonusAmount + updated.commissionAmount
      } else {
        updated.grossPay = updated.regularRate + updated.bonusAmount + updated.commissionAmount
      }

      // Calculate total deductions
      updated.totalDeductions =
        updated.federalTax +
        updated.stateTax +
        updated.socialSecurity +
        updated.medicare +
        updated.stateDisability +
        updated.healthInsurance +
        updated.dentalInsurance +
        updated.visionInsurance +
        updated.lifeInsurance +
        updated.retirement401k +
        updated.rothIRA +
        updated.hsa +
        updated.parkingFee +
        updated.unionDues +
        updated.otherDeductions

      // Calculate net pay
      updated.netPay = updated.grossPay - updated.totalDeductions

      return updated
    })
  }

  const handleSave = async () => {
    if (!paystubData.employeeName || !paystubData.companyName) {
      alert("Please fill in at least employee name and company name")
      return
    }

    setIsSaving(true)
    try {
      const dbData = {
        user_id: user.id,
        employee_name: paystubData.employeeName,
        employee_address: `${paystubData.employeeAddress}, ${paystubData.employeeCity}, ${paystubData.employeeState} ${paystubData.employeeZip}`,
        employee_ssn: paystubData.employeeSSN,
        employer_name: paystubData.companyName,
        employer_address: `${paystubData.companyAddress}, ${paystubData.companyCity}, ${paystubData.companyState} ${paystubData.companyZip}`,
        employer_phone: paystubData.companyPhone,
        employer_ein: paystubData.companyEIN,
        employer_logo: paystubData.companyLogo,
        pay_period_number: paystubData.payPeriodNumber,
        pay_period_start: paystubData.payPeriodStart,
        pay_period_end: paystubData.payPeriodEnd,
        pay_date: paystubData.payDate,
        pay_frequency: paystubData.payFrequency,
        advice_number: paystubData.adviceNumber,
        pay_type: paystubData.payType,
        regular_rate: paystubData.regularRate || null,
        regular_hours: paystubData.regularHours || null,
        overtime_rate: paystubData.overtimeRate || null,
        overtime_hours: paystubData.overtimeHours || null,
        bonus_amount: paystubData.bonusAmount || null,
        commission_amount: paystubData.commissionAmount || null,
        holiday_hours: paystubData.holidayHours || null,
        sick_hours: paystubData.sickHours || null,
        vacation_hours: paystubData.vacationHours || null,
        federal_tax: paystubData.federalTax,
        state_tax: paystubData.stateTax,
        social_security: paystubData.socialSecurity,
        medicare: paystubData.medicare,
        state_disability: paystubData.stateDisability,
        health_insurance: paystubData.healthInsurance,
        dental_insurance: paystubData.dentalInsurance,
        vision_insurance: paystubData.visionInsurance,
        life_insurance: paystubData.lifeInsurance,
        retirement_401k: paystubData.retirement401k,
        roth_ira: paystubData.rothIRA,
        hsa: paystubData.hsa,
        parking_fee: paystubData.parkingFee,
        union_dues: paystubData.unionDues,
        other_deductions: paystubData.otherDeductions,
        ytd_gross_pay: paystubData.ytdGrossPay,
        ytd_federal_tax: paystubData.ytdFederalTax,
        ytd_state_tax: paystubData.ytdStateTax,
        ytd_social_security: paystubData.ytdSocialSecurity,
        ytd_medicare: paystubData.ytdMedicare,
        ytd_total_deductions: paystubData.ytdTotalDeductions,
        ytd_net_pay: paystubData.ytdNetPay,
        gross_pay: paystubData.grossPay,
        total_deductions: paystubData.totalDeductions,
        net_pay: paystubData.netPay,
      }

      const result = await savePaystub(dbData)
      if (result.success) {
        alert("Paystub saved successfully!")
        setPaystubData(initialData)
      } else {
        alert("Failed to save paystub: " + result.error)
      }
    } catch (error) {
      console.error("Save error:", error)
      alert("Failed to save paystub")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownload = async () => {
    if (!paystubData.employeeName || !paystubData.companyName) {
      alert("Please fill in at least employee name and company name")
      return
    }

    setIsDownloading(true)
    try {
      const pdfData = {
        template_id: paystubData.templateId,
        employee_name: paystubData.employeeName,
        employee_address: `${paystubData.employeeAddress}, ${paystubData.employeeCity}, ${paystubData.employeeState} ${paystubData.employeeZip}`,
        employee_ssn: paystubData.employeeSSN,
        employee_id: paystubData.employeeId,
        employee_phone: paystubData.employeePhone,
        exemptions: paystubData.exemptions,
        marital_status: paystubData.maritalStatus,
        direct_deposit: paystubData.directDeposit,
        employer_name: paystubData.companyName,
        employer_address: `${paystubData.companyAddress}, ${paystubData.companyCity}, ${paystubData.companyState} ${paystubData.companyZip}`,
        employer_phone: paystubData.companyPhone,
        employer_ein: paystubData.companyEIN,
        employer_logo: paystubData.companyLogo,
        pay_period_number: paystubData.payPeriodNumber,
        pay_period_start: paystubData.payPeriodStart,
        pay_period_end: paystubData.payPeriodEnd,
        pay_date: paystubData.payDate,
        pay_frequency: paystubData.payFrequency,
        advice_number: paystubData.adviceNumber,
        pay_type: paystubData.payType,
        regular_rate: paystubData.regularRate,
        regular_hours: paystubData.regularHours,
        overtime_rate: paystubData.overtimeRate,
        overtime_hours: paystubData.overtimeHours,
        bonus_amount: paystubData.bonusAmount,
        commission_amount: paystubData.commissionAmount,
        holiday_hours: paystubData.holidayHours,
        sick_hours: paystubData.sickHours,
        vacation_hours: paystubData.vacationHours,
        federal_tax: paystubData.federalTax,
        state_tax: paystubData.stateTax,
        social_security: paystubData.socialSecurity,
        medicare: paystubData.medicare,
        state_disability: paystubData.stateDisability,
        health_insurance: paystubData.healthInsurance,
        dental_insurance: paystubData.dentalInsurance,
        vision_insurance: paystubData.visionInsurance,
        life_insurance: paystubData.lifeInsurance,
        retirement_401k: paystubData.retirement401k,
        roth_ira: paystubData.rothIRA,
        hsa: paystubData.hsa,
        parking_fee: paystubData.parkingFee,
        union_dues: paystubData.unionDues,
        other_deductions: paystubData.otherDeductions,
        ytd_gross_pay: paystubData.ytdGrossPay,
        ytd_federal_tax: paystubData.ytdFederalTax,
        ytd_state_tax: paystubData.ytdStateTax,
        ytd_social_security: paystubData.ytdSocialSecurity,
        ytd_medicare: paystubData.ytdMedicare,
        ytd_total_deductions: paystubData.ytdTotalDeductions,
        ytd_net_pay: paystubData.ytdNetPay,
        gross_pay: paystubData.grossPay,
        total_deductions: paystubData.totalDeductions,
        net_pay: paystubData.netPay,
      }

      const pdfBlob = await generatePaystubPDF(pdfData)
      const filename = `paystub-${paystubData.employeeName.replace(/\s+/g, "-")}-${paystubData.payDate || "draft"}.png`
      downloadPDF(pdfBlob, filename)
    } catch (error) {
      console.error("Download error:", error)
      alert("Failed to generate PDF")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-primary mb-6">Paystub Information</h2>
          <PaystubForm data={paystubData} onUpdate={updatePaystubData} />
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-primary mb-6">Preview</h2>
          <PaystubPreview data={paystubData} />
        </Card>
      </div>

      <div className="flex justify-center space-x-4">
        <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90">
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save Paystub"}
        </Button>
        <Button onClick={handleDownload} disabled={isDownloading} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          {isDownloading ? "Generating..." : "Download PDF"}
        </Button>
      </div>
    </div>
  )
}
