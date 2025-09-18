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
  const accent = '#000' // strong borders per layout
  const periods = data.payPeriodNumber || 1
  const withYtdFallback = (ytd?: number, per?: number) => (ytd && ytd > 0 ? ytd : (per || 0) * periods)
  const ytdMedicare = withYtdFallback(data.ytdMedicare, data.medicare)
  const ytdSS = withYtdFallback(data.ytdSocialSecurity, data.socialSecurity)
  const ytdFederal = withYtdFallback(data.ytdFederalTax, data.federalTax)
  const ytdState = withYtdFallback(data.ytdStateTax, data.stateTax)
  const ytdSDI = withYtdFallback(undefined, data.stateDisability)
  const taxesCurrent = (data.federalTax||0)+(data.stateTax||0)+(data.socialSecurity||0)+(data.medicare||0)+(data.stateDisability||0)
  const taxesYtd = ytdFederal + ytdState + ytdSS + ytdMedicare + ytdSDI
  const ytdGross = withYtdFallback(data.ytdGrossPay, data.grossPay)
  const ytdNet = withYtdFallback(data.ytdNetPay, data.netPay) || Math.max(0, ytdGross - taxesYtd)
  const logo = data.companyLogo ? (
    <img src={data.companyLogo} alt="Company Logo" className="w-12 h-12 object-contain bg-white border border-gray-500 rounded" />
  ) : (
    <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold">⟐</div>
  )
  const employeeNo = data.employeeId || (data.employeeSSN ? data.employeeSSN.replace(/\D/g, '').slice(-9) : '123456789')
  const stateDisabilityLabel = ((data.taxState || '').toUpperCase() === 'HI') ? 'TDI' : 'SDI'

  return (
    <div className="relative" style={{ backgroundColor: '#f0f0f0', padding: 20 }}>
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
        <div style={{ transform: 'rotate(-45deg)', fontSize: 100, color: 'rgba(200,200,200,0.3)', fontWeight: 700, letterSpacing: 10 }}>PREVIEW</div>
      </div>

      {/* Main container */}
      <div className="relative mx-auto bg-white overflow-hidden" style={{ maxWidth: 800, zIndex: 1 }}>
        <div className="border-[3px] border-black">
          {/* Header */}
          <div className="flex border-b-2 border-black bg-white">
            <div className="w-[100px] border-r border-black p-2 flex flex-col items-center justify-center">
              <div className="w-[50px] h-[50px] bg-black rounded-full text-white flex items-center justify-center text-xl font-bold mb-1">{logo}</div>
              <div className="text-[8px] text-center leading-3">COMPANY LOGO</div>
            </div>
            <div className="flex-1 px-4 py-2">
              <div className="text-[10px] leading-4 mb-1">
                <div className="font-semibold">{data.companyName || 'COMPANY NAME'}</div>
                <div>{data.companyAddress || 'COMPANY ADDRESS'}</div>
                <div>{`${data.companyCity || 'CITY'}, ${data.companyState || 'ST'} ${data.companyZip || 'ZIP'}`}</div>
              </div>
            </div>
            <div className="flex items-center justify-center px-4 py-2 text-center text-[18px] font-bold tracking-widest">
              EARNINGS STATEMENT
            </div>
          </div>

          {/* Employee info header */}
          <div className="flex text-[10px] bg-black text-white border-b border-black">
            <div className="flex-1 px-3 py-1 border-r border-[#444]">EMPLOYEE NAME / ADDRESS</div>
            <div className="w-[120px] px-3 py-1 border-r border-[#444] text-center">EMPLOYEE NO.</div>
            <div className="w-[150px] px-3 py-1 border-r border-[#444] text-center">REPORTING PERIOD</div>
            <div className="w-[100px] px-3 py-1 text-center">PAY DATE</div>
          </div>

          {/* Employee details */}
          <div className="flex border-b border-black bg-white">
            <div className="flex-1 px-3 py-2 border-r border-gray-300 text-[11px] leading-4">
              <div>{data.employeeName || 'EMPLOYEE NAME'}</div>
              <div>{data.employeeAddress || 'EMPLOYEE ADDRESS'}</div>
              <div>{`${data.employeeCity || 'CITY'}, ${data.employeeState || 'ST'} ${data.employeeZip || 'ZIP'}`}</div>
            </div>
            <div className="w-[120px] px-3 py-2 border-r border-gray-300 text-center text-[11px]">{employeeNo}</div>
            <div className="w-[150px] px-3 py-2 border-r border-gray-300 text-center text-[11px]">{formatDate(data.payPeriodStart)} - {formatDate(data.payPeriodEnd)}</div>
            <div className="w-[100px] px-3 py-2 text-center text-[11px]">{formatDate(data.payDate)}</div>
          </div>

          {/* Income header */}
          <div className="flex bg-gray-200 border-b border-black text-[10px] font-bold">
            <div className="w-[80px] px-3 py-1 border-r border-gray-400">INCOME</div>
            <div className="w-[100px] px-3 py-1 border-r border-gray-400 text-right">RATE</div>
            <div className="w-[80px] px-3 py-1 border-r border-gray-400 text-center">HOURS</div>
            <div className="w-[120px] px-3 py-1 border-r border-gray-400 text-right">CURRENT PAY</div>
            <div className="flex-1 px-3 py-1 border-r border-gray-400">DEDUCTION</div>
            <div className="w-[80px] px-3 py-1 border-r border-gray-400 text-right">TOTAL</div>
            <div className="w-[80px] px-3 py-1 text-right">YTD TOTAL</div>
          </div>

          {/* Income row */}
          <div className="flex border-b border-gray-300 text-[11px]">
            <div className="w-[80px] px-3 py-1 border-r border-gray-200">{data.payType === 'hourly' ? 'Hourly' : 'Salary'}</div>
            <div className="w-[100px] px-3 py-1 border-r border-gray-200 text-right">{formatCurrency(data.payType === 'hourly' ? (data.hourlyRate||0) : (data.salary||0))}</div>
            <div className="w-[80px] px-3 py-1 border-r border-gray-200 text-center">{data.payType === 'hourly' ? (data.hoursWorked||0) : ''}</div>
            <div className="w-[120px] px-3 py-1 border-r border-gray-200 text-right">{formatCurrency(data.grossPay||0)}</div>
            <div className="flex-1 px-0 py-0 border-r border-gray-200">
              <div className="font-bold text-[11px] px-3 py-2 bg-gray-100 border-b border-gray-200">STATUTORY DEDUCTIONS</div>
              <div className="px-3">
                <div className="flex border-b border-gray-100 py-1">
                  <div className="flex-1">FICA - Medicare</div>
                  <div className="w-[80px] text-right pr-5">{formatCurrency(data.medicare || 0)}</div>
                  <div className="w-[80px] text-right">{formatCurrency(ytdMedicare || 0)}</div>
                </div>
                <div className="flex border-b border-gray-100 py-1">
                  <div className="flex-1">FICA - Social Security</div>
                  <div className="w-[80px] text-right pr-5">{formatCurrency(data.socialSecurity || 0)}</div>
                  <div className="w-[80px] text-right">{formatCurrency(ytdSS || 0)}</div>
                </div>
                <div className="flex border-b border-gray-100 py-1">
                  <div className="flex-1">Federal Tax</div>
                  <div className="w-[80px] text-right pr-5">{formatCurrency(data.federalTax || 0)}</div>
                  <div className="w-[80px] text-right">{formatCurrency(ytdFederal || 0)}</div>
                </div>
                <div className="flex border-b border-gray-100 py-1">
                  <div className="flex-1">State Tax</div>
                  <div className="w-[80px] text-right pr-5">{formatCurrency(data.stateTax || 0)}</div>
                  <div className="w-[80px] text-right">{formatCurrency(ytdState || 0)}</div>
                </div>
                <div className="flex border-b border-gray-100 py-1">
                  <div className="flex-1">{stateDisabilityLabel}</div>
                  <div className="w-[80px] text-right pr-5">{formatCurrency(data.stateDisability || 0)}</div>
                  <div className="w-[80px] text-right">{formatCurrency(ytdSDI || 0)}</div>
                </div>
              </div>
            </div>
            <div className="w-[80px] px-3 py-1 border-r border-gray-200 text-right"></div>
            <div className="w-[80px] px-3 py-1 text-right"></div>
          </div>

          {/* Bottom summary */}
          <div className="flex bg-gray-200 border-t-2 border-black text-[10px] font-bold">
            <div className="flex-1 px-3 py-2 text-center">YTD GROSS<br /><span className="text-[11px] font-extrabold">{formatCurrency(ytdGross||0)}</span></div>
            <div className="flex-1 px-3 py-2 text-center">YTD DEDUCTION<br /><span className="text-[11px] font-extrabold">{formatCurrency(taxesYtd||0)}</span></div>
            <div className="flex-1 px-3 py-2 text-center">YTD NET PAY<br /><span className="text-[11px] font-extrabold">{formatCurrency(ytdNet||0)}</span></div>
            <div className="flex-1 px-3 py-2 text-center">TOTAL<br /><span className="text-[11px] font-extrabold">{formatCurrency(data.grossPay||0)}</span></div>
            <div className="flex-1 px-3 py-2 text-center">DEDUCTION<br /><span className="text-[11px] font-extrabold">{formatCurrency(taxesCurrent||0)}</span></div>
            <div className="flex-1 px-3 py-2 text-center">NET PAY<br /><span className="text-[11px] font-extrabold">{formatCurrency(data.netPay||0)}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
