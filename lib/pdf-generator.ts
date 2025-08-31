"use client"
import { jsPDF } from "jspdf"

export interface PaystubData {
  // Basic employee and employer info
  employee_name: string
  employee_address: string
  employee_ssn: string
  employee_id?: string
  employee_phone?: string
  employer_name: string
  employer_address: string
  employer_ein: string
  employer_phone?: string
  employer_logo?: string

  // Pay period details
  pay_period_start: string
  pay_period_end: string
  pay_date: string
  pay_frequency: string

  // Earnings
  pay_type: "hourly" | "salary"
  hourly_rate?: number
  hours_worked?: number
  overtime_hours?: number
  overtime_rate?: number
  salary?: number
  bonus?: number
  commission?: number
  holiday_hours?: number
  sick_hours?: number
  vacation_hours?: number
  gross_pay: number

  // Deductions
  federal_tax: number
  state_tax: number
  social_security: number
  medicare: number
  state_disability?: number
  health_insurance: number
  dental_insurance: number
  vision_insurance?: number
  life_insurance?: number
  retirement_401k: number
  roth_ira?: number
  hsa?: number
  parking_fee?: number
  union_dues?: number
  other_deductions: number
  total_deductions: number
  net_pay: number

  // Year-to-Date totals
  ytd_gross_pay?: number
  ytd_federal_tax?: number
  ytd_state_tax?: number
  ytd_social_security?: number
  ytd_medicare?: number
  ytd_total_deductions?: number
  ytd_net_pay?: number
}

export function generatePaystubPDF(data: PaystubData): Promise<Blob> {
  return new Promise(async (resolve) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!

    // Higher resolution for better quality
    const scale = 2
    canvas.width = 850 * scale
    canvas.height = 1100 * scale
    ctx.scale(scale, scale)

    const canvasWidth = 850
    const canvasHeight = 1100

    // White background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

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
        year: "numeric"
      })
    }

    const maskSSN = (ssn: string) => {
      if (!ssn || ssn.length < 4) return "XXX-XX-XXXX"
      return `XXX-XX-${ssn.slice(-4)}`
    }

    const drawLine = (x1: number, y1: number, x2: number, y2: number, color = "#000000", width = 1) => {
      ctx.save()
      ctx.strokeStyle = color
      ctx.lineWidth = width
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
      ctx.restore()
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
      ctx.save()
      if (fillColor) {
        ctx.fillStyle = fillColor
        ctx.fillRect(x, y, width, height)
      }
      if (strokeColor) {
        ctx.strokeStyle = strokeColor
        ctx.lineWidth = strokeWidth
        ctx.strokeRect(x, y, width, height)
      }
      ctx.restore()
    }

    const drawText = (text: string, x: number, y: number, font: string, color = "#000000", align: CanvasTextAlign = "left") => {
      ctx.save()
      ctx.font = font
      ctx.fillStyle = color
      ctx.textAlign = align
      ctx.textBaseline = "middle"
      ctx.fillText(text, x, y)
      ctx.restore()
    }

    const margin = 48
    const contentWidth = canvasWidth - margin * 2
    let y = margin

    // Main container border (subtle gray border)
    drawRect(margin, margin, contentWidth, canvasHeight - margin * 2, "#ffffff", "#e5e7eb", 1)

    y += 30

    // Header section with logo and company info layout
    const headerStartY = y
    
    // Company logo (if provided) - position first to get dimensions
    let logoWidth = 0
    let logoHeight = 0
    if (data.employer_logo) {
      console.log('Logo data present, length:', data.employer_logo.length)
      console.log('Logo data starts with:', data.employer_logo.substring(0, 50))
      
      // Create image element to load the logo
      const logoImg = new Image()
      logoImg.crossOrigin = "anonymous"
      
      // Set up logo promise to handle async loading
      const logoPromise = new Promise<void>((resolve) => {
        logoImg.onload = () => {
          console.log('Logo loaded successfully, dimensions:', logoImg.width, 'x', logoImg.height)
          // Calculate logo dimensions (max 64px height to match preview)
          const maxLogoHeight = 64
          const logoAspectRatio = logoImg.width / logoImg.height
          logoWidth = maxLogoHeight * logoAspectRatio
          logoHeight = maxLogoHeight
          
          // Position logo at the very start of the left side (like preview)
          const logoX = margin + 30
          const logoY = headerStartY
          
          console.log('Drawing logo at:', logoX, logoY, 'size:', logoWidth, 'x', logoHeight)
          // Draw logo image
          ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight)
          resolve()
        }
        
        logoImg.onerror = () => {
          // If logo fails to load, just continue without it
          console.warn('Logo failed to load:', data.employer_logo?.substring(0, 50) + '...')
          resolve()
        }
        
        logoImg.src = data.employer_logo!
      })
      
      // Wait for logo to load before continuing
      await logoPromise
      console.log('Logo promise resolved')
    } else {
      console.log('No logo data present')
    }
    
    // Company info positioned next to logo (with gap)
    const companyInfoX = margin + 30 + logoWidth + (logoWidth > 0 ? 20 : 0) // 20px gap if logo exists
    
    // Company name and title
    drawText("PAYROLL STATEMENT", companyInfoX, y, "bold 24px 'Times New Roman'", "#1f2937")
    drawText(data.employer_name || "Company Name", companyInfoX, y + 32, "bold 18px 'Times New Roman'", "#1f2937")
    
    // Company address, phone, and EIN
    drawText(data.employer_address || "Company Address", companyInfoX, y + 56, "12px 'Times New Roman'", "#4b5563")
    if (data.employer_phone) {
      drawText(`Phone: ${data.employer_phone}`, companyInfoX, y + 70, "12px 'Times New Roman'", "#4b5563")
    }
    drawText(`EIN: ${data.employer_ein || "XX-XXXXXXX"}`, companyInfoX, y + (data.employer_phone ? 90 : 70), "12px 'Times New Roman'", "#4b5563")

    // Paystub box (custom teal background)
    const payStubBoxWidth = 120
    const payStubBoxHeight = 30
    const payStubBoxX = canvasWidth - margin - payStubBoxWidth - 30
    drawRect(payStubBoxX, y - 5, payStubBoxWidth, payStubBoxHeight, "#239BA0")
    drawText("Paystub", payStubBoxX + payStubBoxWidth / 2, y + 10, "bold 14px 'Times New Roman'", "#ffffff", "center")

    // Pay dates (right aligned)
    drawText(`Pay Date: ${formatDate(data.pay_date)}`, canvasWidth - margin - 30, y + 45, "11px 'Times New Roman'", "#4b5563", "right")
    drawText(`Pay Period: ${formatDate(data.pay_period_start)} - ${formatDate(data.pay_period_end)}`, canvasWidth - margin - 30, y + 65, "11px 'Times New Roman'", "#4b5563", "right")

    // Header separator line – add extra space if employer phone is printed or logo is present
    const hasLogo = data.employer_logo ? true : false
    const headerHeight = (data.employer_phone || hasLogo) ? 110 : 90
    y += headerHeight
    drawLine(margin + 30, y, canvasWidth - margin - 30, y, "#d1d5db", 2)
    y += 30

    // Employee Information Section (two columns)
    const leftColumnX = margin + 30
    const rightColumnX = margin + 30 + (contentWidth / 2) + 20
    
    // Left column - Employee Information
    drawText("EMPLOYEE INFORMATION", leftColumnX, y, "bold 13px 'Times New Roman'", "#239BA0")
    drawLine(leftColumnX, y + 8, leftColumnX + 180, y + 8, "#cbd5e1", 1)
    
    let leftY = y + 30
    drawText(data.employee_name || "Employee Name", leftColumnX, leftY, "12px 'Times New Roman'", "#1f2937")
    leftY += 20
    drawText(data.employee_address || "Employee Address", leftColumnX, leftY, "12px 'Times New Roman'", "#1f2937")
    leftY += 20
    drawText(`SSN: ${maskSSN(data.employee_ssn)}`, leftColumnX, leftY, "12px 'Times New Roman'", "#1f2937")
    leftY += 20
    if (data.employee_id) {
      drawText(`Employee ID: ${data.employee_id}`, leftColumnX, leftY, "12px 'Times New Roman'", "#1f2937")
      leftY += 20
    }
    if (data.employee_phone) {
      drawText(`Phone: ${data.employee_phone}`, leftColumnX, leftY, "12px 'Times New Roman'", "#1f2937")
      leftY += 20
    }
    
    // Right column - Pay Information
    drawText("PAY INFORMATION", rightColumnX, y, "bold 13px 'Times New Roman'", "#239BA0")
    drawLine(rightColumnX, y + 8, rightColumnX + 180, y + 8, "#cbd5e1", 1)
    
    let rightY = y + 30
    drawText(`Pay Frequency: ${data.pay_frequency || "Bi-Weekly"}`, rightColumnX, rightY, "12px 'Times New Roman'", "#1f2937")
    rightY += 20
    
    if (data.pay_type === "hourly") {
      drawText(`Pay Type: Hourly`, rightColumnX, rightY, "12px 'Times New Roman'", "#1f2937")
      rightY += 20
      drawText(`Hourly Rate: ${formatCurrency(data.hourly_rate)}`, rightColumnX, rightY, "12px 'Times New Roman'", "#1f2937")
      rightY += 20
      drawText(`Hours Worked: ${data.hours_worked || 0}`, rightColumnX, rightY, "12px 'Times New Roman'", "#1f2937")
      if (data.overtime_hours && data.overtime_hours > 0) {
        rightY += 20
        drawText(`Overtime Hours: ${data.overtime_hours} @ ${formatCurrency(data.overtime_rate || data.hourly_rate * 1.5)}`, rightColumnX, rightY, "11px 'Times New Roman'", "#1f2937")
      }
    } else {
      drawText(`Pay Type: Salary`, rightColumnX, rightY, "12px 'Times New Roman'", "#1f2937")
      if (data.salary) {
        rightY += 20
        drawText(`Annual Salary: ${formatCurrency(data.salary)}`, rightColumnX, rightY, "12px 'Times New Roman'", "#1f2937")
      }
    }
    
    y += 140

    // Section separator
    drawLine(margin + 30, y, canvasWidth - margin - 30, y, "#d1d5db", 1)
    y += 40

    // Earnings and Deductions Section (two columns with proper spacing)
    const earningsX = leftColumnX
    const deductionsX = rightColumnX
    const columnWidth = 250
    
    // Earnings column
    drawText("EARNINGS", earningsX, y, "bold 13px 'Times New Roman'", "#239BA0")
    drawLine(earningsX, y + 8, earningsX + columnWidth - 50, y + 8, "#cbd5e1", 1)
    
    let earningsY = y + 30
    
    if (data.pay_type === "hourly") {
      // Hourly earnings breakdown
      const regularPay = (data.hours_worked || 0) * (data.hourly_rate || 0)
      drawText(`Regular Pay (${data.hours_worked || 0} hrs)`, earningsX, earningsY, "12px 'Times New Roman'", "#1f2937")
      drawText(formatCurrency(regularPay), earningsX + columnWidth - 50, earningsY, "12px 'Times New Roman'", "#1f2937", "right")
      earningsY += 22

      if (data.overtime_hours && data.overtime_hours > 0) {
        const overtimePay = data.overtime_hours * (data.overtime_rate || data.hourly_rate * 1.5)
        drawText(`Overtime Pay (${data.overtime_hours} hrs)`, earningsX, earningsY, "12px 'Times New Roman'", "#1f2937")
        drawText(formatCurrency(overtimePay), earningsX + columnWidth - 50, earningsY, "12px 'Times New Roman'", "#1f2937", "right")
        earningsY += 22
      }

      // Additional time-based earnings
      if (data.holiday_hours && data.holiday_hours > 0) {
        const holidayPay = data.holiday_hours * (data.hourly_rate || 0)
        drawText(`Holiday Pay (${data.holiday_hours} hrs)`, earningsX, earningsY, "12px 'Times New Roman'", "#1f2937")
        drawText(formatCurrency(holidayPay), earningsX + columnWidth - 50, earningsY, "12px 'Times New Roman'", "#1f2937", "right")
        earningsY += 22
      }

      if (data.sick_hours && data.sick_hours > 0) {
        const sickPay = data.sick_hours * (data.hourly_rate || 0)
        drawText(`Sick Pay (${data.sick_hours} hrs)`, earningsX, earningsY, "12px 'Times New Roman'", "#1f2937")
        drawText(formatCurrency(sickPay), earningsX + columnWidth - 50, earningsY, "12px 'Times New Roman'", "#1f2937", "right")
        earningsY += 22
      }

      if (data.vacation_hours && data.vacation_hours > 0) {
        const vacationPay = data.vacation_hours * (data.hourly_rate || 0)
        drawText(`Vacation Pay (${data.vacation_hours} hrs)`, earningsX, earningsY, "12px 'Times New Roman'", "#1f2937")
        drawText(formatCurrency(vacationPay), earningsX + columnWidth - 50, earningsY, "12px 'Times New Roman'", "#1f2937", "right")
        earningsY += 22
      }
    } else {
      // Salary earnings
      drawText("Salary", earningsX, earningsY, "12px 'Times New Roman'", "#1f2937")
      drawText(formatCurrency(data.salary || 0), earningsX + columnWidth - 50, earningsY, "12px 'Times New Roman'", "#1f2937", "right")
      earningsY += 22
    }

    // Additional earnings
    if (data.bonus && data.bonus > 0) {
      drawText("Bonus", earningsX, earningsY, "12px 'Times New Roman'", "#1f2937")
      drawText(formatCurrency(data.bonus), earningsX + columnWidth - 50, earningsY, "12px 'Times New Roman'", "#1f2937", "right")
      earningsY += 22
    }

    if (data.commission && data.commission > 0) {
      drawText("Commission", earningsX, earningsY, "12px 'Times New Roman'", "#1f2937")
      drawText(formatCurrency(data.commission), earningsX + columnWidth - 50, earningsY, "12px 'Times New Roman'", "#1f2937", "right")
      earningsY += 22
    }
    
    // Gross pay total with separator
    earningsY += 10
    drawLine(earningsX, earningsY, earningsX + columnWidth - 50, earningsY, "#9ca3af", 1)
    earningsY += 20
    drawText("GROSS PAY", earningsX, earningsY, "bold 13px 'Times New Roman'", "#1f2937")
    drawText(formatCurrency(data.gross_pay), earningsX + columnWidth - 50, earningsY, "bold 13px 'Times New Roman'", "#1f2937", "right")
    
    // Deductions column
    drawText("DEDUCTIONS", deductionsX, y, "bold 13px 'Times New Roman'", "#239BA0")
    drawLine(deductionsX, y + 8, deductionsX + columnWidth - 50, y + 8, "#cbd5e1", 1)
    
    let deductionsY = y + 30
    
    const deductions = [
      { label: "Federal Tax", amount: data.federal_tax },
      { label: "State Tax", amount: data.state_tax },
      { label: "Social Security", amount: data.social_security },
      { label: "Medicare", amount: data.medicare },
      { label: "State Disability", amount: data.state_disability },
      { label: "Health Insurance", amount: data.health_insurance },
      { label: "Dental Insurance", amount: data.dental_insurance },
      { label: "Vision Insurance", amount: data.vision_insurance },
      { label: "Life Insurance", amount: data.life_insurance },
      { label: "401(k)", amount: data.retirement_401k },
      { label: "Roth IRA", amount: data.roth_ira },
      { label: "HSA", amount: data.hsa },
      { label: "Parking Fee", amount: data.parking_fee },
      { label: "Union Dues", amount: data.union_dues },
      { label: "Other Deductions", amount: data.other_deductions },
    ]
    
    deductions.forEach(deduction => {
      if (deduction.amount > 0) {
        drawText(deduction.label, deductionsX, deductionsY, "12px 'Times New Roman'", "#1f2937")
        drawText(formatCurrency(deduction.amount), deductionsX + columnWidth - 50, deductionsY, "12px 'Times New Roman'", "#1f2937", "right")
        deductionsY += 22
      }
    })
    
    // Total deductions with separator
    deductionsY += 10
    drawLine(deductionsX, deductionsY, deductionsX + columnWidth - 50, deductionsY, "#9ca3af", 1)
    deductionsY += 20
    drawText("TOTAL DEDUCTIONS", deductionsX, deductionsY, "bold 13px 'Times New Roman'", "#1f2937")
    drawText(formatCurrency(data.total_deductions), deductionsX + columnWidth - 50, deductionsY, "bold 13px 'Times New Roman'", "#1f2937", "right")
    
    // Find the higher Y position
    const maxY = Math.max(earningsY, deductionsY)
    y = maxY + 30

    // YTD Summary
    drawText("YEAR-TO-DATE", margin + 30, y, "bold 13px 'Times New Roman'", "#239BA0")
    y += 20
    const ytdLabelX = margin + 30
    const ytdValueX = ytdLabelX + 220
    drawText("YTD Gross Pay", ytdLabelX, y, "12px 'Times New Roman'", "#1f2937")
    drawText(formatCurrency(data.ytd_gross_pay || 0), ytdValueX, y, "12px 'Times New Roman'", "#1f2937")
    y += 18
    drawText("YTD Federal Tax", ytdLabelX, y, "12px 'Times New Roman'", "#1f2937")
    drawText(formatCurrency(data.ytd_federal_tax || 0), ytdValueX, y, "12px 'Times New Roman'", "#1f2937")
    y += 18
    drawText("YTD State Tax", ytdLabelX, y, "12px 'Times New Roman'", "#1f2937")
    drawText(formatCurrency(data.ytd_state_tax || 0), ytdValueX, y, "12px 'Times New Roman'", "#1f2937")
    y += 18
    drawText("YTD Social Security", ytdLabelX, y, "12px 'Times New Roman'", "#1f2937")
    drawText(formatCurrency(data.ytd_social_security || 0), ytdValueX, y, "12px 'Times New Roman'", "#1f2937")
    y += 18
    drawText("YTD Medicare", ytdLabelX, y, "12px 'Times New Roman'", "#1f2937")
    drawText(formatCurrency(data.ytd_medicare || 0), ytdValueX, y, "12px 'Times New Roman'", "#1f2937")
    y += 18
    drawText("YTD Total Deductions", ytdLabelX, y, "12px 'Times New Roman'", "#1f2937")
    drawText(formatCurrency(data.ytd_total_deductions || 0), ytdValueX, y, "12px 'Times New Roman'", "#1f2937")
    y += 18
    drawText("YTD Net Pay", ytdLabelX, y, "bold 12px 'Times New Roman'", "#1f2937")
    drawText(formatCurrency(data.ytd_net_pay || 0), ytdValueX, y, "bold 12px 'Times New Roman'", "#1f2937")

    y += 30

    // Section separator before net pay
    drawLine(margin + 30, y, canvasWidth - margin - 30, y, "#d1d5db", 2)
    y += 30
    
    // Net Pay section with custom teal background (full width)
    const netPayHeight = 60
    drawRect(margin + 30, y, contentWidth - 60, netPayHeight, "#239BA0")
    
    // Net pay text (white on teal)
    drawText("NET PAY", margin + 50, y + netPayHeight / 2, "bold 20px 'Times New Roman'", "#ffffff")
    drawText(formatCurrency(data.net_pay), canvasWidth - margin - 50, y + netPayHeight / 2, "bold 22px 'Times New Roman'", "#ffffff", "right")
    
    y += netPayHeight + 50

    // Footer section
    drawLine(margin + 30, y, canvasWidth - margin - 30, y, "#e5e7eb", 1)
    y += 30
    
    drawText("This is a computer-generated payroll statement and does not require a signature.", canvasWidth / 2, y, "10px 'Times New Roman'", "#6b7280", "center")
    drawText("Please retain this statement for your records.", canvasWidth / 2, y + 20, "10px 'Times New Roman'", "#6b7280", "center")

    // Render to image then embed into a real PDF
    const imgData = canvas.toDataURL("image/png", 1.0)
    const pdf = new jsPDF({ unit: "pt", format: "letter", compress: true })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    // Fit image to page while preserving aspect ratio (leave uniform margins)
    const safeXMargin = 24
    const safeYMargin = 24
    const usableWidth = pageWidth - safeXMargin * 2
    const usableHeight = pageHeight - safeYMargin * 2
    const imgRatio = Math.min(usableWidth / canvasWidth, usableHeight / canvasHeight)
    const imgWidth = canvasWidth * imgRatio
    const imgHeight = canvasHeight * imgRatio
    const offsetX = (pageWidth - imgWidth) / 2
    const offsetY = (pageHeight - imgHeight) / 2

    pdf.addImage(imgData, "PNG", offsetX, offsetY, imgWidth, imgHeight)
    const pdfBlob = pdf.output("blob") as Blob
    resolve(pdfBlob)
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