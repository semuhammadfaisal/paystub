interface TaxReturnData {
  firstName: string
  lastName: string
  ssn: string
  dateOfBirth: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  email: string
  filingStatus: string
  spouseFirstName: string
  spouseLastName: string
  spouseSSN: string
  spouseDateOfBirth: string
  wages: number
  interestIncome: number
  dividendIncome: number
  businessIncome: number
  capitalGains: number
  otherIncome: number
  standardDeduction: boolean
  itemizedDeductions: number
  mortgageInterest: number
  stateLocalTaxes: number
  charitableContributions: number
  medicalExpenses: number
  federalTaxWithheld: number
  estimatedTaxPayments: number
  refundableCredits: number
  dependents: Array<{
    name: string
    ssn: string
    relationship: string
    dateOfBirth: string
  }>
}

export async function generateTaxReturnPDF(data: TaxReturnData, refundOrOwed: number) {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")!

  // Set canvas size for letter format (8.5" x 11" at 96 DPI)
  canvas.width = 816
  canvas.height = 1056

  // White background
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Set default font
  ctx.fillStyle = "#000000"
  ctx.font = "12px Arial"

  let y = 40

  // Header
  ctx.fillStyle = "#1e40af"
  ctx.fillRect(20, y, canvas.width - 40, 60)

  ctx.fillStyle = "#ffffff"
  ctx.font = "bold 18px Arial"
  ctx.fillText("U.S. INDIVIDUAL INCOME TAX RETURN", 40, y + 25)
  ctx.font = "bold 14px Arial"
  ctx.fillText("Form 1040", 40, y + 45)
  ctx.fillText(`Tax Year ${new Date().getFullYear() - 1}`, canvas.width - 200, y + 45)

  y += 80

  // Personal Information Section
  ctx.fillStyle = "#000000"
  ctx.font = "bold 14px Arial"
  ctx.fillText("PERSONAL INFORMATION", 40, y)
  y += 25

  // Draw border for personal info section
  ctx.strokeStyle = "#cccccc"
  ctx.strokeRect(40, y, canvas.width - 80, 120)

  ctx.font = "12px Arial"
  ctx.fillText(`Name: ${data.firstName} ${data.lastName}`, 60, y + 25)
  ctx.fillText(`Social Security Number: ${data.ssn}`, 60, y + 45)
  ctx.fillText(`Date of Birth: ${data.dateOfBirth}`, 60, y + 65)
  ctx.fillText(`Address: ${data.address}`, 60, y + 85)
  ctx.fillText(`City, State, ZIP: ${data.city}, ${data.state} ${data.zipCode}`, 60, y + 105)

  // Filing Status
  ctx.fillText(`Filing Status: ${data.filingStatus.replace("-", " ").toUpperCase()}`, 400, y + 25)
  if (data.dependents.length > 0) {
    ctx.fillText(`Dependents: ${data.dependents.length}`, 400, y + 45)
  }

  y += 140

  // Income Section
  ctx.font = "bold 14px Arial"
  ctx.fillText("INCOME", 40, y)
  y += 25

  ctx.strokeRect(40, y, canvas.width - 80, 160)

  ctx.font = "12px Arial"
  const totalIncome =
    data.wages + data.interestIncome + data.dividendIncome + data.businessIncome + data.capitalGains + data.otherIncome

  let incomeY = y + 25
  if (data.wages > 0) {
    ctx.fillText(`Wages, salaries, tips:`, 60, incomeY)
    ctx.fillText(`$${data.wages.toLocaleString()}`, 400, incomeY)
    incomeY += 20
  }
  if (data.interestIncome > 0) {
    ctx.fillText(`Interest income:`, 60, incomeY)
    ctx.fillText(`$${data.interestIncome.toLocaleString()}`, 400, incomeY)
    incomeY += 20
  }
  if (data.dividendIncome > 0) {
    ctx.fillText(`Dividend income:`, 60, incomeY)
    ctx.fillText(`$${data.dividendIncome.toLocaleString()}`, 400, incomeY)
    incomeY += 20
  }
  if (data.businessIncome > 0) {
    ctx.fillText(`Business income:`, 60, incomeY)
    ctx.fillText(`$${data.businessIncome.toLocaleString()}`, 400, incomeY)
    incomeY += 20
  }
  if (data.capitalGains > 0) {
    ctx.fillText(`Capital gains:`, 60, incomeY)
    ctx.fillText(`$${data.capitalGains.toLocaleString()}`, 400, incomeY)
    incomeY += 20
  }
  if (data.otherIncome > 0) {
    ctx.fillText(`Other income:`, 60, incomeY)
    ctx.fillText(`$${data.otherIncome.toLocaleString()}`, 400, incomeY)
    incomeY += 20
  }

  // Total Income line
  ctx.strokeStyle = "#000000"
  ctx.beginPath()
  ctx.moveTo(60, incomeY + 5)
  ctx.lineTo(canvas.width - 60, incomeY + 5)
  ctx.stroke()

  ctx.font = "bold 12px Arial"
  ctx.fillText(`Total Income:`, 60, incomeY + 25)
  ctx.fillText(`$${totalIncome.toLocaleString()}`, 400, incomeY + 25)

  y += 180

  // Deductions Section
  ctx.font = "bold 14px Arial"
  ctx.fillText("DEDUCTIONS AND TAX CALCULATION", 40, y)
  y += 25

  ctx.strokeRect(40, y, canvas.width - 80, 140)

  ctx.font = "12px Arial"
  const deduction = data.standardDeduction ? 13850 : data.itemizedDeductions
  const taxableIncome = Math.max(0, totalIncome - deduction)

  // Simplified tax calculation
  let taxOwed = 0
  if (taxableIncome > 0) {
    if (taxableIncome <= 11000) {
      taxOwed = taxableIncome * 0.1
    } else if (taxableIncome <= 44725) {
      taxOwed = 1100 + (taxableIncome - 11000) * 0.12
    } else if (taxableIncome <= 95375) {
      taxOwed = 5147 + (taxableIncome - 44725) * 0.22
    } else {
      taxOwed = 16290 + (taxableIncome - 95375) * 0.24
    }
  }
  taxOwed = Math.round(taxOwed)

  ctx.fillText(`Adjusted Gross Income:`, 60, y + 25)
  ctx.fillText(`$${totalIncome.toLocaleString()}`, 400, y + 25)

  ctx.fillText(`${data.standardDeduction ? "Standard" : "Itemized"} Deduction:`, 60, y + 45)
  ctx.fillText(`$${deduction.toLocaleString()}`, 400, y + 45)

  ctx.fillText(`Taxable Income:`, 60, y + 65)
  ctx.fillText(`$${taxableIncome.toLocaleString()}`, 400, y + 65)

  ctx.fillText(`Tax Owed:`, 60, y + 85)
  ctx.fillText(`$${taxOwed.toLocaleString()}`, 400, y + 85)

  const totalPayments = data.federalTaxWithheld + data.estimatedTaxPayments + data.refundableCredits
  ctx.fillText(`Total Payments:`, 60, y + 105)
  ctx.fillText(`$${totalPayments.toLocaleString()}`, 400, y + 105)

  y += 160

  // Refund/Owed Section
  ctx.fillStyle = refundOrOwed >= 0 ? "#16a34a" : "#dc2626"
  ctx.fillRect(40, y, canvas.width - 80, 50)

  ctx.fillStyle = "#ffffff"
  ctx.font = "bold 16px Arial"
  const refundText = refundOrOwed >= 0 ? "REFUND AMOUNT" : "AMOUNT OWED"
  ctx.fillText(refundText, 60, y + 20)
  ctx.fillText(`$${Math.abs(refundOrOwed).toLocaleString()}`, 400, y + 20)

  y += 70

  // Dependents Section (if any)
  if (data.dependents.length > 0) {
    ctx.fillStyle = "#000000"
    ctx.font = "bold 14px Arial"
    ctx.fillText("DEPENDENTS", 40, y)
    y += 25

    const dependentsHeight = Math.max(60, data.dependents.length * 20 + 40)
    ctx.strokeStyle = "#cccccc"
    ctx.strokeRect(40, y, canvas.width - 80, dependentsHeight)

    ctx.font = "12px Arial"
    data.dependents.forEach((dependent, index) => {
      const depY = y + 25 + index * 20
      ctx.fillText(`${index + 1}. ${dependent.name}`, 60, depY)
      ctx.fillText(`SSN: ${dependent.ssn}`, 300, depY)
      ctx.fillText(`${dependent.relationship}`, 500, depY)
    })

    y += dependentsHeight + 20
  }

  // Footer
  ctx.fillStyle = "#666666"
  ctx.font = "10px Arial"
  ctx.fillText("This is a computer-generated tax return document.", 40, canvas.height - 40)
  ctx.fillText("Please retain this document for your records.", 40, canvas.height - 25)
  ctx.fillText(`Generated on: ${new Date().toLocaleDateString()}`, canvas.width - 200, canvas.height - 25)

  // Convert to blob and download
  canvas.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `tax-return-${data.firstName}-${data.lastName}-${new Date().getFullYear() - 1}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }, "application/pdf")
}
