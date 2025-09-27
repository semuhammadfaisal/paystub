"use client"

import type { PaystubData as GeneratorPaystubData } from "@/components/paystub-generator"

interface TemplateProps {
  data: GeneratorPaystubData
}

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })
const formatCurrency = (n: number) => fmt.format(n || 0)
const formatDate = (ds: string) => (ds ? new Date(ds).toLocaleDateString("en-US") : "")

export function CompactPreview({ data }: TemplateProps) {
  const accent = data.themeColor || "#b7c9ff"
  const accentDark = "#9fb2ff"
  const border = "#98b0de"
  const textColor = "#1b2b40"
  const muted = "#6a6f7a"

  const periods = data.payPeriodNumber || 1
  const withYtdFallback = (ytd?: number, per?: number) => (ytd && ytd > 0 ? ytd : (per || 0) * periods)
  const ytdMedicare = withYtdFallback(data.ytdMedicare, data.medicare)
  const ytdSS = withYtdFallback(data.ytdSocialSecurity, data.socialSecurity)
  const ytdFederal = withYtdFallback(data.ytdFederalTax, data.federalTax)
  const ytdState = withYtdFallback(data.ytdStateTax, data.stateTax)
  const ytdSDI = withYtdFallback(undefined, data.stateDisability)
  const taxesCurrent = (data.federalTax||0)+(data.stateTax||0)+(data.socialSecurity||0)+(data.medicare||0)+(data.stateDisability||0)
  const taxesYtd = (ytdFederal+ytdState+ytdSS+ytdMedicare+ytdSDI)
  const ytdGross = withYtdFallback(data.ytdGrossPay, data.grossPay)
  const ytdNet = withYtdFallback(data.ytdNetPay, data.netPay) || Math.max(0, (ytdGross||0) - (taxesYtd||0))
  const employeeNo = data.employeeId || (data.employeeSSN ? data.employeeSSN.replace(/\D/g, '').slice(-9) : '123456789')
  const stateDisabilityLabel = ((data.taxState || '').toUpperCase() === 'HI') ? 'TDI' : 'SDI'

  const Logo = data.companyLogo ? (
    <div className="logo flex items-center justify-center" style={{ width: 100, height: 100, border: `2px solid ${border}` }}>
      <img src={data.companyLogo} alt="Company Logo" className="max-w-[88px] max-h-[88px] object-contain" />
    </div>
  ) : (
    <div className="logo" style={{ width: 100, height: 100, border: `2px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-[70px] h-[70px]">
        <rect width="100" height="100" fill="#fff" />
        <circle cx="40" cy="50" r="28" fill="#111" />
        <text x="40" y="58" fontFamily="Arial" fontSize="34" fill="#fff" fontWeight="700" textAnchor="middle">{(data.companyName||'CL').slice(0,2).toUpperCase()}</text>
        <text x="50" y="92" fontFamily="Arial" fontSize="8" fill="#111" textAnchor="middle">COMPANY LOGO</text>
      </svg>
    </div>
  )

  return (
    <>
    <div className="relative text-[14px]" style={{ color: textColor }}>
      {/* Page container */}
      <div id="paystub-capture-target" data-template="compact" className="relative mx-auto" style={{ width: 980, border: `2px solid ${border}` }}>
        {/* Watermark */}
        <div className="absolute left-1/2 top-[52%] select-none" data-nonexport="true" data-template-watermark style={{ transform: 'translate(-50%,-50%) rotate(-22deg)', fontWeight: 800, fontSize: 140, color: 'rgba(103,110,121,0.15)', letterSpacing: 8, pointerEvents: 'none', zIndex: 0 }}>
          PREVIEW ONLY
        </div>

        {/* Top area */}
        <div className="relative" style={{ zIndex: 2 }}>
          {/* Title ribbon */}
          <div className="flex items-start justify-end h-[70px]">
            <div className="relative h-[48px] px-7 flex items-center font-extrabold text-white text-[28px]" style={{ background: accent }}>
              EARNINGS STATEMENT
              <div className="absolute left-[-36px] top-0" style={{ width: 0, height: 0, borderTop: '48px solid transparent', borderRight: `36px solid ${accent}` }} />
            </div>
          </div>

          {/* Company bar */}
          <div className="grid" style={{ gridTemplateColumns: '120px 1fr 1fr', gap: 12, alignItems: 'center', padding: '14px 18px', borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
            <div className="flex items-center justify-center">{Logo}</div>
            <div>
              <div className="font-bold">{data.companyName || 'COMPANY NAME'}</div>
            </div>
            <div className="text-[13px]" style={{ color: muted }}>{data.companyAddress || 'COMPANY ADDRESS'}<br />{`${data.companyCity || 'CITY'}, ${data.companyState || 'ST'} ${data.companyZip || 'ZIP'}`}</div>
          </div>

          {/* Blue header row */}
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr', background: accent, color: 'white', fontWeight: 800, fontSize: 14, padding: '8px 12px', borderBottom: `2px solid ${border}` }}>
            <div className="pr-2" style={{ borderRight: '1px solid rgba(255,255,255,0.18)' }}>EMPLOYEE NAME</div>
            <div className="pr-2" style={{ borderRight: '1px solid rgba(255,255,255,0.18)' }}>MARITAL STATUS</div>
            <div className="pr-2" style={{ borderRight: '1px solid rgba(255,255,255,0.18)' }}>EMPLOYEE NO.</div>
            <div></div>
          </div>
          <div className="grid items-center" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr', padding: '10px 12px', borderBottom: `1px solid ${border}` }}>
            <div>
              <div className="text-[14px]">{data.employeeName || 'EMPLOYEE NAME'}</div>
            </div>
            <div>
              <div className="text-[14px]">{(data.maritalStatus || 'single').replace('_',' ').replace(/\b\w/g, c=>c.toUpperCase())}</div>
            </div>
            <div>
              <div className="text-[14px]">{employeeNo}</div>
            </div>
            <div></div>
          </div>

          {/* Second header row */}
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr', background: accent, color: 'white', fontWeight: 800, fontSize: 14, padding: '8px 12px', borderBottom: `2px solid ${border}` }}>
            <div className="pr-2" style={{ borderRight: '1px solid rgba(255,255,255,0.18)' }}>PAY DATE</div>
            <div className="pr-2" style={{ borderRight: '1px solid rgba(255,255,255,0.18)' }}>PAY PERIOD</div>
            <div className="pr-2" style={{ borderRight: '1px solid rgba(255,255,255,0.18)' }}>PAY MODE</div>
            <div>PAY TYPE</div>
          </div>
          <div className="grid items-center" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr', padding: '10px 12px', borderBottom: `1px solid ${border}` }}>
            <div><div className="text-[14px]">{formatDate(data.payDate)}</div></div>
            <div><div className="text-[14px]">{formatDate(data.payPeriodStart)} - {formatDate(data.payPeriodEnd)}</div></div>
            <div><div className="text-[14px]">{data.payFrequency || 'Bi-Weekly'}</div></div>
            <div><div className="text-[14px]">{data.payType === 'hourly' ? 'Hourly' : 'Salary'}</div></div>
          </div>
        </div>

        {/* Main content area */}
        <div className="grid" style={{ gridTemplateColumns: '1.6fr 1fr', minHeight: 360, borderTop: `2px solid ${border}`, borderBottom: `2px solid ${border}` }}>
          {/* Left panel - Income */}
          <div className="left-panel" style={{ padding: '12px 14px', borderRight: `2px solid ${border}` }}>
            <div className="income-head" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', background: accent, color: 'white', fontWeight: 800, padding: '8px 10px', borderBottom: `1px solid ${border}` }}>
              <div>INCOME</div>
              <div>RATE</div>
              <div>HOURS</div>
              <div>CURRENT TOTAL</div>
            </div>
            <div className="income-body" style={{ padding: '12px 8px' }}>
              <div className="income-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '8px 6px', alignItems: 'center' }}>
                <div className="col-name">{data.payType === 'hourly' ? 'Hourly' : 'Salary'}</div>
                <div className="col-rate"><span className="calc-val">{formatCurrency(data.payType === 'hourly' ? (data.hourlyRate || 0) : (data.salary || 0))}</span></div>
                <div className="col-hours"><span className="calc-val">{data.payType === 'hourly' ? (data.hoursWorked || 0) : '-'}</span></div>
                <div className="col-amt" style={{ textAlign: 'right' }}><span className="calc-val">{formatCurrency(data.grossPay || 0)}</span></div>
              </div>
              <div className="income-space" style={{ height: 220, background: 'white' }} />
            </div>
          </div>

          {/* Right panel - Deductions */}
          <div className="right-panel" style={{ padding: '12px 14px' }}>
            <div className="ded-head" style={{ background: accent, color: 'white', fontWeight: 800, padding: '8px 10px', marginBottom: 8 }}>DEDUCTIONS</div>
            <div className="ded-list blur-taxes" style={{ padding: 6 }}>
              <div className="ded-item" style={{ display: 'grid', gridTemplateColumns: '1fr 80px 90px', gap: 8, padding: '8px 6px', alignItems: 'center', borderTop: '0' }}>
                <div>FICA - Medicare</div>
                <div className="amt" style={{ textAlign: 'right' }}><span className="calc-val">{formatCurrency(data.medicare || 0)}</span></div>
                <div className="ytd" style={{ textAlign: 'right', color: muted, fontSize: 13 }}><span className="calc-val">{formatCurrency(ytdMedicare || 0)}</span></div>
              </div>
              <div className="ded-item" style={{ display: 'grid', gridTemplateColumns: '1fr 80px 90px', gap: 8, padding: '8px 6px', alignItems: 'center', borderTop: '1px solid #e6ecff' }}>
                <div>FICA - Social Security</div>
                <div className="amt" style={{ textAlign: 'right' }}><span className="calc-val">{formatCurrency(data.socialSecurity || 0)}</span></div>
                <div className="ytd" style={{ textAlign: 'right', color: muted, fontSize: 13 }}><span className="calc-val">{formatCurrency(ytdSS || 0)}</span></div>
              </div>
              <div className="ded-item" style={{ display: 'grid', gridTemplateColumns: '1fr 80px 90px', gap: 8, padding: '8px 6px', alignItems: 'center', borderTop: '1px solid #e6ecff' }}>
                <div>Federal Tax</div>
                <div className="amt" style={{ textAlign: 'right' }}><span className="calc-val">{formatCurrency(data.federalTax || 0)}</span></div>
                <div className="ytd" style={{ textAlign: 'right', color: muted, fontSize: 13 }}><span className="calc-val">{formatCurrency(ytdFederal || 0)}</span></div>
              </div>
              <div className="ded-item" style={{ display: 'grid', gridTemplateColumns: '1fr 80px 90px', gap: 8, padding: '8px 6px', alignItems: 'center', borderTop: '1px solid #e6ecff' }}>
                <div>State Tax</div>
                <div className="amt" style={{ textAlign: 'right' }}><span className="calc-val">{formatCurrency(data.stateTax || 0)}</span></div>
                <div className="ytd" style={{ textAlign: 'right', color: muted, fontSize: 13 }}><span className="calc-val">{formatCurrency(ytdState || 0)}</span></div>
              </div>
              <div className="ded-item" style={{ display: 'grid', gridTemplateColumns: '1fr 80px 90px', gap: 8, padding: '8px 6px', alignItems: 'center', borderTop: '1px solid #e6ecff' }}>
                <div>{stateDisabilityLabel}</div>
                <div className="amt" style={{ textAlign: 'right' }}><span className="calc-val">{formatCurrency(data.stateDisability || 0)}</span></div>
                <div className="ytd" style={{ textAlign: 'right', color: muted, fontSize: 13 }}><span className="calc-val">{formatCurrency(ytdSDI || 0)}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom totals */}
        <div className="totals" style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', background: accent, color: 'white', padding: '8px 10px', fontWeight: 800, borderTop: `2px solid ${border}` }}>
          <div className="tot-cell" style={{ borderRight: '1px solid rgba(255,255,255,0.18)', padding: 8, textAlign: 'center' }}>YTD GROSS</div>
          <div className="tot-cell" style={{ borderRight: '1px solid rgba(255,255,255,0.18)', padding: 8, textAlign: 'center' }}>YTD DEDUCTIONS</div>
          <div className="tot-cell" style={{ borderRight: '1px solid rgba(255,255,255,0.18)', padding: 8, textAlign: 'center' }}>YTD NET PAY</div>
          <div className="tot-cell" style={{ borderRight: '1px solid rgba(255,255,255,0.18)', padding: 8, textAlign: 'center' }}>TOTAL</div>
          <div className="tot-cell" style={{ borderRight: '1px solid rgba(255,255,255,0.18)', padding: 8, textAlign: 'center' }}>DEDUCTIONS</div>
          <div className="tot-cell" style={{ padding: 8, textAlign: 'center' }}>NET PAY</div>
        </div>
        <div className="totals-vals" style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', background: '#fff', color: textColor, padding: '10px 10px', borderTop: `1px solid ${border}` }}>
          <div className="val" style={{ padding: 8, textAlign: 'center', borderRight: '1px solid #e6ecff' }}>{formatCurrency(ytdGross || 0)}</div>
          <div className="val" style={{ padding: 8, textAlign: 'center', borderRight: '1px solid #e6ecff' }}>{formatCurrency(taxesYtd || 0)}</div>
          <div className="val" style={{ padding: 8, textAlign: 'center', borderRight: '1px solid #e6ecff' }}>{formatCurrency(ytdNet || 0)}</div>
          <div className="val" style={{ padding: 8, textAlign: 'center', borderRight: '1px solid #e6ecff' }}>{formatCurrency(data.grossPay || 0)}</div>
          <div className="val" style={{ padding: 8, textAlign: 'center', borderRight: '1px solid #e6ecff' }}>{formatCurrency(taxesCurrent || 0)}</div>
          <div className="val" style={{ padding: 8, textAlign: 'center' }}>{formatCurrency(data.netPay || 0)}</div>
        </div>
      </div>
    </div>
    {/* Download button removed to keep single unified download flow */}
    </>
  )
}
