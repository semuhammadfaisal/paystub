"use client"

import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 40,
    position: 'relative',
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '30%',
    transform: 'rotate(-45deg)',
    fontSize: 100,
    color: 'rgba(200,200,200,0.2)',
    fontWeight: 700,
    letterSpacing: 10,
    opacity: 0.2,
  },
  container: {
    border: '2px solid #333',
    padding: 20,
    backgroundColor: '#ffffff',
    maxWidth: 600,
    margin: '0 auto',
  },
  header: {
    borderBottom: '3px solid #333',
    paddingBottom: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  companyDetails: {
    fontSize: 10,
    lineHeight: 1.4,
    marginBottom: 4,
  },
  paystubBox: {
    backgroundColor: '#239BA0',
    color: '#ffffff',
    padding: '8px 16px',
    borderRadius: 4,
    fontWeight: 'bold',
    fontSize: 14,
  },
  payDateInfo: {
    textAlign: 'right',
    fontSize: 10,
  },
  employeeSection: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  employeeInfo: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#239BA0',
    borderBottom: '1px solid #239BA0',
    paddingBottom: 2,
  },
  employeeText: {
    fontSize: 10,
    marginBottom: 2,
  },
  payInfo: {
    width: 200,
  },
  earningsSection: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  earnings: {
    flex: 1,
  },
  deductions: {
    flex: 1,
    marginLeft: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #ddd',
    padding: '4px 0',
    marginBottom: 8,
  },
  tableHeaderText: {
    fontSize: 10,
    fontWeight: 'bold',
    padding: '0 8px',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #eee',
    padding: '2px 0',
    fontSize: 9,
  },
  tableCell: {
    padding: '0 8px',
  },
  netPay: {
    borderTop: '3px solid #333',
    paddingTop: 15,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  netPayBox: {
    backgroundColor: '#239BA0',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  netPayLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  netPayAmount: {
    fontSize: 20,
    fontWeight: 'extrabold',
  },
  footer: {
    marginTop: 20,
    fontSize: 8,
    textAlign: 'center',
    color: '#666',
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

export function ClassicPDF({ data }) {
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

            <View style={{ alignItems: 'flex-end' }}>
              <View style={styles.paystubBox}>
                <Text>Paystub</Text>
              </View>
              <View style={styles.payDateInfo}>
                <Text>Pay Date: {formatDate(data.payDate)}</Text>
                <Text>Pay Period: {formatDate(data.payPeriodStart)} - {formatDate(data.payPeriodEnd)}</Text>
              </View>
            </View>
          </View>

          {/* Employee Information */}
          <View style={styles.employeeSection}>
            <View style={styles.employeeInfo}>
              <Text style={styles.sectionTitle}>EMPLOYEE INFORMATION</Text>
              <Text style={styles.employeeText}>{data.employeeName || "Employee Name"}</Text>
              <Text style={styles.employeeText}>{data.employeeAddress || "Employee Address"}</Text>
              <Text style={styles.employeeText}>
                {data.employeeCity || "City"}, {data.employeeState || "ST"} {data.employeeZip || "ZIP"}
              </Text>
              <Text style={styles.employeeText}>SSN: {maskSSN(data.employeeSSN)}</Text>
              {data.employeeId && <Text style={styles.employeeText}>Employee ID: {data.employeeId}</Text>}
              {data.employeePhone && <Text style={styles.employeeText}>Phone: {data.employeePhone}</Text>}
            </View>

            <View style={styles.payInfo}>
              <Text style={styles.sectionTitle}>PAY INFORMATION</Text>
              <Text style={styles.employeeText}>Pay Frequency: {data.payFrequency || "Bi-Weekly"}</Text>
              <Text style={styles.employeeText}>Pay Type: {data.payType === "hourly" ? "Hourly" : "Salary"}</Text>
              {data.payType === "hourly" && (
                <>
                  <Text style={styles.employeeText}>Hourly Rate: {formatCurrency(data.hourlyRate)}</Text>
                  <Text style={styles.employeeText}>Hours Worked: {data.hoursWorked}</Text>
                  {data.overtimeHours > 0 && (
                    <Text style={styles.employeeText}>
                      Overtime Hours: {data.overtimeHours} @ {formatCurrency(data.overtimeRate)}
                    </Text>
                  )}
                </>
              )}
            </View>
          </View>

          {/* Earnings and Deductions */}
          <View style={styles.earningsSection}>
            <View style={styles.earnings}>
              <Text style={styles.sectionTitle}>EARNINGS</Text>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, { flex: 2 }]}>Description</Text>
                <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Amount</Text>
              </View>

              {data.payType === "hourly" ? (
                <>
                  <View style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 2 }]}>Regular Pay ({data.hoursWorked} hrs)</Text>
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

              <View style={[styles.tableRow, { borderBottom: '2px solid #333', paddingBottom: 8 }]}>
                <Text style={[styles.tableCell, { flex: 2, fontWeight: 'bold' }]}>GROSS PAY</Text>
                <Text style={[styles.tableCell, { flex: 1, textAlign: 'right', fontWeight: 'bold' }]}>
                  {formatCurrency(data.grossPay)}
                </Text>
              </View>
            </View>

            <View style={styles.deductions}>
              <Text style={styles.sectionTitle}>DEDUCTIONS</Text>
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

              <View style={[styles.tableRow, { borderBottom: '2px solid #333', paddingBottom: 8 }]}>
                <Text style={[styles.tableCell, { flex: 2, fontWeight: 'bold' }]}>TOTAL DEDUCTIONS</Text>
                <Text style={[styles.tableCell, { flex: 1, textAlign: 'right', fontWeight: 'bold' }]}>
                  {formatCurrency(data.totalDeductions)}
                </Text>
              </View>
            </View>
          </View>

          {/* Net Pay */}
          <View style={styles.netPay}>
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
