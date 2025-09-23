"use client"

import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 20,
    position: 'relative',
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '30%',
    transform: 'rotate(-45deg)',
    fontSize: 80,
    color: 'rgba(200,200,200,0.2)',
    fontWeight: 700,
    letterSpacing: 6,
    opacity: 0.2,
  },
  container: {
    border: '1px solid #d1d5db',
    padding: 15,
    backgroundColor: '#ffffff',
    maxWidth: 500,
    margin: '0 auto',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottom: '2px solid #374151',
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  companyDetails: {
    fontSize: 8,
    color: '#6b7280',
    marginBottom: 2,
  },
  paystubLabel: {
    backgroundColor: '#239BA0',
    color: '#ffffff',
    padding: '4px 12px',
    borderRadius: 3,
    fontWeight: 'bold',
    fontSize: 10,
  },
  payDate: {
    fontSize: 8,
    color: '#6b7280',
    textAlign: 'right',
  },
  employeeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  employeeInfo: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#239BA0',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  employeeText: {
    fontSize: 8,
    color: '#374151',
    marginBottom: 2,
  },
  payInfo: {
    width: 150,
  },
  payRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
    fontSize: 8,
  },
  payLabel: {
    color: '#6b7280',
  },
  payValue: {
    fontWeight: 'medium',
    color: '#111827',
  },
  summarySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
  },
  summaryColumn: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
    fontSize: 8,
  },
  summaryLabel: {
    color: '#6b7280',
  },
  summaryValue: {
    fontWeight: 'medium',
    color: '#111827',
  },
  netPay: {
    borderTop: '2px solid #374151',
    paddingTop: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  netPayBox: {
    backgroundColor: '#239BA0',
    color: '#ffffff',
    padding: '8px 16px',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  netPayLabel: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  netPayAmount: {
    fontSize: 14,
    fontWeight: 'extrabold',
  },
  footer: {
    marginTop: 10,
    fontSize: 7,
    textAlign: 'center',
    color: '#9ca3af',
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

export function CompactPDF({ data }) {
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
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <View style={styles.paystubLabel}>
                <Text>Paystub</Text>
              </View>
              <Text style={styles.payDate}>
                Pay Date: {formatDate(data.payDate)}
              </Text>
            </View>
          </View>

          {/* Employee Information */}
          <View style={styles.employeeRow}>
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

            <View style={styles.payInfo}>
              <Text style={styles.sectionTitle}>Pay Information</Text>
              <View style={styles.payRow}>
                <Text style={styles.payLabel}>Pay Frequency:</Text>
                <Text style={styles.payValue}>{data.payFrequency || "Bi-Weekly"}</Text>
              </View>
              <View style={styles.payRow}>
                <Text style={styles.payLabel}>Pay Type:</Text>
                <Text style={styles.payValue}>{data.payType === "hourly" ? "Hourly" : "Salary"}</Text>
              </View>
              {data.payType === "hourly" && (
                <>
                  <View style={styles.payRow}>
                    <Text style={styles.payLabel}>Rate:</Text>
                    <Text style={styles.payValue}>{formatCurrency(data.hourlyRate)}</Text>
                  </View>
                  <View style={styles.payRow}>
                    <Text style={styles.payLabel}>Hours:</Text>
                    <Text style={styles.payValue}>{data.hoursWorked}</Text>
                  </View>
                  {data.overtimeHours > 0 && (
                    <View style={styles.payRow}>
                      <Text style={styles.payLabel}>Overtime:</Text>
                      <Text style={styles.payValue}>
                        {data.overtimeHours} @ {formatCurrency(data.overtimeRate)}
                      </Text>
                    </View>
                  )}
                </>
              )}
            </View>
          </View>

          {/* Summary Section */}
          <View style={styles.summarySection}>
            <View style={styles.summaryColumn}>
              <Text style={styles.summaryTitle}>Earnings</Text>
              {data.payType === "hourly" ? (
                <>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Regular Pay:</Text>
                    <Text style={styles.summaryValue}>
                      {formatCurrency(data.hourlyRate * data.hoursWorked)}
                    </Text>
                  </View>
                  {data.overtimeHours > 0 && (
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Overtime:</Text>
                      <Text style={styles.summaryValue}>
                        {formatCurrency(data.overtimeHours * (data.overtimeRate || data.hourlyRate * 1.5))}
                      </Text>
                    </View>
                  )}
                </>
              ) : (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Salary:</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(data.salary)}</Text>
                </View>
              )}

              {data.bonusAmount > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Bonus:</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(data.bonusAmount)}</Text>
                </View>
              )}

              {data.commissionAmount > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Commission:</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(data.commissionAmount)}</Text>
                </View>
              )}

              <View style={[styles.summaryRow, { borderTop: '1px solid #d1d5db', paddingTop: 4 }]}>
                <Text style={styles.summaryLabel}>Gross Pay:</Text>
                <Text style={styles.summaryValue}>{formatCurrency(data.grossPay)}</Text>
              </View>
            </View>

            <View style={styles.summaryColumn}>
              <Text style={styles.summaryTitle}>Deductions</Text>
              {data.federalTax > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Federal Tax:</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(data.federalTax)}</Text>
                </View>
              )}

              {data.stateTax > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>State Tax:</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(data.stateTax)}</Text>
                </View>
              )}

              {data.socialSecurity > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Social Security:</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(data.socialSecurity)}</Text>
                </View>
              )}

              {data.medicare > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Medicare:</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(data.medicare)}</Text>
                </View>
              )}

              <View style={[styles.summaryRow, { borderTop: '1px solid #d1d5db', paddingTop: 4 }]}>
                <Text style={styles.summaryLabel}>Total Deductions:</Text>
                <Text style={styles.summaryValue}>{formatCurrency(data.totalDeductions)}</Text>
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
