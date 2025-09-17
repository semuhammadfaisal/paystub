"use client"

import type { PaystubData as GeneratorPaystubData } from "@/components/paystub-generator"

interface TemplateProps {
  data: GeneratorPaystubData
}

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })
const formatCurrency = (n: number) => fmt.format(n || 0)
const formatDate = (ds: string) => (ds ? new Date(ds).toLocaleDateString("en-US") : "")

export function CompactPreview({ data }: TemplateProps) {
  const accent = data.themeColor || "#2563eb" // blue
  return (
    <div className="bg-white border rounded p-4 text-xs">
      {/* Header minimal */}
      <div className="flex justify-between mb-2">
        <div className="font-semibold" style={{ color: accent }}>PAYSTUB</div>
        <div className="text-[11px] text-gray-700">{formatDate(data.payDate)}</div>
      </div>

      {/* Company / Employee single row */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <div className="text-[11px] text-gray-600">COMPANY</div>
          <div className="font-medium">{data.companyName || 'Company Name'}</div>
          <div className="text-[11px] text-gray-600">{data.companyAddress || 'Company Address'}</div>
        </div>
        <div>
          <div className="text-[11px] text-gray-600">EMPLOYEE</div>
          <div className="font-medium">{data.employeeName || 'Employee Name'}</div>
          <div className="text-[11px] text-gray-600">{data.employeeAddress || 'Employee Address'}</div>
        </div>
      </div>

      {/* Earnings and Deductions condensed */}
      <div className="grid grid-cols-2 gap-3">
        <div className="border rounded">
          <div className="px-2 py-1 font-semibold text-white" style={{ backgroundColor: accent }}>EARNINGS</div>
          <div className="p-2 space-y-1">
            {data.payType === 'hourly' ? (
              <>
                <div className="flex justify-between"><span>Regular</span><span>{formatCurrency((data.hourlyRate||0)*(data.hoursWorked||0))}</span></div>
                {data.overtimeHours > 0 && (<div className="flex justify-between"><span>Overtime</span><span>{formatCurrency((data.overtimeRate||data.hourlyRate*1.5||0)*(data.overtimeHours||0))}</span></div>)}
              </>
            ) : (
              <div className="flex justify-between"><span>Salary</span><span>{formatCurrency(data.grossPay)}</span></div>
            )}
            {data.bonusAmount > 0 && (<div className="flex justify-between"><span>Bonus</span><span>{formatCurrency(data.bonusAmount)}</span></div>)}
            <div className="flex justify-between border-t pt-1 font-semibold"><span>Gross</span><span>{formatCurrency(data.grossPay)}</span></div>
          </div>
        </div>
        <div className="border rounded">
          <div className="px-2 py-1 font-semibold text-white" style={{ backgroundColor: accent }}>DEDUCTIONS</div>
          <div className="p-2 space-y-1">
            {data.federalTax > 0 && (<div className="flex justify-between"><span>Federal</span><span>{formatCurrency(data.federalTax)}</span></div>)}
            {data.stateTax > 0 && (<div className="flex justify-between"><span>State</span><span>{formatCurrency(data.stateTax)}</span></div>)}
            {data.socialSecurity > 0 && (<div className="flex justify-between"><span>SS</span><span>{formatCurrency(data.socialSecurity)}</span></div>)}
            {data.medicare > 0 && (<div className="flex justify-between"><span>Medicare</span><span>{formatCurrency(data.medicare)}</span></div>)}
            {data.stateDisability > 0 && (<div className="flex justify-between"><span>State Disability</span><span>{formatCurrency(data.stateDisability)}</span></div>)}
            <div className="flex justify-between border-t pt-1 font-semibold"><span>Total</span><span>{formatCurrency(data.totalDeductions)}</span></div>
          </div>
        </div>
      </div>

      {/* Net bar */}
      <div className="mt-3 rounded text-white px-3 py-2 flex justify-between" style={{ backgroundColor: accent }}>
        <span className="font-semibold">NET PAY</span>
        <span className="font-bold text-sm">{formatCurrency(data.netPay)}</span>
      </div>
    </div>
  )
}
