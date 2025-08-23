"use client"

import type { PaystubData } from "@/components/paystub-generator"

interface PaystubPreviewProps {
  data: PaystubData
}

export function PaystubPreview({ data }: PaystubPreviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("en-US")
  }

  const maskSSN = (ssn: string) => {
    if (!ssn) return ""
    return `XXX-XX-${ssn.slice(-4)}`
  }

  return (
    <div className="bg-white border-2 border-gray-300 p-6 text-sm font-mono">
      {/* Header */}
      <div className="border-b-2 border-gray-800 pb-4 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-lg font-bold text-primary">PAYROLL STATEMENT</h1>
            <div className="mt-2">
              <div className="font-bold">{data.companyName || "Company Name"}</div>
              <div>{data.companyAddress || "Company Address"}</div>
              <div>
                {data.companyCity || "City"}, {data.companyState || "ST"} {data.companyZip || "ZIP"}
              </div>
              <div>EIN: {data.companyEIN || "XX-XXXXXXX"}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded font-bold">PAY STUB</div>
            <div className="mt-2 text-xs">
              <div>Pay Date: {formatDate(data.payDate)}</div>
              <div>
                Pay Period: {formatDate(data.payPeriodStart)} - {formatDate(data.payPeriodEnd)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Information */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="font-bold text-primary mb-2">EMPLOYEE INFORMATION</h3>
          <div>{data.employeeName || "Employee Name"}</div>
          <div>{data.employeeAddress || "Employee Address"}</div>
          <div>
            {data.employeeCity || "City"}, {data.employeeState || "ST"} {data.employeeZip || "ZIP"}
          </div>
          <div>SSN: {maskSSN(data.employeeSSN)}</div>
        </div>
        <div>
          <h3 className="font-bold text-primary mb-2">PAY INFORMATION</h3>
          <div>Pay Frequency: {data.payFrequency || "Bi-Weekly"}</div>
          <div>Pay Type: {data.payType === "hourly" ? "Hourly" : "Salary"}</div>
          {data.payType === "hourly" && (
            <>
              <div>Hourly Rate: {formatCurrency(data.hourlyRate)}</div>
              <div>Hours Worked: {data.hoursWorked}</div>
              {data.overtimeHours > 0 && (
                <div>
                  Overtime Hours: {data.overtimeHours} @ {formatCurrency(data.overtimeRate)}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Earnings and Deductions */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="font-bold text-primary mb-2 border-b border-gray-400">EARNINGS</h3>
          <div className="space-y-1">
            {data.payType === "hourly" ? (
              <>
                <div className="flex justify-between">
                  <span>Regular Pay ({data.hoursWorked} hrs)</span>
                  <span>{formatCurrency(data.hourlyRate * data.hoursWorked)}</span>
                </div>
                {data.overtimeHours > 0 && (
                  <div className="flex justify-between">
                    <span>Overtime Pay ({data.overtimeHours} hrs)</span>
                    <span>{formatCurrency(data.overtimeHours * (data.overtimeRate || data.hourlyRate * 1.5))}</span>
                  </div>
                )}
              </>
            ) : (
              <div className="flex justify-between">
                <span>Salary</span>
                <span>{formatCurrency(data.salary)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold border-t border-gray-400 pt-1">
              <span>GROSS PAY</span>
              <span>{formatCurrency(data.grossPay)}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-primary mb-2 border-b border-gray-400">DEDUCTIONS</h3>
          <div className="space-y-1">
            {data.federalTax > 0 && (
              <div className="flex justify-between">
                <span>Federal Tax</span>
                <span>{formatCurrency(data.federalTax)}</span>
              </div>
            )}
            {data.stateTax > 0 && (
              <div className="flex justify-between">
                <span>State Tax</span>
                <span>{formatCurrency(data.stateTax)}</span>
              </div>
            )}
            {data.socialSecurity > 0 && (
              <div className="flex justify-between">
                <span>Social Security</span>
                <span>{formatCurrency(data.socialSecurity)}</span>
              </div>
            )}
            {data.medicare > 0 && (
              <div className="flex justify-between">
                <span>Medicare</span>
                <span>{formatCurrency(data.medicare)}</span>
              </div>
            )}
            {data.healthInsurance > 0 && (
              <div className="flex justify-between">
                <span>Health Insurance</span>
                <span>{formatCurrency(data.healthInsurance)}</span>
              </div>
            )}
            {data.retirement401k > 0 && (
              <div className="flex justify-between">
                <span>401(k)</span>
                <span>{formatCurrency(data.retirement401k)}</span>
              </div>
            )}
            {data.otherDeductions > 0 && (
              <div className="flex justify-between">
                <span>Other</span>
                <span>{formatCurrency(data.otherDeductions)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold border-t border-gray-400 pt-1">
              <span>TOTAL DEDUCTIONS</span>
              <span>{formatCurrency(data.totalDeductions)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Net Pay */}
      <div className="border-t-2 border-gray-800 pt-4">
        <div className="flex justify-between items-center bg-primary text-primary-foreground p-3 rounded">
          <span className="text-lg font-bold">NET PAY</span>
          <span className="text-xl font-bold">{formatCurrency(data.netPay)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 text-xs text-gray-600 text-center">
        <p>This is a computer-generated payroll statement and does not require a signature.</p>
        <p>Please retain this statement for your records.</p>
      </div>
    </div>
  )
}
