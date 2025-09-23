"use client"

import React, { useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import { ClassicPDF } from './pdf-templates/classic-pdf'
import { ModernPDF } from './pdf-templates/modern-pdf'
import { DetailedPDF } from './react-pdf-generator'
import { CompactPDF } from './pdf-templates/compact-pdf'

// Data shape used by this module when called programmatically from API routes or server
// (snake_case). The UI currently uses camelCase. We'll normalize in toCamelData.
export interface PaystubData {
  // Template selection
  templateId: string

  // Basic employee and employer info
  employee_name: string
  employee_address: string
  employee_ssn: string
  employee_id?: string
  employee_phone?: string
  employer_name: string
  employer_address: string
  employer_ein: string
  employer_phone?: string
  employer_logo?: string

  // Theme
  theme_color?: string

  // Pay period details
  pay_period_start: string
  pay_period_end: string
  pay_date: string
  pay_frequency: string
  tax_state?: string

  // Earnings
  pay_type: "hourly" | "salary"
  hourly_rate?: number
  hours_worked?: number
  overtime_hours?: number
  overtime_rate?: number
  salary?: number
  bonus?: number
  commission?: number
  holiday_hours?: number
  sick_hours?: number
  vacation_hours?: number
  gross_pay: number

  // Deductions
  federal_tax: number
  state_tax: number
  social_security: number
  medicare: number
  state_disability?: number
  health_insurance: number
  dental_insurance: number
  vision_insurance?: number
  life_insurance?: number
  retirement_401k: number
  roth_ira?: number
  hsa?: number
  parking_fee?: number
  union_dues?: number
  other_deductions: number
  total_deductions: number
  net_pay: number

  // Year-to-Date totals
  ytd_gross_pay?: number
  ytd_federal_tax?: number
  ytd_state_tax?: number
  ytd_social_security?: number
  ytd_medicare?: number
  ytd_overtime_pay?: number
  ytd_total_deductions?: number
  ytd_net_pay?: number
}

// Normalize incoming data from either camelCase (UI) or snake_case (backend) into
// the camelCase shape expected by the PDF templates.
function toCamelData(d: any) {
  const cam: any = {
    templateId: d?.templateId || 'template1',

    // Company
    companyName: d?.companyName ?? d?.employer_name ?? 'Company Name',
    companyAddress: d?.companyAddress ?? d?.employer_address ?? '',
    companyCity: d?.companyCity ?? '',
    companyState: d?.companyState ?? '',
    companyZip: d?.companyZip ?? '',
    companyPhone: d?.companyPhone ?? d?.employer_phone ?? '',
    companyEIN: d?.companyEIN ?? d?.employer_ein ?? '',
    companyLogo: d?.companyLogo ?? d?.employer_logo ?? '',

    // Employee
    employeeName: d?.employeeName ?? d?.employee_name ?? 'Employee Name',
    employeeAddress: d?.employeeAddress ?? d?.employee_address ?? '',
    employeeCity: d?.employeeCity ?? '',
    employeeState: d?.employeeState ?? '',
    employeeZip: d?.employeeZip ?? '',
    employeeSSN: d?.employeeSSN ?? d?.employee_ssn ?? '',
    employeeId: d?.employeeId ?? d?.employee_id ?? '',
    employeePhone: d?.employeePhone ?? d?.employee_phone ?? '',

    // Period
    payDate: d?.payDate ?? d?.pay_date ?? '',
    payPeriodStart: d?.payPeriodStart ?? d?.pay_period_start ?? '',
    payPeriodEnd: d?.payPeriodEnd ?? d?.pay_period_end ?? '',
    payFrequency: d?.payFrequency ?? d?.pay_frequency ?? 'Bi-Weekly',
    taxState: d?.taxState ?? d?.tax_state ?? '',

    // Earnings
    payType: d?.payType ?? d?.pay_type ?? 'hourly',
    hourlyRate: d?.hourlyRate ?? d?.hourly_rate ?? 0,
    hoursWorked: d?.hoursWorked ?? d?.hours_worked ?? 0,
    overtimeHours: d?.overtimeHours ?? d?.overtime_hours ?? 0,
    overtimeRate: d?.overtimeRate ?? d?.overtime_rate ?? 0,
    salary: d?.salary ?? d?.salary ?? 0,
    bonusAmount: d?.bonusAmount ?? d?.bonus ?? 0,
    commissionAmount: d?.commissionAmount ?? d?.commission ?? 0,
    holidayHours: d?.holidayHours ?? d?.holiday_hours ?? 0,
    sickHours: d?.sickHours ?? d?.sick_hours ?? 0,
    vacationHours: d?.vacationHours ?? d?.vacation_hours ?? 0,

    // Deductions
    federalTax: d?.federalTax ?? d?.federal_tax ?? 0,
    stateTax: d?.stateTax ?? d?.state_tax ?? 0,
    socialSecurity: d?.socialSecurity ?? d?.social_security ?? 0,
    medicare: d?.medicare ?? d?.medicare ?? 0,
    stateDisability: d?.stateDisability ?? d?.state_disability ?? 0,
    healthInsurance: d?.healthInsurance ?? d?.health_insurance ?? 0,
    dentalInsurance: d?.dentalInsurance ?? d?.dental_insurance ?? 0,
    visionInsurance: d?.visionInsurance ?? d?.vision_insurance ?? 0,
    lifeInsurance: d?.lifeInsurance ?? d?.life_insurance ?? 0,
    retirement401k: d?.retirement401k ?? d?.retirement_401k ?? 0,
    rothIRA: d?.rothIRA ?? d?.roth_ira ?? 0,
    hsa: d?.hsa ?? d?.hsa ?? 0,
    parkingFee: d?.parkingFee ?? d?.parking_fee ?? 0,
    unionDues: d?.unionDues ?? d?.union_dues ?? 0,
    otherDeductions: d?.otherDeductions ?? d?.other_deductions ?? 0,

    // Totals
    grossPay: d?.grossPay ?? d?.gross_pay ?? 0,
    totalDeductions: d?.totalDeductions ?? d?.total_deductions ?? 0,
    netPay: d?.netPay ?? d?.net_pay ?? 0,

    // YTD
    ytdGrossPay: d?.ytdGrossPay ?? d?.ytd_gross_pay ?? 0,
    ytdFederalTax: d?.ytdFederalTax ?? d?.ytd_federal_tax ?? 0,
    ytdStateTax: d?.ytdStateTax ?? d?.ytd_state_tax ?? 0,
    ytdSocialSecurity: d?.ytdSocialSecurity ?? d?.ytd_social_security ?? 0,
    ytdMedicare: d?.ytdMedicare ?? d?.ytd_medicare ?? 0,
    ytdOvertimePay: d?.ytdOvertimePay ?? d?.ytd_overtime_pay ?? 0,
    ytdTotalDeductions: d?.ytdTotalDeductions ?? d?.ytd_total_deductions ?? 0,
    ytdNetPay: d?.ytdNetPay ?? d?.ytd_net_pay ?? 0,

    // Theme
    themeColor: d?.themeColor ?? d?.theme_color ?? '#239BA0',
  }

  return cam
}

export function generatePaystubPDFReact(data: any): React.ReactElement {
  const cam = toCamelData(data)
  const templateIdRaw = String(cam?.templateId || 'template1')
  const templateId = templateIdRaw.toLowerCase().replace(/\s+/g, '')

  // Route to the appropriate PDF template (robust matching)
  if (templateId === 'template2' || templateId === '2' || templateId.includes('modern')) {
    return <ModernPDF data={cam} />
  } else if (templateId === 'template3' || templateId === '3' || templateId.includes('detailed')) {
    return <DetailedPDF data={cam} />
  } else if (templateId === 'template4' || templateId === '4' || templateId.includes('compact')) {
    return <CompactPDF data={cam} />
  } else {
    return <ClassicPDF data={cam} />
  }
}

// Download component for React-PDF
export function PaystubPDFDownload({ data, fileName = "paystub.pdf", className = "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors" }: { data: any, fileName?: string, className?: string }) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    try {
      setLoading(true)
      const cam = toCamelData(data)
      const templateId = String(cam?.templateId || 'template1').toLowerCase().replace(/\s+/g, '')
      const safeName = (cam?.employeeName || 'paystub').replace(/[^a-z0-9\-_.]+/gi, '-')
      const finalFileName = fileName === 'paystub.pdf' ? `paystub-${templateId}-${safeName}.pdf` : fileName
      console.log('[PDF] Generating template:', templateId, 'employee:', cam?.employeeName)
      const doc = generatePaystubPDFReact(cam)
      const blob = await pdf(doc as any).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = finalFileName
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error('PDF generation failed:', e)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleClick} className={className} disabled={loading} type="button">
      {loading ? 'Generating PDF...' : 'Download PDF'}
    </button>
  )
}

// Main function to generate PDF blob (for direct use)
export async function generatePaystubPDFBlob(data: PaystubData): Promise<Blob> {
  // For now, we'll use PDFDownloadLink which returns a promise
  // In a real implementation, you might want to use a different approach
  // or use a library like jsPDF as fallback

  return new Promise((resolve, reject) => {
    // This is a simplified approach - in production you might want to
    // use a different PDF generation method or server-side rendering
    reject(new Error('PDF generation requires React-PDF component rendering'))
  })
}
