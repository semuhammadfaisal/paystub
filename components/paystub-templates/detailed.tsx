"use client"

import type { PaystubData as GeneratorPaystubData } from "@/components/paystub-generator"

interface TemplateProps {
  data: GeneratorPaystubData
}

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })
const formatCurrency = (n: number) => fmt.format(n || 0)
const formatDate = (ds: string) => (ds ? new Date(ds).toLocaleDateString("en-US") : "")
const maskSSN = (ssn: string) => (!ssn ? "" : `XXX-XX-${ssn.slice(-4)}`)

export function DetailedPreview({ data }: TemplateProps) {
  const accent = data.themeColor || "#4f46e5" // indigo
  return (
    <div className="bg-white border p-5 text-[13px]">
      {/* Header banner */}
      <div className="rounded-md mb-4" style={{ backgroundColor: accent, color: '#fff' }}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="font-bold text-base">EARNINGS STATEMENT</div>
          <div className="text-xs">Pay Date: {formatDate(data.payDate)} • Period: {formatDate(data.payPeriodStart)} - {formatDate(data.payPeriodEnd)}</div>
        </div>
      </div>

      {/* Employee + Employer block */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="border rounded p-3">
          <div className="text-xs font-semibold text-gray-600">EMPLOYER</div>
          <div className="text-sm font-medium">{data.companyName || 'Company Name'}</div>
          <div className="text-xs text-gray-600">{data.companyAddress || 'Company Address'}</div>
          <div className="text-xs text-gray-600">EIN: {data.companyEIN || 'XX-XXXXXXX'}</div>
        </div>
        <div className="border rounded p-3">
          <div className="text-xs font-semibold text-gray-600">EMPLOYEE</div>
          <div className="text-sm font-medium">{data.employeeName || 'Employee Name'}</div>
          <div className="text-xs text-gray-600">{data.employeeAddress || 'Employee Address'}</div>
          <div className="text-xs text-gray-600">SSN: {maskSSN(data.employeeSSN)}</div>
        </div>
        <div className="border rounded p-3">
          <div className="text-xs font-semibold text-gray-600">PAY INFO</div>
          <div className="text-xs grid grid-cols-2 gap-x-2 gap-y-1">
            <div className="text-gray-600">Frequency</div><div className="font-medium">{data.payFrequency || 'Bi-Weekly'}</div>
            <div className="text-gray-600">Type</div><div className="font-medium">{data.payType === 'hourly' ? 'Hourly' : 'Salary'}</div>
            <div className="text-gray-600">Exemptions</div><div className="font-medium">{data.exemptions || 0}</div>
          </div>
        </div>
      </div>

      {/* Two column detail tables */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded overflow-hidden">
          <div className="px-3 py-2 text-xs font-semibold" style={{ backgroundColor: accent, color: '#fff' }}>INCOME BREAKDOWN</div>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="text-left p-2">Description</th>
                <th className="text-right p-2">Rate</th>
                <th className="text-right p-2">Hours</th>
                <th className="text-right p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.payType === 'hourly' ? (
                <>
                  <tr>
                    <td className="p-2">Regular</td>
                    <td className="p-2 text-right">{formatCurrency(data.hourlyRate)}</td>
                    <td className="p-2 text-right">{data.hoursWorked || 0}</td>
                    <td className="p-2 text-right">{formatCurrency((data.hourlyRate||0)*(data.hoursWorked||0))}</td>
                  </tr>
                  {data.overtimeHours > 0 && (
                    <tr>
                      <td className="p-2">Overtime</td>
                      <td className="p-2 text-right">{formatCurrency(data.overtimeRate || data.hourlyRate * 1.5)}</td>
                      <td className="p-2 text-right">{data.overtimeHours || 0}</td>
                      <td className="p-2 text-right">{formatCurrency((data.overtimeRate||data.hourlyRate*1.5||0)*(data.overtimeHours||0))}</td>
                    </tr>
                  )}
                </>
              ) : (
                <tr>
                  <td className="p-2">Salary</td>
                  <td className="p-2 text-right">—</td>
                  <td className="p-2 text-right">—</td>
                  <td className="p-2 text-right">{formatCurrency(data.grossPay)}</td>
                </tr>
              )}
              {data.bonusAmount > 0 && (
                <tr>
                  <td className="p-2">Bonus</td>
                  <td className="p-2 text-right">—</td>
                  <td className="p-2 text-right">—</td>
                  <td className="p-2 text-right">{formatCurrency(data.bonusAmount)}</td>
                </tr>
              )}
              {data.commissionAmount > 0 && (
                <tr>
                  <td className="p-2">Commission</td>
                  <td className="p-2 text-right">—</td>
                  <td className="p-2 text-right">—</td>
                  <td className="p-2 text-right">{formatCurrency(data.commissionAmount)}</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-semibold">
                <td className="p-2" colSpan={3}>Gross Pay</td>
                <td className="p-2 text-right">{formatCurrency(data.grossPay)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="border rounded overflow-hidden">
          <div className="px-3 py-2 text-xs font-semibold" style={{ backgroundColor: accent, color: '#fff' }}>STATUTORY DEDUCTIONS</div>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="text-left p-2">Description</th>
                <th className="text-right p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.federalTax > 0 && (<tr><td className="p-2">Federal Tax</td><td className="p-2 text-right">{formatCurrency(data.federalTax)}</td></tr>)}
              {data.stateTax > 0 && (<tr><td className="p-2">State Tax</td><td className="p-2 text-right">{formatCurrency(data.stateTax)}</td></tr>)}
              {data.socialSecurity > 0 && (<tr><td className="p-2">FICA - Social Security</td><td className="p-2 text-right">{formatCurrency(data.socialSecurity)}</td></tr>)}
              {data.medicare > 0 && (<tr><td className="p-2">FICA - Medicare</td><td className="p-2 text-right">{formatCurrency(data.medicare)}</td></tr>)}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-semibold">
                <td className="p-2">Total Deductions</td>
                <td className="p-2 text-right">{formatCurrency(data.totalDeductions)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Footer summary */}
      <div className="mt-4 border rounded">
        <div className="grid grid-cols-4 text-xs">
          <div className="p-3 bg-gray-50 font-semibold">YTD GROSS
            <div className="mt-1 font-bold">{formatCurrency(data.ytdGrossPay)}</div>
          </div>
          <div className="p-3 bg-gray-50 font-semibold">YTD DEDUCTIONS
            <div className="mt-1 font-bold">{formatCurrency(data.ytdTotalDeductions)}</div>
          </div>
          <div className="p-3 bg-gray-50 font-semibold">YTD NET PAY
            <div className="mt-1 font-bold">{formatCurrency(data.ytdNetPay)}</div>
          </div>
          <div className="p-3" style={{ backgroundColor: accent, color: '#fff' }}>
            <div className="text-xs font-semibold">NET PAY</div>
            <div className="text-lg font-bold">{formatCurrency(data.netPay)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
