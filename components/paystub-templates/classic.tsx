"use client"

import type { PaystubData as GeneratorPaystubData } from "@/components/paystub-generator"
import { DownloadHtmlFileButton } from "@/components/download-html-file-button"

interface TemplateProps {
  data: GeneratorPaystubData
}

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })
const formatCurrency = (n: number) => fmt.format(n || 0)
const formatDate = (ds: string) => (ds ? new Date(ds).toLocaleDateString("en-US") : "")
const maskSSN = (ssn: string) => (!ssn ? "" : `XXX-XX-${ssn.slice(-4)}`)

export function ClassicPreview({ data }: TemplateProps) {
  const accent = data.themeColor || "#239BA0"
  return (
    <>
    <div id="paystub-capture-target" className="bg-white border-2 border-gray-300 p-6 text-sm font-mono">
      <div className="border-b-2 border-gray-800 pb-4 mb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-4">
            {data.companyLogo && (
              <img src={data.companyLogo} alt="Company Logo" className="h-16 w-auto object-contain border border-gray-200 rounded" />
            )}
            <div>
              <h1 className="text-lg font-bold" style={{ color: accent }}>PAYROLL STATEMENT</h1>
              <div className="mt-2">
                <div className="font-bold">{data.companyName || "Company Name"}</div>
                <div>{data.companyAddress || "Company Address"}</div>
                <div>
                  {data.companyCity || "City"}, {data.companyState || "ST"} {data.companyZip || "ZIP"}
                </div>
                {data.companyPhone && <div>Phone: {data.companyPhone}</div>}
                <div>EIN: {data.companyEIN || "XX-XXXXXXX"}</div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="px-3 py-1 rounded font-bold" style={{ backgroundColor: accent, color: "#ffffff" }}>Paystub</div>
            <div className="mt-2 text-xs">
              <div>Pay Date: {formatDate(data.payDate)}</div>
              <div>Pay Period: {formatDate(data.payPeriodStart)} - {formatDate(data.payPeriodEnd)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="font-bold mb-2" style={{ color: accent }}>EMPLOYEE INFORMATION</h3>
          <div>{data.employeeName || "Employee Name"}</div>
          <div>{data.employeeAddress || "Employee Address"}</div>
          <div>{data.employeeCity || "City"}, {data.employeeState || "ST"} {data.employeeZip || "ZIP"}</div>
          <div>SSN: {maskSSN(data.employeeSSN)}</div>
          {data.employeeId && <div>Employee ID: {data.employeeId}</div>}
          {data.employeePhone && <div>Phone: {data.employeePhone}</div>}
        </div>
        <div>
          <h3 className="font-bold mb-2" style={{ color: accent }}>PAY INFORMATION</h3>
          <div>Pay Frequency: {data.payFrequency || "Bi-Weekly"}</div>
          <div>Pay Type: {data.payType === "hourly" ? "Hourly" : "Salary"}</div>
          {data.payType === "hourly" && (
            <>
              <div>Hourly Rate: {formatCurrency(data.hourlyRate)}</div>
              <div>Hours Worked: {data.hoursWorked}</div>
              {data.overtimeHours > 0 && (
                <div>Overtime Hours: {data.overtimeHours} @ {formatCurrency(data.overtimeRate)}</div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="font-bold mb-2 border-b border-gray-400" style={{ color: accent }}>EARNINGS</h3>
          <div className="space-y-1">
            {data.payType === "hourly" ? (
              <>
                <div className="flex justify-between"><span>Regular Pay ({data.hoursWorked} hrs)</span><span>{formatCurrency((data.hourlyRate||0)*(data.hoursWorked||0))}</span></div>
                {data.overtimeHours > 0 && (
                  <div className="flex justify-between"><span>Overtime Pay ({data.overtimeHours} hrs)</span><span>{formatCurrency((data.overtimeHours||0)*(data.overtimeRate||data.hourlyRate*1.5||0))}</span></div>
                )}
              </>
            ) : (
              <div className="flex justify-between"><span>Salary</span><span>{formatCurrency(data.salary)}</span></div>
            )}
            {data.bonusAmount > 0 && (<div className="flex justify-between"><span>Bonus</span><span>{formatCurrency(data.bonusAmount)}</span></div>)}
            {data.commissionAmount > 0 && (<div className="flex justify-between"><span>Commission</span><span>{formatCurrency(data.commissionAmount)}</span></div>)}
            <div className="flex justify-between font-bold border-t border-gray-400 pt-1"><span>GROSS PAY</span><span>{formatCurrency(data.grossPay)}</span></div>
          </div>
        </div>
        <div>
          <h3 className="font-bold mb-2 border-b border-gray-400" style={{ color: accent }}>DEDUCTIONS</h3>
          <div className="space-y-1">
            <div className="flex justify-between"><span>Federal Tax</span><span>{formatCurrency(data.federalTax || 0)}</span></div>
            <div className="flex justify-between"><span>State Tax</span><span>{formatCurrency(data.stateTax || 0)}</span></div>
            <div className="flex justify-between"><span>Social Security</span><span>{formatCurrency(data.socialSecurity || 0)}</span></div>
            <div className="flex justify-between"><span>Medicare</span><span>{formatCurrency(data.medicare || 0)}</span></div>
            <div className="flex justify-between"><span>{((data.taxState || '').toUpperCase() === 'HI') ? 'TDI' : 'State Disability'}</span><span>{formatCurrency(data.stateDisability || 0)}</span></div>
            <div className="flex justify-between font-bold border-t border-gray-400 pt-1"><span>TOTAL DEDUCTIONS</span><span>{formatCurrency(data.totalDeductions)}</span></div>
          </div>
        </div>
      </div>

      <div className="border-t-2 border-gray-800 pt-4">
        <div className="flex justify-between items-center p-3 rounded" style={{ backgroundColor: accent, color: "#ffffff" }}>
          <span className="text-lg font-bold">NET PAY</span>
          <span className="text-xl font-bold">{formatCurrency(data.netPay)}</span>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-600 text-center">
        <p>This is a computer-generated payroll statement and does not require a signature.</p>
        <p>Please retain this statement for your records.</p>
      </div>
    </div>
    <div className="mt-4 flex justify-end">
      <DownloadHtmlFileButton data={data} label="Download HTML" />
    </div>
    </>
  )
}
