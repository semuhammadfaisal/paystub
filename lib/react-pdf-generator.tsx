"use client"

import React from 'react'
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image, Font } from '@react-pdf/renderer'

// Register fonts if needed (optional for better typography)
// Font.register({
//   family: 'Helvetica',
//   src: 'path-to-helvetica.ttf'
// })

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    position: 'relative',
  },
  watermark: {
    position: 'absolute',
    top: '40%',
    left: '15%',
    transform: 'rotate(-45deg)',
    fontSize: 80,
    color: 'rgba(200,200,200,0.3)',
    fontWeight: 700,
    letterSpacing: 8,
    opacity: 0.3,
  },
  container: {
    backgroundColor: 'white',
    border: '3px solid black',
    maxWidth: 800,
    margin: '0 auto',
  },
  header: {
    flexDirection: 'row',
    borderBottom: '2px solid black',
    backgroundColor: 'white',
  },
  logoSection: {
    width: 100,
    borderRight: '1px solid black',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 50,
    height: 50,
    backgroundColor: 'black',
    borderRadius: 25,
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  logoImage: {
    width: 48,
    height: 48,
    objectFit: 'contain',
    backgroundColor: 'white',
    border: '1px solid #888',
    borderRadius: 4,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  logoLabel: {
    fontSize: 8,
    textAlign: 'center',
    lineHeight: 1.2,
  },
  companyInfo: {
    flex: 1,
    padding: '8px 16px',
  },
  companyText: {
    fontSize: 10,
    lineHeight: 1.4,
    marginBottom: 4,
  },
  companyName: {
    fontWeight: 'bold',
    fontSize: 10,
  },
  titleSection: {
    padding: '8px 16px',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  employeeHeader: {
    flexDirection: 'row',
    fontSize: 10,
    backgroundColor: 'black',
    color: 'white',
    borderBottom: '1px solid black',
  },
  employeeHeaderCell: {
    padding: '4px 12px',
    borderRight: '1px solid #444',
  },
  employeeHeaderCellLast: {
    padding: '4px 12px',
  },
  employeeDetails: {
    flexDirection: 'row',
    borderBottom: '1px solid black',
    backgroundColor: 'white',
  },
  employeeDetailsCell: {
    padding: '8px 12px',
    borderRight: '1px solid #ccc',
    fontSize: 11,
    lineHeight: 1.4,
  },
  employeeDetailsCellLast: {
    padding: '8px 12px',
    fontSize: 11,
    textAlign: 'center',
  },
  incomeHeader: {
    flexDirection: 'row',
    backgroundColor: '#e5e5e5',
    borderBottom: '1px solid black',
    fontSize: 10,
    fontWeight: 'bold',
  },
  incomeHeaderCell: {
    padding: '4px 12px',
    borderRight: '1px solid #999',
  },
  incomeRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #ccc',
    fontSize: 11,
  },
  incomeCell: {
    padding: '4px 12px',
    borderRight: '1px solid #ddd',
  },
  deductionSection: {
    flex: 1,
    borderRight: '1px solid #ddd',
  },
  deductionHeader: {
    fontWeight: 'bold',
    fontSize: 11,
    padding: '8px 12px',
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #ddd',
  },
  deductionRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #f0f0f0',
    padding: '4px 12px',
  },
  deductionName: {
    flex: 1,
    fontSize: 11,
  },
  deductionAmount: {
    width: 80,
    textAlign: 'right',
    fontSize: 11,
    paddingRight: 20,
  },
  deductionYtd: {
    width: 80,
    textAlign: 'right',
    fontSize: 11,
  },
  bottomSummary: {
    flexDirection: 'row',
    backgroundColor: '#e5e5e5',
    borderTop: '2px solid black',
    fontSize: 10,
    fontWeight: 'bold',
  },
  summaryCell: {
    flex: 1,
    padding: '8px 12px',
    textAlign: 'center',
  },
  summaryAmount: {
    fontSize: 11,
    fontWeight: 'extrabold',
    marginTop: 2,
  },
  textRight: {
    textAlign: 'right',
  },
  textCenter: {
    textAlign: 'center',
  },
})

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })
const formatCurrency = (n) => fmt.format(n || 0)
const formatDate = (ds) => (ds ? new Date(ds).toLocaleDateString("en-US") : "")

export function DetailedPDF({ data }) {
  const periods = data.payPeriodNumber || 1
  const withYtdFallback = (ytd, per) => (ytd && ytd > 0 ? ytd : (per || 0) * periods)
  const ytdMedicare = withYtdFallback(data.ytdMedicare, data.medicare)
  const ytdSS = withYtdFallback(data.ytdSocialSecurity, data.socialSecurity)
  const ytdFederal = withYtdFallback(data.ytdFederalTax, data.federalTax)
  const ytdState = withYtdFallback(data.ytdStateTax, data.stateTax)
  const ytdSDI = withYtdFallback(undefined, data.stateDisability)
  const taxesCurrent = (data.federalTax||0)+(data.stateTax||0)+(data.socialSecurity||0)+(data.medicare||0)+(data.stateDisability||0)
  const taxesYtd = ytdFederal + ytdState + ytdSS + ytdMedicare + ytdSDI
  const ytdGross = withYtdFallback(data.ytdGrossPay, data.grossPay)
  const ytdNet = withYtdFallback(data.ytdNetPay, data.netPay) || Math.max(0, ytdGross - taxesYtd)
  const employeeNo = data.employeeId || (data.employeeSSN ? data.employeeSSN.replace(/\D/g, '').slice(-9) : '123456789')
  const stateDisabilityLabel = ((data.taxState || '').toUpperCase() === 'HI') ? 'TDI' : 'SDI'

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        <Text style={styles.watermark}>PREVIEW</Text>

        {/* Main container */}
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoSection}>
              {data.companyLogo ? (
                <Image src={data.companyLogo} style={styles.logoImage} />
              ) : (
                <View style={styles.logoCircle}>
                  <Text style={styles.logoText}>⟐</Text>
                </View>
              )}
              <Text style={styles.logoLabel}>COMPANY LOGO</Text>
            </View>
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>{data.companyName || 'COMPANY NAME'}</Text>
              <Text style={styles.companyText}>{data.companyAddress || 'COMPANY ADDRESS'}</Text>
              <Text style={styles.companyText}>
                {`${data.companyCity || 'CITY'}, ${data.companyState || 'ST'} ${data.companyZip || 'ZIP'}` }
              </Text>
            </View>
            <View style={styles.titleSection}>
              <Text style={styles.title}>EARNINGS STATEMENT</Text>
            </View>
          </View>

          {/* Employee info header */}
          <View style={styles.employeeHeader}>
            <Text style={[styles.employeeHeaderCell, { flex: 1 }]}>EMPLOYEE NAME / ADDRESS</Text>
            <Text style={[styles.employeeHeaderCell, { width: 120 }]}>EMPLOYEE NO.</Text>
            <Text style={[styles.employeeHeaderCell, { width: 150 }]}>REPORTING PERIOD</Text>
            <Text style={[styles.employeeHeaderCellLast, { width: 100 }]}>PAY DATE</Text>
          </View>

          {/* Employee details */}
          <View style={styles.employeeDetails}>
            <View style={[styles.employeeDetailsCell, { flex: 1 }]}>
              <Text>{data.employeeName || 'EMPLOYEE NAME'}</Text>
              <Text>{data.employeeAddress || 'EMPLOYEE ADDRESS'}</Text>
              <Text>{`${data.employeeCity || 'CITY'}, ${data.employeeState || 'ST'} ${data.employeeZip || 'ZIP'}`  }</Text>
            </View>
            <Text style={[styles.employeeDetailsCell, { width: 120, textAlign: 'center' }]}>{employeeNo}</Text>
            <Text style={[styles.employeeDetailsCell, { width: 150, textAlign: 'center' }]}>
              {formatDate(data.payPeriodStart)} - {formatDate(data.payPeriodEnd)}
            </Text>
            <Text style={[styles.employeeDetailsCellLast, { width: 100 }]}>{formatDate(data.payDate)}</Text>
          </View>

          {/* Income header */}
          <View style={styles.incomeHeader}>
            <Text style={[styles.incomeHeaderCell, { width: 80 }]}>INCOME</Text>
            <Text style={[styles.incomeHeaderCell, { width: 100, textAlign: 'right' }]}>RATE</Text>
            <Text style={[styles.incomeHeaderCell, { width: 80, textAlign: 'center' }]}>HOURS</Text>
            <Text style={[styles.incomeHeaderCell, { width: 120, textAlign: 'right' }]}>CURRENT PAY</Text>
            <Text style={[styles.incomeHeaderCell, { flex: 1 }]}>DEDUCTION</Text>
            <Text style={[styles.incomeHeaderCell, { width: 80, textAlign: 'right' }]}>TOTAL</Text>
            <Text style={[styles.incomeHeaderCell, { width: 80, textAlign: 'right', borderRight: 'none' }]}>YTD TOTAL</Text>
          </View>

          {/* Income row with deductions */}
          <View style={styles.incomeRow}>
            <Text style={[styles.incomeCell, { width: 80 }]}>
              {data.payType === 'hourly' ? 'Hourly' : 'Salary'}
            </Text>
            <Text style={[styles.incomeCell, { width: 100, textAlign: 'right' }]}>
              {formatCurrency(data.payType === 'hourly' ? (data.hourlyRate||0) : (data.salary||0))}
            </Text>
            <Text style={[styles.incomeCell, { width: 80, textAlign: 'center' }]}>
              {data.payType === 'hourly' ? (data.hoursWorked||0) : ''}
            </Text>
            <Text style={[styles.incomeCell, { width: 120, textAlign: 'right' }]}>
              {formatCurrency(data.grossPay||0)}
            </Text>

            {/* Deductions section */}
            <View style={styles.deductionSection}>
              <Text style={styles.deductionHeader}>STATUTORY DEDUCTIONS</Text>

              <View style={styles.deductionRow}>
                <Text style={styles.deductionName}>FICA - Medicare</Text>
                <Text style={styles.deductionAmount}>{formatCurrency(data.medicare || 0)}</Text>
                <Text style={styles.deductionYtd}>{formatCurrency(ytdMedicare || 0)}</Text>
              </View>

              <View style={styles.deductionRow}>
                <Text style={styles.deductionName}>FICA - Social Security</Text>
                <Text style={styles.deductionAmount}>{formatCurrency(data.socialSecurity || 0)}</Text>
                <Text style={styles.deductionYtd}>{formatCurrency(ytdSS || 0)}</Text>
              </View>

              <View style={styles.deductionRow}>
                <Text style={styles.deductionName}>Federal Tax</Text>
                <Text style={styles.deductionAmount}>{formatCurrency(data.federalTax || 0)}</Text>
                <Text style={styles.deductionYtd}>{formatCurrency(ytdFederal || 0)}</Text>
              </View>

              <View style={styles.deductionRow}>
                <Text style={styles.deductionName}>State Tax</Text>
                <Text style={styles.deductionAmount}>{formatCurrency(data.stateTax || 0)}</Text>
                <Text style={styles.deductionYtd}>{formatCurrency(ytdState || 0)}</Text>
              </View>

              <View style={styles.deductionRow}>
                <Text style={styles.deductionName}>{stateDisabilityLabel}</Text>
                <Text style={styles.deductionAmount}>{formatCurrency(data.stateDisability || 0)}</Text>
                <Text style={styles.deductionYtd}>{formatCurrency(ytdSDI || 0)}</Text>
              </View>
            </View>

            <Text style={[styles.incomeCell, { width: 80 }]}></Text>
            <Text style={[styles.incomeCell, { width: 80, borderRight: 'none' }]}></Text>
          </View>

          {/* Bottom summary */}
          <View style={styles.bottomSummary}>
            <View style={styles.summaryCell}>
              <Text>YTD GROSS</Text>
              <Text style={styles.summaryAmount}>{formatCurrency(ytdGross||0)}</Text>
            </View>
            <View style={styles.summaryCell}>
              <Text>YTD DEDUCTION</Text>
              <Text style={styles.summaryAmount}>{formatCurrency(taxesYtd||0)}</Text>
            </View>
            <View style={styles.summaryCell}>
              <Text>YTD NET PAY</Text>
              <Text style={styles.summaryAmount}>{formatCurrency(ytdNet||0)}</Text>
            </View>
            <View style={styles.summaryCell}>
              <Text>TOTAL</Text>
              <Text style={styles.summaryAmount}>{formatCurrency(data.grossPay||0)}</Text>
            </View>
            <View style={styles.summaryCell}>
              <Text>DEDUCTION</Text>
              <Text style={styles.summaryAmount}>{formatCurrency(taxesCurrent||0)}</Text>
            </View>
            <View style={styles.summaryCell}>
              <Text>NET PAY</Text>
              <Text style={styles.summaryAmount}>{formatCurrency(data.netPay||0)}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

// Component to view PDF in browser
export function PaystubPDFViewer({ data }) {
  return (
    <PDFViewer width="100%" height="600px">
      <DetailedPDF data={data} />
    </PDFViewer>
  )
}

// Component to download PDF
export function PaystubPDFDownload({ data }) {
  return (
    <PDFDownloadLink
      document={<DetailedPDF data={data} />}
      fileName="paystub.pdf"
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      {({ blob, url, loading, error }) =>
        loading ? 'Generating PDF...' : 'Download PDF'
      }
    </PDFDownloadLink>
  )
}
