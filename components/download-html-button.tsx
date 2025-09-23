"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { generatePaystubPDF, type PaystubData as PdfData } from "@/lib/pdf-generator"
import type { PaystubData as GeneratorPaystubData } from "@/components/paystub-generator"

interface Props {
  data: GeneratorPaystubData
  label?: string
}

export function DownloadHtmlButton({ data, label = "Download PDF (HTML)" }: Props) {
  const [loading, setLoading] = useState(false)

  const onClick = async () => {
    try {
      setLoading(true)
      // Map generator data (camelCase) to PDF generator shape (snake_case)
      const pdfData: PdfData = {
        // Template selection
        templateId: data.templateId,

        // Basic employee and employer info
        employee_name: data.employeeName,
        employee_address: `${data.employeeAddress}, ${data.employeeCity}, ${data.employeeState} ${data.employeeZip}`,
        employee_ssn: data.employeeSSN,
        employee_id: data.employeeId,
        employee_phone: data.employeePhone,
        employer_name: data.companyName,
        employer_address: `${data.companyAddress}, ${data.companyCity}, ${data.companyState} ${data.companyZip}`,
        employer_ein: data.companyEIN,
        employer_phone: data.companyPhone,
        employer_logo: data.companyLogo,
        theme_color: data.themeColor,

        // Pay period details
        pay_period_start: data.payPeriodStart,
        pay_period_end: data.payPeriodEnd,
        pay_date: data.payDate,
        pay_frequency: data.payFrequency,
        tax_state: data.taxState,

        // Earnings
        pay_type: data.payType,
        hourly_rate: data.hourlyRate,
        hours_worked: data.hoursWorked,
        overtime_hours: data.overtimeHours,
        overtime_rate: data.overtimeRate,
        salary: data.salary,
        bonus: data.bonusAmount,
        commission: data.commissionAmount,
        holiday_hours: data.holidayHours,
        sick_hours: data.sickHours,
        vacation_hours: data.vacationHours,
        gross_pay: data.grossPay,

        // Deductions
        federal_tax: data.federalTax,
        state_tax: data.stateTax,
        social_security: data.socialSecurity,
        medicare: data.medicare,
        state_disability: data.stateDisability,
        health_insurance: data.healthInsurance,
        dental_insurance: data.dentalInsurance,
        vision_insurance: data.visionInsurance,
        life_insurance: data.lifeInsurance,
        retirement_401k: data.retirement401k,
        roth_ira: data.rothIRA,
        hsa: data.hsa,
        parking_fee: data.parkingFee,
        union_dues: data.unionDues,
        other_deductions: data.otherDeductions,
        total_deductions: data.totalDeductions,
        net_pay: data.netPay,

        // Year-to-Date totals
        ytd_gross_pay: data.ytdGrossPay,
        ytd_federal_tax: data.ytdFederalTax,
        ytd_state_tax: data.ytdStateTax,
        ytd_social_security: data.ytdSocialSecurity,
        ytd_medicare: data.ytdMedicare,
        ytd_overtime_pay: data.ytdOvertimePay,
        ytd_total_deductions: data.ytdTotalDeductions,
        ytd_net_pay: data.ytdNetPay,
      }

      const blob = await generatePaystubPDF(pdfData)
      const safeName = (data.employeeName || 'employee').replace(/[^a-z0-9\-_.]+/gi, '-')
      const filename = `paystub-${data.templateId}-${safeName}.pdf`

      // Download helper
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error('Download error (HTML):', e)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium bg-white hover:bg-gray-50"
    >
      <Download className="w-4 h-4" />
      {loading ? 'Generating…' : label}
    </button>
  )
}
