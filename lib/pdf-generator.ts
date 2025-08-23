"use client"

export interface PaystubData {
  employee_name: string
  employee_address: string
  employee_ssn: string
  employer_name: string
  employer_address: string
  employer_ein: string
  pay_period_start: string
  pay_period_end: string
  pay_date: string
  pay_frequency: string
  hourly_rate?: number
  hours_worked?: number
  overtime_hours?: number
  overtime_rate?: number
  salary?: number
  bonus?: number
  commission?: number
  gross_pay: number
  federal_tax: number
  state_tax: number
  social_security: number
  medicare: number
  health_insurance: number
  dental_insurance: number
  retirement_401k: number
  other_deductions: number
  total_deductions: number
  net_pay: number
}

export function generatePaystubPDF(data: PaystubData): Promise<Blob> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!

    canvas.width = 1275
    canvas.height = 1650

    // White background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Helper functions
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      }).format(amount)
    }

    const formatDate = (dateString: string) => {
      if (!dateString) return ""
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      })
    }

    const maskSSN = (ssn: string) => {
      if (!ssn || ssn.length < 4) return "XXX-XX-XXXX"
      return `XXX-XX-${ssn.slice(-4)}`
    }

    const drawLine = (x1: number, y1: number, x2: number, y2: number, color = "#000000", width = 1) => {
      ctx.strokeStyle = color
      ctx.lineWidth = width
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }

    const drawRect = (
      x: number,
      y: number,
      width: number,
      height: number,
      fillColor?: string,
      strokeColor?: string,
      strokeWidth = 1,
    ) => {
      if (fillColor) {
        ctx.fillStyle = fillColor
        ctx.fillRect(x, y, width, height)
      }
      if (strokeColor) {
        ctx.strokeStyle = strokeColor
        ctx.lineWidth = strokeWidth
        ctx.strokeRect(x, y, width, height)
      }
    }

    const margin = 40
    const contentWidth = canvas.width - margin * 2
    let y = margin

    // Main container border
    drawRect(margin, margin, contentWidth, canvas.height - margin * 2, undefined, "#000000", 2)

    // Header section
    drawRect(margin, y, contentWidth, 80, "#f8f9fa", "#000000", 1)

    ctx.fillStyle = "#000000"
    ctx.font = "bold 24px Arial"
    ctx.textAlign = "center"
    ctx.fillText(data.employer_name || "[COMPANY NAME]", canvas.width / 2, y + 30)

    ctx.font = "14px Arial"
    ctx.fillText(data.employer_address || "[Company Address Line 1]", canvas.width / 2, y + 50)
    ctx.fillText(`Phone: [Phone Number] | Email: [Email Address]`, canvas.width / 2, y + 68)

    y += 80

    // Pay period header
    drawRect(margin, y, contentWidth, 40, "#e9ecef", "#000000", 1)
    ctx.font = "bold 16px Arial"
    ctx.fillText("EMPLOYEE PAY STATEMENT", canvas.width / 2, y + 25)

    y += 40

    // Main content area - two columns
    const leftWidth = contentWidth / 2
    const rightWidth = contentWidth / 2
    const contentHeight = 600

    // Left section border
    drawRect(margin, y, leftWidth, contentHeight, undefined, "#000000", 1)
    // Right section border
    drawRect(margin + leftWidth, y, rightWidth, contentHeight, undefined, "#000000", 1)

    // Left section - Employee Information
    let leftY = y + 20
    ctx.textAlign = "left"
    ctx.font = "bold 16px Arial"
    ctx.fillText("EMPLOYEE INFORMATION", margin + 15, leftY)

    leftY += 30

    // Employee info grid
    const infoItems = [
      { label: "Employee Name", value: data.employee_name || "[Employee Full Name]" },
      { label: "Employee ID", value: "[Employee ID]" },
      { label: "Department", value: "[Department Name]" },
      { label: "Position", value: "[Job Title]" },
      { label: "Pay Period", value: `${formatDate(data.pay_period_start)} - ${formatDate(data.pay_period_end)}` },
      { label: "Pay Date", value: formatDate(data.pay_date) },
    ]

    infoItems.forEach((item, index) => {
      const row = Math.floor(index / 2)
      const col = index % 2
      const itemX = margin + 15 + col * (leftWidth / 2 - 20)
      const itemY = leftY + row * 50

      ctx.font = "bold 12px Arial"
      ctx.fillStyle = "#666666"
      ctx.fillText(item.label.toUpperCase(), itemX, itemY)

      ctx.font = "bold 14px Arial"
      ctx.fillStyle = "#000000"
      ctx.fillText(item.value, itemX, itemY + 18)

      // Underline
      drawLine(itemX, itemY + 22, itemX + (leftWidth / 2 - 30), itemY + 22, "#dddddd", 1)
    })

    leftY += 180

    // Earnings table
    ctx.font = "bold 16px Arial"
    ctx.fillStyle = "#000000"
    ctx.fillText("EARNINGS", margin + 15, leftY)

    leftY += 25

    // Earnings table header
    const tableWidth = leftWidth - 30
    const colWidths = [tableWidth * 0.35, tableWidth * 0.15, tableWidth * 0.15, tableWidth * 0.175, tableWidth * 0.175]

    drawRect(margin + 15, leftY, tableWidth, 30, "#f8f9fa", "#000000", 1)

    ctx.font = "bold 12px Arial"
    ctx.fillStyle = "#000000"
    const headers = ["Description", "Hours", "Rate", "Current", "YTD"]
    let headerX = margin + 15

    headers.forEach((header, index) => {
      ctx.fillText(header.toUpperCase(), headerX + 5, leftY + 20)
      if (index < headers.length - 1) {
        drawLine(headerX + colWidths[index], leftY, headerX + colWidths[index], leftY + 30, "#000000", 1)
      }
      headerX += colWidths[index]
    })

    leftY += 30

    // Earnings rows
    const earningsData = [
      {
        desc: "Regular Hours",
        hours: data.hours_worked || 80,
        rate: data.hourly_rate || 25,
        current: (data.hours_worked || 80) * (data.hourly_rate || 25),
        ytd: (data.hours_worked || 80) * (data.hourly_rate || 25) * 12,
      },
      {
        desc: "Overtime Hours",
        hours: data.overtime_hours || 5,
        rate: data.overtime_rate || 37.5,
        current: (data.overtime_hours || 5) * (data.overtime_rate || 37.5),
        ytd: (data.overtime_hours || 5) * (data.overtime_rate || 37.5) * 12,
      },
      {
        desc: "Holiday Pay",
        hours: 8,
        rate: data.hourly_rate || 25,
        current: 8 * (data.hourly_rate || 25),
        ytd: 8 * (data.hourly_rate || 25) * 4,
      },
    ]

    ctx.font = "12px Arial"
    earningsData.forEach((row, index) => {
      const rowY = leftY + index * 25
      drawRect(margin + 15, rowY, tableWidth, 25, undefined, "#cccccc", 1)

      let cellX = margin + 15
      ctx.textAlign = "left"
      ctx.fillText(row.desc, cellX + 5, rowY + 16)
      cellX += colWidths[0]

      ctx.textAlign = "right"
      ctx.fillText(row.hours.toFixed(2), cellX - 5, rowY + 16)
      cellX += colWidths[1]

      ctx.fillText(formatCurrency(row.rate), cellX - 5, rowY + 16)
      cellX += colWidths[2]

      ctx.fillText(formatCurrency(row.current), cellX - 5, rowY + 16)
      cellX += colWidths[3]

      ctx.fillText(formatCurrency(row.ytd), cellX - 5, rowY + 16)
    })

    leftY += 75

    // Total gross pay row
    drawRect(margin + 15, leftY, tableWidth, 30, "#f8f9fa", "#000000", 1)
    ctx.font = "bold 12px Arial"
    ctx.textAlign = "left"
    ctx.fillText("TOTAL GROSS PAY", margin + 20, leftY + 20)

    ctx.textAlign = "right"
    const totalHours = earningsData.reduce((sum, row) => sum + row.hours, 0)
    const totalCurrent = earningsData.reduce((sum, row) => sum + row.current, 0)
    const totalYTD = earningsData.reduce((sum, row) => sum + row.ytd, 0)

    let totalX = margin + 15 + colWidths[0]
    ctx.fillText(totalHours.toFixed(2), totalX - 5, leftY + 20)
    totalX += colWidths[1] + colWidths[2]
    ctx.fillText(formatCurrency(totalCurrent), totalX - 5, leftY + 20)
    totalX += colWidths[3]
    ctx.fillText(formatCurrency(totalYTD), totalX - 5, leftY + 20)

    // Right section - Deductions
    let rightY = y + 20
    ctx.textAlign = "left"
    ctx.font = "bold 16px Arial"
    ctx.fillText("TAX DEDUCTIONS", margin + leftWidth + 15, rightY)

    rightY += 25

    // Tax deductions table
    const rightTableWidth = rightWidth - 30
    const rightColWidths = [rightTableWidth * 0.6, rightTableWidth * 0.2, rightTableWidth * 0.2]

    drawRect(margin + leftWidth + 15, rightY, rightTableWidth, 30, "#f8f9fa", "#000000", 1)

    ctx.font = "bold 12px Arial"
    const rightHeaders = ["Description", "Current", "YTD"]
    let rightHeaderX = margin + leftWidth + 15

    rightHeaders.forEach((header, index) => {
      ctx.fillText(header.toUpperCase(), rightHeaderX + 5, rightY + 20)
      if (index < rightHeaders.length - 1) {
        drawLine(
          rightHeaderX + rightColWidths[index],
          rightY,
          rightHeaderX + rightColWidths[index],
          rightY + 30,
          "#000000",
          1,
        )
      }
      rightHeaderX += rightColWidths[index]
    })

    rightY += 30

    // Tax deductions data
    const taxDeductions = [
      { desc: "Federal Income Tax", current: data.federal_tax || 358.12, ytd: (data.federal_tax || 358.12) * 12 },
      { desc: "State Income Tax", current: data.state_tax || 119.38, ytd: (data.state_tax || 119.38) * 12 },
      { desc: "Social Security", current: data.social_security || 148.03, ytd: (data.social_security || 148.03) * 12 },
      { desc: "Medicare", current: data.medicare || 34.62, ytd: (data.medicare || 34.62) * 12 },
      { desc: "State Disability", current: 23.88, ytd: 23.88 * 12 },
    ]

    ctx.font = "12px Arial"
    taxDeductions.forEach((row, index) => {
      const rowY = rightY + index * 25
      drawRect(margin + leftWidth + 15, rowY, rightTableWidth, 25, undefined, "#cccccc", 1)

      ctx.textAlign = "left"
      ctx.fillText(row.desc, margin + leftWidth + 20, rowY + 16)

      ctx.textAlign = "right"
      let cellX = margin + leftWidth + 15 + rightColWidths[0]
      ctx.fillText(formatCurrency(row.current), cellX - 5, rowY + 16)
      cellX += rightColWidths[1]
      ctx.fillText(formatCurrency(row.ytd), cellX - 5, rowY + 16)
    })

    rightY += 150

    // Other deductions
    ctx.textAlign = "left"
    ctx.font = "bold 16px Arial"
    ctx.fillText("OTHER DEDUCTIONS", margin + leftWidth + 15, rightY)

    rightY += 25

    // Other deductions table header
    drawRect(margin + leftWidth + 15, rightY, rightTableWidth, 30, "#f8f9fa", "#000000", 1)

    ctx.font = "bold 12px Arial"
    rightHeaderX = margin + leftWidth + 15

    rightHeaders.forEach((header, index) => {
      ctx.fillText(header.toUpperCase(), rightHeaderX + 5, rightY + 20)
      if (index < rightHeaders.length - 1) {
        drawLine(
          rightHeaderX + rightColWidths[index],
          rightY,
          rightHeaderX + rightColWidths[index],
          rightY + 30,
          "#000000",
          1,
        )
      }
      rightHeaderX += rightColWidths[index]
    })

    rightY += 30

    // Other deductions data
    const otherDeductions = [
      { desc: "Health Insurance", current: data.health_insurance || 125, ytd: (data.health_insurance || 125) * 12 },
      { desc: "Dental Insurance", current: data.dental_insurance || 25, ytd: (data.dental_insurance || 25) * 12 },
      {
        desc: "401(k) Contribution",
        current: data.retirement_401k || 143.25,
        ytd: (data.retirement_401k || 143.25) * 12,
      },
      { desc: "Life Insurance", current: 15, ytd: 15 * 12 },
    ]

    ctx.font = "12px Arial"
    otherDeductions.forEach((row, index) => {
      const rowY = rightY + index * 25
      drawRect(margin + leftWidth + 15, rowY, rightTableWidth, 25, undefined, "#cccccc", 1)

      ctx.textAlign = "left"
      ctx.fillText(row.desc, margin + leftWidth + 20, rowY + 16)

      ctx.textAlign = "right"
      let cellX = margin + leftWidth + 15 + rightColWidths[0]
      ctx.fillText(formatCurrency(row.current), cellX - 5, rowY + 16)
      cellX += rightColWidths[1]
      ctx.fillText(formatCurrency(row.ytd), cellX - 5, rowY + 16)
    })

    rightY += 125

    // Total deductions row
    drawRect(margin + leftWidth + 15, rightY, rightTableWidth, 30, "#f8f9fa", "#000000", 1)
    ctx.font = "bold 12px Arial"
    ctx.textAlign = "left"
    ctx.fillText("TOTAL DEDUCTIONS", margin + leftWidth + 20, rightY + 20)

    ctx.textAlign = "right"
    const totalDeductionsCurrent = [...taxDeductions, ...otherDeductions].reduce((sum, row) => sum + row.current, 0)
    const totalDeductionsYTD = [...taxDeductions, ...otherDeductions].reduce((sum, row) => sum + row.ytd, 0)

    let deductionX = margin + leftWidth + 15 + rightColWidths[0]
    ctx.fillText(formatCurrency(totalDeductionsCurrent), deductionX - 5, rightY + 20)
    deductionX += rightColWidths[1]
    ctx.fillText(formatCurrency(totalDeductionsYTD), deductionX - 5, rightY + 20)

    y += contentHeight + 20

    // Net Pay section
    drawRect(margin, y, contentWidth, 60, "#f8f9fa", "#000000", 2)

    ctx.font = "bold 16px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Net Pay", canvas.width / 2, y + 20)

    ctx.font = "bold 32px Arial"
    const netPay = totalCurrent - totalDeductionsCurrent
    ctx.fillText(formatCurrency(netPay), canvas.width / 2, y + 50)

    y += 80

    // YTD Summary section
    drawRect(margin, y, contentWidth, 80, "#ffffff", "#000000", 1)

    const ytdSectionWidth = contentWidth / 3

    // YTD Gross Pay
    ctx.font = "bold 12px Arial"
    ctx.textAlign = "center"
    ctx.fillText("YTD GROSS PAY", margin + ytdSectionWidth / 2, y + 20)
    drawRect(margin + 20, y + 30, ytdSectionWidth - 40, 35, "#ffffff", "#dddddd", 1)
    ctx.font = "bold 18px Arial"
    ctx.fillText(formatCurrency(totalYTD), margin + ytdSectionWidth / 2, y + 52)

    // YTD Deductions
    ctx.font = "bold 12px Arial"
    ctx.fillText("YTD DEDUCTIONS", margin + ytdSectionWidth + ytdSectionWidth / 2, y + 20)
    drawRect(margin + ytdSectionWidth + 20, y + 30, ytdSectionWidth - 40, 35, "#ffffff", "#dddddd", 1)
    ctx.font = "bold 18px Arial"
    ctx.fillText(formatCurrency(totalDeductionsYTD), margin + ytdSectionWidth + ytdSectionWidth / 2, y + 52)

    // YTD Net Pay
    ctx.font = "bold 12px Arial"
    ctx.fillText("YTD NET PAY", margin + ytdSectionWidth * 2 + ytdSectionWidth / 2, y + 20)
    drawRect(margin + ytdSectionWidth * 2 + 20, y + 30, ytdSectionWidth - 40, 35, "#ffffff", "#dddddd", 1)
    ctx.font = "bold 18px Arial"
    ctx.fillText(
      formatCurrency(totalYTD - totalDeductionsYTD),
      margin + ytdSectionWidth * 2 + ytdSectionWidth / 2,
      y + 52,
    )

    y += 100

    // Footer
    drawRect(margin, y, contentWidth, 60, undefined, "#000000", 1)

    ctx.font = "11px Arial"
    ctx.textAlign = "center"
    ctx.fillStyle = "#666666"
    ctx.fillText(
      "This statement is for informational purposes only and serves as a record of your earnings and deductions.",
      canvas.width / 2,
      y + 20,
    )
    ctx.font = "italic 11px Arial"
    ctx.fillText(
      "Please retain this pay statement for your records. Contact HR department for any questions or discrepancies.",
      canvas.width / 2,
      y + 40,
    )

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      resolve(blob!)
    }, "image/png")
  })
}

export function downloadPDF(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
