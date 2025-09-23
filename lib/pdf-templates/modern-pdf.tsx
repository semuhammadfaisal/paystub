"use client"

import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#f8fafc',
    padding: 30,
    position: 'relative',
  },
  watermark: {
    position: 'absolute',
    top: '45%',
    left: '25%',
    transform: 'rotate(-45deg)',
    fontSize: 90,
    color: 'rgba(200,200,200,0.15)',
    fontWeight: 700,
    letterSpacing: 8,
    opacity: 0.2,
  },
  container: {
    backgroundColor: '#ffffff',
    border: '2px solid #e2e8f0',
    borderRadius: 12,
    padding: 25,
    maxWidth: 650,
    margin: '0 auto',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 25,
    paddingBottom: 20,
    borderBottom: '2px solid #e2e8f0',
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  companyDetails: {
    fontSize: 11,
    color: '#64748b',
    lineHeight: 1.5,
    marginBottom: 4,
  },
  paystubBadge: {
    backgroundColor: '#239BA0',
    color: '#ffffff',
    padding: '8px 16px',
    borderRadius: 20,
    fontWeight: 'bold',
    fontSize: 12,
  },
  payInfo: {
    textAlign: 'right',
  },
  payDate: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 4,
  },
  payPeriod: {
    fontSize: 10,
    color: '#94a3b8',
  },
  employeeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    padding: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#239BA0',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeText: {
    fontSize: 11,
    color: '#475569',
    marginBottom: 6,
    lineHeight: 1.4,
  },
  payDetails: {
    width: 200,
  },
  payDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    fontSize: 11,
  },
  payDetailLabel: {
    color: '#64748b',
  },
  payDetailValue: {
    fontWeight: 'medium',
    color: '#1e293b',
  },
  earningsDeductions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 30,
    marginBottom: 25,
  },
  column: {
    flex: 1,
  },
  table: {
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    padding: '8px 12px',
    borderRadius: 6,
    marginBottom: 8,
  },
  tableHeaderText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#475569',
  },
  tableRow: {
    flexDirection: 'row',
    padding: '6px 12px',
    borderBottom: '1px solid #e2e8f0',
    fontSize: 10,
    color: '#334155',
  },
  tableCell: {
    flex: 1,
    textAlign: 'left',
  },
  tableCellRight: {
    flex: 1,
    textAlign: 'right',
    fontWeight: 'medium',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '8px 12px',
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    borderTop: '2px solid #239BA0',
  },
  summaryText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  summaryAmount: {
    fontSize: 11,
    fontWeight: 'extrabold',
    color: '#239BA0',
  },
  netPaySection: {
    alignItems: 'center',
    padding: 25,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginTop: 20,
  },
  netPayBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  netPayLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#239BA0',
  },
  netPayAmount: {
    fontSize: 24,
    fontWeight: 'extrabold',
    color: '#1e293b',
  },
  footer: {
    marginTop: 20,
    paddingTop: 15,
    borderTop: '1px solid #e2e8f0',
    fontSize: 9,
    textAlign: 'center',
    color: '#94a3b8',
  },
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount || 0)
}

const formatDate = (dateString) => {
  if (!dateString) return ""
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric"
  })
}

const maskSSN = (ssn) => {
  if (!ssn || ssn.length < 4) return "XXX-XX-XXXX"
  return `XXX-XX-${ssn.slice(-4)}`
}

export function ModernPDF({ data }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.watermark}>PREVIEW</Text>

        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>PAYROLL STATEMENT</Text>
              <Text style={[styles.companyDetails, { fontWeight: 'bold' }]}>
                {data.companyName || "Company Name"}
              </Text>
              <Text style={styles.companyDetails}>
                {data.companyAddress || "Company Address"}
              </Text>
              <Text style={styles.companyDetails}>
                {data.companyCity || "City"}, {data.companyState || "ST"} {data.companyZip || "ZIP"}
              </Text>
              {data.companyPhone && (
                <Text style={styles.companyDetails}>Phone: {data.companyPhone}</Text>
              )}
              <Text style={styles.companyDetails}>EIN: {data.companyEIN || "XX-XXXXXXX"}</Text>
            </View>

            <View style={styles.payInfo}>
              <View style={styles.paystubBadge}>
                <Text>Paystub</Text>
              </View>
              <Text style={styles.payDate}>Pay Date: {formatDate(data.payDate)}</Text>
              <Text style={styles.payPeriod}>
                Period: {formatDate(data.payPeriodStart)} - {formatDate(data.payPeriodEnd)}
              </Text>
            </View>
          </View>

          {/* Employee Section */}
          <View style={styles.employeeSection}>
            <View style={styles.employeeInfo}>
              <Text style={styles.sectionTitle}>Employee Information</Text>
              <Text style={styles.employeeText}>{data.employeeName || "Employee Name"}</Text>
              <Text style={styles.employeeText}>{data.employeeAddress || "Employee Address"}</Text>
              <Text style={styles.employeeText}>
                {data.employeeCity || "City"}, {data.employeeState || "ST"} {data.employeeZip || "ZIP"}
              </Text>
              <Text style={styles.employeeText}>SSN: {maskSSN(data.employeeSSN)}</Text>
              {data.employeeId && <Text style={styles.employeeText}>ID: {data.employeeId}</Text>}
              {data.employeePhone && <Text style={styles.employeeText}>Phone: {data.employeePhone}</Text>}
            </View>

            <View style={styles.payDetails}>
              <Text style={styles.sectionTitle}>Pay Details</Text>
              <View style={styles.payDetailRow}>
                <Text style={styles.payDetailLabel}>Pay Frequency:</Text>
                <Text style={styles.payDetailValue}>{data.payFrequency || "Bi-Weekly"}</Text>
              </View>
              <View style={styles.payDetailRow}>
                <Text style={styles.payDetailLabel}>Pay Type:</Text>
                <Text style={styles.payDetailValue}>{data.payType === "hourly" ? "Hourly" : "Salary"}</Text>
              </View>
              {data.payType === "hourly" && (
                <>
                  <View style={styles.payDetailRow}>
                    <Text style={styles.payDetailLabel}>Rate:</Text>
                    <Text style={styles.payDetailValue}>{formatCurrency(data.hourlyRate)}</Text>
                  </View>
                  <View style={styles.payDetailRow}>
                    <Text style={styles.payDetailLabel}>Hours:</Text>
                    <Text style={styles.payDetailValue}>{data.hoursWorked}</Text>
                  </View>
                  {data.overtimeHours > 0 && (
                    <View style={styles.payDetailRow}>
                      <Text style={styles.payDetailLabel}>Overtime:</Text>
                      <Text style={styles.payDetailValue}>
                        {data.overtimeHours} @ {formatCurrency(data.overtimeRate)}
                      </Text>
                    </View>
                  )}
                </>
              )}
            </View>
          </View>

          {/* Earnings and Deductions */}
          <View style={styles.earningsDeductions}>
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>Earnings</Text>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderText, { flex: 2 }]}>Description</Text>
                  <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Amount</Text>
                </View>

                {data.payType === "hourly" ? (
                  <>
                    <View style={styles.tableRow}>
                      <Text style={[styles.tableCell, { flex: 2 }]}>
                        Regular Pay ({data.hoursWorked} hrs)
                      </Text>
                      <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>
                        {formatCurrency(data.hourlyRate * data.hoursWorked)}
                      </Text>
                    </View>
                    {data.overtimeHours > 0 && (
                      <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, { flex: 2 }]}>
                          Overtime Pay ({data.overtimeHours} hrs)
                        </Text>
                        <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>
                          {formatCurrency(data.overtimeHours * (data.overtimeRate || data.hourlyRate * 1.5))}
                        </Text>
                      </View>
                    )}
                  </>
                ) : (
                  <View style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 2 }]}>Salary</Text>
                    <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>
                      {formatCurrency(data.salary)}
                    </Text>
                  </View>
                )}

                {data.bonusAmount > 0 && (
                  <View style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 2 }]}>Bonus</Text>
                    <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>
                      {formatCurrency(data.bonusAmount)}
                    </Text>
                  </View>
                )}

                {data.commissionAmount > 0 && (
                  <View style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 2 }]}>Commission</Text>
                    <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>
                      {formatCurrency(data.commissionAmount)}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryText}>GROSS PAY</Text>
                <Text style={styles.summaryAmount}>{formatCurrency(data.grossPay)}</Text>
              </View>
            </View>

            <View style={styles.column}>
              <Text style={styles.sectionTitle}>Deductions</Text>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderText, { flex: 2 }]}>Description</Text>
                  <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Amount</Text>
                </View>

                {data.federalTax > 0 && (
                  <View style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 2 }]}>Federal Tax</Text>
                    <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>
                      {formatCurrency(data.federalTax)}
                    </Text>
                  </View>
                )}

                {data.stateTax > 0 && (
                  <View style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 2 }]}>State Tax</Text>
                    <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>
                      {formatCurrency(data.stateTax)}
                    </Text>
                  </View>
                )}

                {data.socialSecurity > 0 && (
                  <View style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 2 }]}>Social Security</Text>
                    <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>
                      {formatCurrency(data.socialSecurity)}
                    </Text>
                  </View>
                )}

                {data.medicare > 0 && (
                  <View style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 2 }]}>Medicare</Text>
                    <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>
                      {formatCurrency(data.medicare)}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryText}>TOTAL DEDUCTIONS</Text>
                <Text style={styles.summaryAmount}>{formatCurrency(data.totalDeductions)}</Text>
              </View>
            </View>
          </View>

          {/* Net Pay */}
          <View style={styles.netPaySection}>
            <View style={styles.netPayBox}>
              <Text style={styles.netPayLabel}>NET PAY</Text>
              <Text style={styles.netPayAmount}>{formatCurrency(data.netPay)}</Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text>This is a computer-generated payroll statement and does not require a signature.</Text>
            <Text>Please retain this statement for your records.</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
