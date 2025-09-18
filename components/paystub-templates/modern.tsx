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
  const accent = data.themeColor || "#d8d8e8"
  const taxesCurrent = (data.federalTax||0)+(data.stateTax||0)+(data.socialSecurity||0)+(data.medicare||0)+(data.stateDisability||0)
  const periods = data.payPeriodNumber || 1
  const withYtdFallback = (ytd: number | undefined, perPeriod: number | undefined) => {
    const per = perPeriod || 0
    return (ytd && ytd > 0) ? ytd : per * periods
  }
  const ytdMedicare = withYtdFallback(data.ytdMedicare, data.medicare)
  const ytdSS = withYtdFallback(data.ytdSocialSecurity, data.socialSecurity)
  const ytdFederal = withYtdFallback(data.ytdFederalTax, data.federalTax)
  const ytdState = withYtdFallback(data.ytdStateTax, data.stateTax)
  const sdiYtd = withYtdFallback(undefined, data.stateDisability)
  const taxesYtd = (ytdFederal)+(ytdState)+(ytdSS)+(ytdMedicare)+(sdiYtd)
  const preTaxCurrent = 0, preTaxYtd = 0
  const postTaxCurrent = (data.healthInsurance||0)+(data.dentalInsurance||0)+(data.visionInsurance||0)+(data.lifeInsurance||0)+(data.parkingFee||0)+(data.unionDues||0)+(data.otherDeductions||0)+(data.rothIRA||0)
  const postTaxYtd = Math.max(0, (data.ytdTotalDeductions||0) - taxesYtd)
  const ytdGross = (data.ytdGrossPay && data.ytdGrossPay > 0) ? data.ytdGrossPay : (data.grossPay||0) * periods
  const ytdNet = (data.ytdNetPay && data.ytdNetPay > 0) ? data.ytdNetPay : Math.max(0, ytdGross - (preTaxYtd + taxesYtd + postTaxYtd))
  const logo = data.companyLogo ? (
    <img src={data.companyLogo} alt="Company Logo" className="w-12 h-12 object-contain bg-white border border-gray-500 rounded" />
  ) : (
    <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold">
      {(data.companyName||'CI').slice(0,2).toUpperCase()}
    </div>
  )
  return (
    <div className="relative text-[10px]" style={{ backgroundColor:'#f0f0f0', padding:20 }}>
      <div className="relative mx-auto" style={{ width:800 }}>
        <div className="absolute inset-0" style={{ backgroundImage:
          `repeating-linear-gradient(0deg,#e0e0e0 0px,transparent 1px,transparent 20px,#e0e0e0 21px),repeating-linear-gradient(90deg,#e0e0e0 0px,transparent 1px,transparent 20px,#e0e0e0 21px)`, opacity:.3, zIndex:0 }} />
        <div className="absolute select-none" style={{ top:'50%', left:'50%', transform:'translate(-50%,-50%) rotate(-30deg)', fontSize:120, color:'rgba(200,200,200,.3)', fontWeight:700, letterSpacing:10, zIndex:1 }}>PREVIEW</div>
        <div className="relative bg-white border border-gray-400" style={{ zIndex:2 }}>
          <div className="flex items-center justify-between" style={{ backgroundColor:accent, padding:10, borderBottom:'1px solid #999' }}>
            <div className="flex items-center gap-3">
              {logo}
              <div className="leading-tight">
                <div className="font-bold italic text-[11px]">{data.companyName||'COMPANY NAME'}</div>
                <div className="text-[11px]">{data.companyAddress||'COMPANY ADDRESS'}</div>
                <div className="text-[11px]">{`${data.companyCity||'CITY'}, ${data.companyState||'ST'} ${data.companyZip||'ZIP'}`}</div>
                <div className="text-[9px] mt-1">{data.companyLogo? 'COMPANY LOGO' : '\u00A0'}</div>
              </div>
            </div>
            <div className="text-right text-[11px]">
              <div>Advice Number: <strong>{data.adviceNumber||'00000000'}</strong></div>
              <div>Pay date: <strong>{formatDate(data.payDate)}</strong></div>
            </div>
          </div>
          <div className="p-5">
            <div className="border border-gray-400">
              <div className="px-3 py-1 text-[11px] border-b border-gray-400">Pay to the order of</div>
              <div className="flex items-center justify-between px-3 py-2">
                <div className="text-[12px] font-bold text-gray-800">{data.employeeName||'EMPLOYEE NAME'}</div>
                <div className="text-[12px]">Amount: <strong>{formatCurrency(data.netPay||0)}</strong></div>
              </div>
            </div>
            <div className="text-right my-5 text-[14px] font-bold text-gray-800">NON-NEGOTIABLE</div>
            <table className="w-full border-collapse text-[10px] mt-2">
              <thead>
                <tr>
                  <th className="bg-gray-200 border border-gray-400 p-1 text-left font-normal">Employee Name</th>
                  <th className="bg-gray-200 border border-gray-400 p-1 text-left font-normal">Employee Social</th>
                  <th className="bg-gray-200 border border-gray-400 p-1 text-left font-normal">Employee Address</th>
                  <th className="bg-gray-200 border border-gray-400 p-1 text-left font-normal">Company Name</th>
                  <th className="bg-gray-200 border border-gray-400 p-1 text-left font-normal">Company Address</th>
                  <th className="bg-gray-200 border border-gray-400 p-1 text-left font-normal">Pay Period Begin</th>
                  <th className="bg-gray-200 border border-gray-400 p-1 text-left font-normal">Pay Period End</th>
                  <th className="bg-gray-200 border border-gray-400 p-1 text-left font-normal">Check Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-400 p-1 bg-white">{data.employeeName||'Employee Name'}</td>
                  <td className="border border-gray-400 p-1 bg-white">{maskSSN(data.employeeSSN)||'123-45-6789'}</td>
                  <td className="border border-gray-400 p-1 bg-white">{data.employeeAddress||'Employee Address'}<br />{`${data.employeeCity||'City'}, ${data.employeeState||'ST'} ${data.employeeZip||'Zip'}`}</td>
                  <td className="border border-gray-400 p-1 bg-white">{data.companyName||'Company Name'}</td>
                  <td className="border border-gray-400 p-1 bg-white">{data.companyAddress||'Company Address'}<br />{`${data.companyCity||'City'}, ${data.companyState||'ST'} ${data.companyZip||'Zip'}`}</td>
                  <td className="border border-gray-400 p-1 bg-white">{formatDate(data.payPeriodStart)}</td>
                  <td className="border border-gray-400 p-1 bg-white">{formatDate(data.payPeriodEnd)}</td>
                  <td className="border border-gray-400 p-1 bg-white">{formatDate(data.payDate)}</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-5 p-3 bg-gray-100 border border-gray-400 leading-tight">
              <div className="font-bold text-center mb-1">Important Notes</div>
              The Meal and Rest Break Policy provides you with the opportunity to take meal and rest breaks. Requirements vary by state.
            </div>
            <div className="mt-5">
              <div>
                <div className="text-center bg-gray-200 border border-gray-400 py-1 text-[10px]">Gross Pay</div>
                <table className="w-full border-collapse text-[10px] mb-4">
                  <thead>
                    <tr>
                      <th className="bg-gray-200 border border-gray-400 p-1 text-left font-normal"></th>
                      <th className="bg-gray-200 border border-gray-400 p-1 text-left font-normal">Current</th>
                      <th className="bg-gray-200 border border-gray-400 p-1 text-left font-normal">Pre Tax Deductions</th>
                      <th className="bg-gray-200 border border-gray-400 p-1 text-left font-normal">Taxes</th>
                      <th className="bg-gray-200 border border-gray-400 p-1 text-left font-normal">Post Tax Deductions</th>
                      <th className="bg-gray-200 border border-gray-400 p-1 text-left font-normal">Net Pay</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-400 p-1 bg-white"></td>
                      <td className="border border-gray-400 p-1 bg-white text-right">{formatCurrency(data.grossPay||0)}</td>
                      <td className="border border-gray-400 p-1 bg-white text-center">{formatCurrency(preTaxCurrent)}</td>
                      <td className="border border-gray-400 p-1 bg-white text-center">{formatCurrency(taxesCurrent)}</td>
                      <td className="border border-gray-400 p-1 bg-white text-center">{formatCurrency(postTaxCurrent)}</td>
                      <td className="border border-gray-400 p-1 bg-white text-center">{formatCurrency(data.netPay||0)}</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 p-1 bg-gray-50 font-semibold">YTD</td>
                      <td className="border border-gray-400 p-1 bg-white text-right">{formatCurrency(ytdGross||0)}</td>
                      <td className="border border-gray-400 p-1 bg-white text-center">{formatCurrency(preTaxYtd)}</td>
                      <td className="border border-gray-400 p-1 bg-white text-center">{formatCurrency(taxesYtd)}</td>
                      <td className="border border-gray-400 p-1 bg-white text-center">{formatCurrency(postTaxYtd)}</td>
                      <td className="border border-gray-400 p-1 bg-white text-center">{formatCurrency(ytdNet||0)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-center bg-gray-200 border border-gray-400 py-1 text-[10px]">Earnings</div>
                  <table className="w-full border-collapse text-[10px] mb-4">
                    <thead>
                      <tr>
                        <th className="bg-gray-200 border border-gray-400 p-1 text-left font-normal">Description</th>
                        <th className="bg-gray-200 border border-gray-400 p-1 text-right font-normal">Hours</th>
                        <th className="bg-gray-200 border border-gray-400 p-1 text-right font-normal">Amount</th>
                        <th className="bg-gray-200 border border-gray-400 p-1 text-right font-normal">YTD</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.payType==='hourly' ? (
                        <>
                          <tr>
                            <td className="border border-gray-400 p-1 bg-white">Regular</td>
                            <td className="border border-gray-400 p-1 bg-white text-right">{data.hoursWorked||0}</td>
                            <td className="border border-gray-400 p-1 bg-white text-right">{formatCurrency((data.hourlyRate||0)*(data.hoursWorked||0))}</td>
                            <td className="border border-gray-400 p-1 bg-white text-right">{formatCurrency(((data.hourlyRate||0)*(data.hoursWorked||0))*(periods))}</td>
                          </tr>
                          {data.overtimeHours>0 && (
                            <tr>
                              <td className="border border-gray-400 p-1 bg-white">Overtime</td>
                              <td className="border border-gray-400 p-1 bg-white text-right">{data.overtimeHours||0}</td>
                              <td className="border border-gray-400 p-1 bg-white text-right">{formatCurrency((data.overtimeHours||0)*(data.overtimeRate||data.hourlyRate*1.5||0))}</td>
                              <td className="border border-gray-400 p-1 bg-white text-right">{formatCurrency(((data.overtimeHours||0)*(data.overtimeRate||data.hourlyRate*1.5||0))*(periods))}</td>
                            </tr>
                          )}
                        </>
                      ) : (
                        <tr>
                          <td className="border border-gray-400 p-1 bg-white">Salary</td>
                          <td className="border border-gray-400 p-1 bg-white text-right">-</td>
                          <td className="border border-gray-400 p-1 bg-white text-right">{formatCurrency(data.grossPay||0)}</td>
                          <td className="border border-gray-400 p-1 bg-white text-right">{formatCurrency(data.ytdGrossPay||0)}</td>
                        </tr>
                      )}
                      <tr className="font-bold bg-gray-50">
                        <td className="border border-gray-400 p-1">Earnings</td>
                        <td className="border border-gray-400 p-1"></td>
                        <td className="border border-gray-400 p-1 text-right">{formatCurrency(data.grossPay||0)}</td>
                        <td className="border border-gray-400 p-1 text-right">{formatCurrency(data.ytdGrossPay||0)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <div className="text-center bg-gray-200 border border-gray-400 py-1 text-[10px]">Associated Taxes</div>
                  <table className="w-full border-collapse text-[10px] mb-4">
                    <thead>
                      <tr>
                        <th className="bg-gray-200 border border-gray-400 p-1 text-left font-normal">Description</th>
                        <th className="bg-gray-200 border border-gray-400 p-1 text-right font-normal">Amount</th>
                        <th className="bg-gray-200 border border-gray-400 p-1 text-right font-normal">YTD</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td className="border border-gray-400 p-1 bg-white">FICA - Medicare</td><td className="border border-gray-400 p-1 bg-white text-right">{formatCurrency(data.medicare||0)}</td><td className="border border-gray-400 p-1 bg-white text-right">{formatCurrency(ytdMedicare||0)}</td></tr>
                      <tr><td className="border border-gray-400 p-1 bg-white">FICA - Social Security</td><td className="border border-gray-400 p-1 bg-white text-right">{formatCurrency(data.socialSecurity||0)}</td><td className="border border-gray-400 p-1 bg-white text-right">{formatCurrency(ytdSS||0)}</td></tr>
                      <tr><td className="border border-gray-400 p-1 bg-white">Federal Tax</td><td className="border border-gray-400 p-1 bg-white text-right">{formatCurrency(data.federalTax||0)}</td><td className="border border-gray-400 p-1 bg-white text-right">{formatCurrency(ytdFederal||0)}</td></tr>
                      <tr><td className="border border-gray-400 p-1 bg-white">State Tax</td><td className="border border-gray-400 p-1 bg-white text-right">{formatCurrency(data.stateTax||0)}</td><td className="border border-gray-400 p-1 bg-white text-right">{formatCurrency(ytdState||0)}</td></tr>
                      <tr><td className="border border-gray-400 p-1 bg-white">{((data.taxState||'').toUpperCase()==='HI')?'TDI':'SDI'}</td><td className="border border-gray-400 p-1 bg-white text-right">{formatCurrency(data.stateDisability||0)}</td><td className="border border-gray-400 p-1 bg-white text-right">{formatCurrency(sdiYtd||0)}</td></tr>
                      <tr className="font-bold bg-gray-50"><td className="border border-gray-400 p-1">Associated Taxes</td><td className="border border-gray-400 p-1 text-right">{formatCurrency(taxesCurrent)}</td><td className="border border-gray-400 p-1 text-right">{formatCurrency(taxesYtd)}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
