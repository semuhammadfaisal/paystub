"use client"

import type { PaystubData as GeneratorPaystubData } from "@/components/paystub-generator"

interface TemplateProps {
  data: GeneratorPaystubData
}

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })
const formatCurrency = (n: number) => fmt.format(n || 0)
const formatDate = (ds: string) => (ds ? new Date(ds).toLocaleDateString("en-US") : "")
const maskSSN = (ssn: string) => (!ssn ? "" : `XXX-XX-${ssn.slice(-4)}`)

export function ModernPreview({ data }: TemplateProps) {
  const accent = data.themeColor || "#374151" // slate
  return (
    <div className="bg-white border rounded-xl p-6 text-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {data.companyLogo && (
            <img src={data.companyLogo} alt="Company Logo" className="h-14 w-14 object-contain border rounded" />
          )}
          <div>
            <div className="text-xl font-bold" style={{ color: accent }}>EARNINGS STATEMENT</div>
            <div className="text-xs text-gray-600">{data.companyName || "Company Name"}</div>
          </div>
        </div>
        <div className="text-right text-xs">
          <div><span className="font-semibold">Pay Date:</span> {formatDate(data.payDate)}</div>
          <div><span className="font-semibold">Period:</span> {formatDate(data.payPeriodStart)} - {formatDate(data.payPeriodEnd)}</div>
        </div>
      </div>

      {/* Two column panels */}
      <div className="grid grid-cols-2 gap-6 mb-4">
        <div className="rounded-lg border">
          <div className="px-3 py-2 text-xs font-semibold" style={{ backgroundColor: accent, color: '#fff' }}>Employee</div>
          <div className="p-3 space-y-1">
            <div className="font-medium">{data.employeeName || "Employee Name"}</div>
            <div className="text-xs text-gray-600">{data.employeeAddress || "Employee Address"}</div>
            <div className="text-xs text-gray-600">SSN: {maskSSN(data.employeeSSN)}</div>
          </div>
        </div>
        <div className="rounded-lg border">
          <div className="px-3 py-2 text-xs font-semibold" style={{ backgroundColor: accent, color: '#fff' }}>Pay Details</div>
          <div className="p-3 grid grid-cols-2 gap-2 text-xs">
            <div className="text-gray-600">Frequency</div><div className="font-medium">{data.payFrequency || 'Bi-Weekly'}</div>
            <div className="text-gray-600">Type</div><div className="font-medium">{data.payType === 'hourly' ? 'Hourly' : 'Salary'}</div>
            <div className="text-gray-600">Exemptions</div><div className="font-medium">{data.exemptions || 0}</div>
          </div>
        </div>
      </div>

      {/* Earnings and Deductions */}
      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-lg border">
          <div className="px-3 py-2 text-xs font-semibold" style={{ backgroundColor: accent, color: '#fff' }}>Income</div>
          <div className="p-3 text-xs space-y-2">
            {data.payType === 'hourly' ? (
              <>
                <div className="flex justify-between"><span>Regular ({data.hoursWorked} hrs)</span><span>{formatCurrency((data.hourlyRate||0)*(data.hoursWorked||0))}</span></div>
                {data.overtimeHours > 0 && (
                  <div className="flex justify-between"><span>Overtime ({data.overtimeHours} hrs)</span><span>{formatCurrency((data.overtimeHours||0)*(data.overtimeRate||data.hourlyRate*1.5||0))}</span></div>
                )}
              </>
            ) : (
              <div className="flex justify-between"><span>Salary</span><span>{formatCurrency(data.salary)}</span></div>
            )}
            {data.bonusAmount > 0 && (<div className="flex justify-between"><span>Bonus</span><span>{formatCurrency(data.bonusAmount)}</span></div>)}
            {data.commissionAmount > 0 && (<div className="flex justify-between"><span>Commission</span><span>{formatCurrency(data.commissionAmount)}</span></div>)}
            <div className="flex justify-between border-t pt-2 font-semibold"><span>Gross Pay</span><span>{formatCurrency(data.grossPay)}</span></div>
          </div>
        </div>
        <div className="rounded-lg border">
          <div className="px-3 py-2 text-xs font-semibold" style={{ backgroundColor: accent, color: '#fff' }}>Deductions</div>
          <div className="p-3 text-xs space-y-2">
            {data.federalTax > 0 && (<div className="flex justify-between"><span>Federal Tax</span><span>{formatCurrency(data.federalTax)}</span></div>)}
            {data.stateTax > 0 && (<div className="flex justify-between"><span>State Tax</span><span>{formatCurrency(data.stateTax)}</span></div>)}
            {data.socialSecurity > 0 && (<div className="flex justify-between"><span>Social Security</span><span>{formatCurrency(data.socialSecurity)}</span></div>)}
            {data.medicare > 0 && (<div className="flex justify-between"><span>Medicare</span><span>{formatCurrency(data.medicare)}</span></div>)}
            <div className="flex justify-between border-t pt-2 font-semibold"><span>Total</span><span>{formatCurrency(data.totalDeductions)}</span></div>
          </div>
        </div>
      </div>

      {/* Net pay */}
      <div className="mt-4 rounded-lg" style={{ backgroundColor: accent, color: '#fff' }}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-sm font-semibold">NET PAY</div>
          <div className="text-lg font-bold">{formatCurrency(data.netPay)}</div>
        </div>
      </div>
    </div>
  )
}
