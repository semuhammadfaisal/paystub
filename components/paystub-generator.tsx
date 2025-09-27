"use client"

import { useState } from "react"
import { PaystubForm } from "@/components/paystub-form-new"
import { PaystubPreview } from "@/components/paystub-preview"
import { LogoUpload } from "@/components/logo-upload"
import { StepHeader } from "@/components/step-header"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DownloadHtmlFileButton } from "@/components/download-html-file-button"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

export interface PaystubData {
  // Template Selection
  templateId: string
  // Theme Selection
  themeId?: string
  themeColor?: string

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
  ytdOvertimePay: number
  ytdTotalDeductions: number
  ytdNetPay: number

  // Calculated fields
  grossPay: number
  totalDeductions: number
  netPay: number
}

interface PaystubGeneratorProps {
  user: any
  initialTemplateId?: string
}

const initialData: PaystubData = {
  templateId: "template1",
  themeId: "blue",
  themeColor: "#60a5fa",
  coNumber: "",
  fileNumber: "",
  deptNumber: "",
  clockNumber: "",
  vchrNumber: "",
  paymentType: "",
  employmentType: "",
  email: "",
  numberOfPaystubs: 26,
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
  ytdOvertimePay: 0,
  ytdTotalDeductions: 0,
  ytdNetPay: 0,
  grossPay: 0,
  totalDeductions: 0,
  netPay: 0,
}

export function PaystubGenerator({ user: _user, initialTemplateId }: PaystubGeneratorProps) {
  const [paystubData, setPaystubData] = useState<PaystubData>(() => ({
    ...initialData,
    templateId: initialTemplateId || initialData.templateId,
  }))

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

      // Calculate gross pay only if it wasn't explicitly provided by the form logic
      if (typeof updates.grossPay === 'undefined') {
        if (updated.payType === "hourly") {
          const regularPay = (updated.hourlyRate || 0) * (updated.hoursWorked || 0)
          const overtimePay = (updated.overtimeRate || 0) * (updated.overtimeHours || 0)
          const holidayPay = (updated.holidayHours || 0) * (updated.hourlyRate || 0)
          const sickPay = (updated.sickHours || 0) * (updated.hourlyRate || 0)
          const vacationPay = (updated.vacationHours || 0) * (updated.hourlyRate || 0)
          updated.grossPay =
            regularPay + overtimePay + holidayPay + sickPay + vacationPay + (updated.bonusAmount || 0) + (updated.commissionAmount || 0)
        } else {
          // Salary-based per-period gross pay: divide annual salary by MAX periods for the selected frequency
          const getMaxPaystubs = (frequency: string | undefined): number => {
            switch ((frequency || 'bi-weekly').toLowerCase()) {
              case 'daily': return 52
              case 'weekly': return 52
              case 'bi-weekly': return 26
              case 'semi-monthly': return 24
              case 'monthly': return 12
              case 'quarterly': return 4
              case 'semi-annually': return 2
              case 'annually': return 1
              default: return 26
            }
          }
          const periods = getMaxPaystubs(updated.payFrequency)
          const perPeriodSalary = (updated.salary || 0) / (periods || 1)
          updated.grossPay = perPeriodSalary + (updated.bonusAmount || 0) + (updated.commissionAmount || 0)
        }
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

  

  return (
    <div className="space-y-6">
      <div className="space-y-8">
        {/* Template selection dropdown - moved to top */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="text-center sm:text-left mb-3 font-medium">Select template</div>
          <div className="flex justify-center sm:justify-start">
            <div className="w-56">
              <Select
                value={paystubData.templateId}
                onValueChange={(v) => updatePaystubData({ templateId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Template #1" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="template1">Template #1</SelectItem>
                  <SelectItem value="template2">Template #2</SelectItem>
                  <SelectItem value="template3">Template #3</SelectItem>
                  <SelectItem value="template4">Template #4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Theme color options - moved near template selector */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="text-center mb-3 font-medium">Color options</div>
          <div className="flex items-center justify-center gap-3">
            {([
              { id: 'blue', color: '#60a5fa' },
              { id: 'green', color: '#10b981' },
              { id: 'gray', color: '#9ca3af' },
              { id: 'purple', color: '#8b5cf6' },
              { id: 'orange', color: '#f59e0b' },
              { id: 'red', color: '#ef4444' },
            ] as const).map((t) => (
              <button
                key={t.id}
                type="button"
                aria-label={`Theme ${t.id}`}
                onClick={() => updatePaystubData({ themeId: t.id, themeColor: t.color })}
                className="w-8 h-8 rounded shadow border-2"
                style={{ backgroundColor: t.color, borderColor: paystubData.themeId === t.id ? t.color : '#e5e7eb' }}
                title={t.id}
              />
            ))}
          </div>
        </div>

        <div className="bg-white">
          <PaystubPreview data={paystubData} />
        </div>
        {/* Simple, centered CTA below preview (moved from header) */}
        <div className="flex justify-center mt-4">
          <a
            href={`https://wa.me/12067045757?text=${encodeURIComponent("Hi! I'm interested in personalized and customized paystub templates. Can you help me?")}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="bg-white hover:bg-gray-50 text-black">
              <MessageCircle className="h-4 w-4 mr-2" />
              Customized templates
            </Button>
          </a>
        </div>

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

        {/* Color options moved to top */}

        {/* Template selection and preview moved to top */}
      </div>

      <div className="flex justify-center">
        <DownloadHtmlFileButton data={paystubData} label="Checkout" />
      </div>
    </div>
  )
}
