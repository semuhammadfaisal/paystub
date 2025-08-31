"use client"

import { useState } from "react"
import { PaystubForm } from "@/components/paystub-form-new"
import { PaystubPreview } from "@/components/paystub-preview"
import { LogoUpload } from "@/components/logo-upload"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Save, Download } from "lucide-react"
import { savePaystub } from "@/lib/actions"
import { generatePaystubPDF, downloadPDF } from "@/lib/pdf-generator"
import { StepHeader } from "@/components/step-header"

export interface PaystubData {
  // Template Selection
  templateId: string

  // Additional Template Fields
  coNumber: string
  fileNumber: string
  deptNumber: string
  clockNumber: string
  vchrNumber: string

  // Payment Details
  paymentType: string
  employmentType: string
  email: string
  numberOfPaystubs: number
  taxState: string

  // Company Information
  companyName: string
  companyAddress: string
  companyAddress2?: string
  companyCity: string
  companyState: string
  companyZip: string
  companyPhone: string
  companyEIN: string
  companyLogo?: string

  // Employee Information
  employeeName: string
  employeeAddress: string
  employeeAddress2?: string
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
  payFrequency:
    | "daily"
    | "weekly"
    | "bi-weekly"
    | "semi-monthly"
    | "monthly"
    | "quarterly"
    | "semi-annually"
    | "annually"
  adviceNumber: string

  // Earnings Details
  payType: "hourly" | "salary"
  // Hourly fields (used when payType === "hourly")
  hourlyRate: number
  hoursWorked: number
  regularRate: number
  regularHours: number
  overtimeRate: number
  overtimeHours: number
  // Salary field (used when payType === "salary")
  salary: number
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
  coNumber: "",
  fileNumber: "",
  deptNumber: "",
  clockNumber: "",
  vchrNumber: "",
  paymentType: "",
  employmentType: "",
  email: "",
  numberOfPaystubs: 1,
  taxState: "",
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
  hourlyRate: 0,
  hoursWorked: 0,
  regularRate: 0,
  regularHours: 0,
  overtimeRate: 0,
  overtimeHours: 0,
  salary: 0,
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

      // Auto-calculate period end and pay date when frequency or start changes
      const shouldRecalculate =
        typeof updates.payPeriodStart !== "undefined" || typeof updates.payFrequency !== "undefined"
      const startDateStr = updated.payPeriodStart
      if (shouldRecalculate && startDateStr) {
        const base = new Date(startDateStr)
        const end = new Date(base.getTime())
        const pay = new Date(base.getTime())
        switch (updated.payFrequency) {
          case "daily":
            // same day
            end.setDate(base.getDate())
            pay.setTime(end.getTime())
            break
          case "weekly":
            end.setDate(end.getDate() + 6)
            pay.setTime(end.getTime())
            break
          case "bi-weekly":
            end.setDate(end.getDate() + 13)
            pay.setTime(end.getTime())
            break
          case "semi-monthly":
            // 1st-15th or 16th-end of month
            const day = base.getDate()
            if (day <= 15) {
              end.setDate(15)
            } else {
              // last day of month
              end.setMonth(end.getMonth() + 1, 0)
            }
            pay.setTime(end.getTime())
            break
          case "monthly":
            end.setMonth(end.getMonth() + 1)
            end.setDate(end.getDate() - 1)
            pay.setTime(end.getTime())
            break
          case "quarterly":
            end.setMonth(end.getMonth() + 3)
            end.setDate(end.getDate() - 1)
            pay.setTime(end.getTime())
            break
          case "semi-annually":
            end.setMonth(end.getMonth() + 6)
            end.setDate(end.getDate() - 1)
            pay.setTime(end.getTime())
            break
          case "annually":
            end.setFullYear(end.getFullYear() + 1)
            end.setDate(end.getDate() - 1)
            pay.setTime(end.getTime())
            break
        }
        const toISO = (d: Date) => d.toISOString().slice(0, 10)
        updated.payPeriodEnd = toISO(end)
        updated.payDate = toISO(pay)
      }

      // Calculate gross pay
      if (updated.payType === "hourly") {
        const regularPay = (updated.hourlyRate || 0) * (updated.hoursWorked || 0)
        const overtimePay = (updated.overtimeRate || 0) * (updated.overtimeHours || 0)
        const holidayPay = (updated.holidayHours || 0) * (updated.hourlyRate || 0)
        const sickPay = (updated.sickHours || 0) * (updated.hourlyRate || 0)
        const vacationPay = (updated.vacationHours || 0) * (updated.hourlyRate || 0)
        updated.grossPay =
          regularPay + overtimePay + holidayPay + sickPay + vacationPay + (updated.bonusAmount || 0) + (updated.commissionAmount || 0)
      } else {
        // Salary-based gross pay
        updated.grossPay = (updated.salary || 0) + (updated.bonusAmount || 0) + (updated.commissionAmount || 0)
      }

      // Calculate total deductions
      updated.totalDeductions =
        (updated.federalTax || 0) +
        (updated.stateTax || 0) +
        (updated.socialSecurity || 0) +
        (updated.medicare || 0) +
        (updated.stateDisability || 0) +
        (updated.healthInsurance || 0) +
        (updated.dentalInsurance || 0) +
        (updated.visionInsurance || 0) +
        (updated.lifeInsurance || 0) +
        (updated.retirement401k || 0) +
        (updated.rothIRA || 0) +
        (updated.hsa || 0) +
        (updated.parkingFee || 0) +
        (updated.unionDues || 0) +
        (updated.otherDeductions || 0)

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
        template_id: paystubData.templateId,
        co_number: paystubData.coNumber,
        file_number: paystubData.fileNumber,
        dept_number: paystubData.deptNumber,
        clock_number: paystubData.clockNumber,
        vchr_number: paystubData.vchrNumber,
        payment_type: paystubData.paymentType,
        employment_type: paystubData.employmentType,
        email: paystubData.email,
        number_of_paystubs: paystubData.numberOfPaystubs,
        tax_state: paystubData.taxState,
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
      console.log('Starting PDF generation...')
      console.log('Logo data in component:', paystubData.companyLogo ? 'Present' : 'Not present')
      if (paystubData.companyLogo) {
        console.log('Logo data length:', paystubData.companyLogo.length)
        console.log('Logo data preview:', paystubData.companyLogo.substring(0, 50))
      }
      
      const pdfData = {
        // Basic employee and employer info
        employee_name: paystubData.employeeName,
        employee_address: `${paystubData.employeeAddress}, ${paystubData.employeeCity}, ${paystubData.employeeState} ${paystubData.employeeZip}`,
        employee_ssn: paystubData.employeeSSN,
        employee_id: paystubData.employeeId,
        employee_phone: paystubData.employeePhone,
        employer_name: paystubData.companyName,
        employer_address: `${paystubData.companyAddress}, ${paystubData.companyCity}, ${paystubData.companyState} ${paystubData.companyZip}`,
        employer_ein: paystubData.companyEIN,
        employer_phone: paystubData.companyPhone,
        employer_logo: paystubData.companyLogo,

        // Pay period details
        pay_period_start: paystubData.payPeriodStart,
        pay_period_end: paystubData.payPeriodEnd,
        pay_date: paystubData.payDate,
        pay_frequency: paystubData.payFrequency,

        // Earnings
        pay_type: paystubData.payType,
        hourly_rate: paystubData.hourlyRate,
        hours_worked: paystubData.hoursWorked,
        overtime_hours: paystubData.overtimeHours,
        overtime_rate: paystubData.overtimeRate,
        salary: paystubData.salary,
        bonus: paystubData.bonusAmount,
        commission: paystubData.commissionAmount,
        holiday_hours: paystubData.holidayHours,
        sick_hours: paystubData.sickHours,
        vacation_hours: paystubData.vacationHours,

        // Deductions
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

        // Year-to-Date totals
        ytd_gross_pay: paystubData.ytdGrossPay,
        ytd_federal_tax: paystubData.ytdFederalTax,
        ytd_state_tax: paystubData.ytdStateTax,
        ytd_social_security: paystubData.ytdSocialSecurity,
        ytd_medicare: paystubData.ytdMedicare,
        ytd_total_deductions: paystubData.ytdTotalDeductions,
        ytd_net_pay: paystubData.ytdNetPay,

        // Calculated fields
        gross_pay: paystubData.grossPay,
        total_deductions: paystubData.totalDeductions,
        net_pay: paystubData.netPay,
      }

      console.log('PDF data prepared, logo in PDF data:', pdfData.employer_logo ? 'Present' : 'Not present')
      
      const pdfBlob = await generatePaystubPDF(pdfData)
      const filename = `paystub-${paystubData.employeeName.replace(/\/+/g, "-")}-${paystubData.payDate || "draft"}.pdf`
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
      <div className="space-y-8">
        <StepHeader step={1} title="Company Logo" />
        
        <div className="bg-white p-6 rounded-lg border">
          <LogoUpload 
            logo={paystubData.companyLogo} 
            onLogoChange={(logo) => updatePaystubData({ companyLogo: logo })} 
          />
        </div>

        <div className="bg-white">
          <PaystubForm data={paystubData} onUpdate={updatePaystubData} />
        </div>

        <StepHeader step={7} title="Review" />

        <div className="bg-white">
          <PaystubPreview data={paystubData} />
        </div>
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
